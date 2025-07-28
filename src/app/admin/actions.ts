// in app/admin/actions.ts
'use server';

import { supabase } from '@/utils/supabaseClient';
import { revalidatePath } from 'next/cache';

// Action to assign a course to multiple universities


export async function assignCourseAction(courseId: string, universityIds: string[]) {
  if (!courseId || universityIds.length === 0) {
    return { error: 'Course ID and University IDs are required.' };
  }

  // 1. Find which universities ALREADY have this course
  const { data: existingMappings, error: fetchError } = await supabase
    .from('university_courses')
    .select('university_id')
    .eq('course_id', courseId)
    .in('university_id', universityIds);

  if (fetchError) {
    console.error('Supabase fetch error:', fetchError);
    return { error: 'Could not verify existing assignments.' };
  }

  const existingUniIds = new Set(existingMappings.map(m => m.university_id));
  
  // 2. Filter out the ones that are already assigned
  const newMappings = universityIds
    .filter(uniId => !existingUniIds.has(uniId))
    .map(uniId => ({
      course_id: courseId,
      university_id: uniId,
    }));

  // 3. Check if there's anything new to assign
  if (newMappings.length === 0) {
    return { error: 'The selected course is already assigned to ALL selected universities.' };
  }

  // 4. Insert only the new mappings
  const { error: insertError } = await supabase.from('university_courses').insert(newMappings);

  if (insertError) {
    console.error('Supabase insert error:', insertError);
    return { error: 'Failed to assign course.' };
  }

  // 5. Revalidate and return success
  revalidatePath('/'); // <-- ADD THIS LINE
  revalidatePath('/courses');
  revalidatePath(`/courses/${courseId}`);
  newMappings.forEach((mapping) => {
    revalidatePath(`/colleges/${mapping.university_id}`);
  });
  revalidatePath('/colleges');

  return { success: '✅ Course assigned successfully!' };
}

// Action to un-assign a course from a university
// in app/admin/actions.ts

export async function unassignCourseAction(courseId: string, universityId: string) {
  if (!courseId || !universityId) {
    return { error: 'Course ID and University ID are required.' };
  }

  // Use .select().delete() to get the count of deleted rows
  const { count, error } = await supabase
    .from('university_courses')
    .delete({ count: 'exact' })
    .eq('course_id', courseId)
    .eq('university_id', universityId);

  if (error) {  
    console.error('Supabase error un-assigning course:', error);
    return { error: 'Failed to un-assign course.' };
  }
  
  // If count is 0, the mapping didn't exist
  if (count === 0) {
      return { error: 'This course was not assigned to the selected university.' };
  }

  // Revalidate and return success
  revalidatePath('/'); // <-- ADD THIS LINE
  revalidatePath('/courses');
  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/colleges/${universityId}`);
  revalidatePath('/colleges');

  return { success: '✅ Course un-assigned successfully!' };
}
// ... (keep the existing assign and unassign actions)

// Action to delete a university and all its course mappings
// ... (keep assign/unassign actions)

// UPDATED version
export async function deleteUniversityAction(universityId: string) {
  if (!universityId) {
    return { error: 'University ID is required.' };
  }

  // 1. Delete all course mappings for this university.
  await supabase
    .from('university_courses')
    .delete()
    .eq('university_id', universityId);

  // 2. Delete the university itself and check the count.
  const { count, error } = await supabase
    .from('universities')
    .delete({ count: 'exact' }) // Add this to check the count
    .eq('id', universityId);

  if (error) {
    console.error('Supabase error deleting university:', error);
    return { error: 'Failed to delete university.' };
  }
  
  // If count is 0, the university ID was invalid.
  if (count === 0) {
      return { error: "Couldn't find the selected university to delete." };
  }

  // 3. Revalidate paths.
  revalidatePath('/'); // <-- ADD THIS LINE
  revalidatePath('/colleges');
  revalidatePath('/courses'); 
  
  return { success: '🗑️ University deleted successfully!' };
}
// ... (keep all other actions)

// NEW action to delete a course
export async function deleteCourseAction(courseId: string) {
    if (!courseId) {
        return { error: 'Course ID is required.' };
    }

    // 1. Delete all university mappings for this course.
    await supabase.from('university_courses').delete().eq('course_id', courseId);

    // 2. Delete the course itself and get the count.
    const { count, error } = await supabase
        .from('courses')
        .delete({ count: 'exact' })
        .eq('id', courseId);

    if (error) {
        console.error('Supabase error deleting course:', error);
        return { error: 'Failed to delete course.' };
    }

    if (count === 0) {
        return { error: "Couldn't find the selected course to delete." };
    }
    
    // 3. Revalidate relevant paths.
    revalidatePath('/'); // <-- ADD THIS LINE
    revalidatePath('/courses');
    revalidatePath('/colleges'); // Revalidate colleges in case they now offer no courses

    return { success: '🗑️ Course deleted successfully!' };
}
// ... new code for v2 keep all your existing actions

// Action to create a new course stream
export async function createStreamAction(name: string) {
    if (!name) {
        return { error: 'Stream name cannot be empty.' };
    }
    // Check for duplicates (case-insensitive)
    const { data: existing } = await supabase.from('streams').select('id').ilike('name', name).single();
    if (existing) {
        return { error: 'A stream with this name already exists.' };
    }

    const { error } = await supabase.from('streams').insert([{ name }]);
    if (error) {
        console.error('Create stream error:', error);
        return { error: 'Failed to create stream.' };
    }

    revalidatePath('/'); // Revalidate layout to get new header data
    return { success: 'Stream created successfully!' };
}

// Action to delete a course stream
export async function deleteStreamAction(streamId: string) {
    if (!streamId) {
        return { error: 'Stream ID is required.' };
    }
    // The database schema will handle setting stream_id to NULL on associated courses
    const { error } = await supabase.from('streams').delete().eq('id', streamId);
    if (error) {
        console.error('Delete stream error:', error);
        return { error: 'Failed to delete stream.' };
    }

    revalidatePath('/'); // Revalidate layout to get new header data
    return { success: 'Stream deleted successfully.' };
}

// Action to create a new course with stream and duration
export async function createCourseAction(formData: { 
    name: string; 
    description: string; 
    duration: string; 
    stream_id: string;
    syllabus: string; // Will be a JSON string
    jobs_info: string; // Will be a JSON string
}) {
    const { name, description, duration, stream_id, syllabus, jobs_info } = formData;

    if (!name || !stream_id) {
        return { error: 'Course Name and Stream are required fields.' };
    }

    // Safely parse the JSON strings
    let syllabusJson, jobsJson;
    try {
        syllabusJson = syllabus ? JSON.parse(syllabus) : null;
        jobsJson = jobs_info ? JSON.parse(jobs_info) : null;
    } catch (e) {
        return { error: 'Invalid JSON format for Syllabus or Jobs Info.' };
    }

    const { error } = await supabase.from('courses').insert([{ 
        name, 
        description, 
        duration, 
        stream_id,
        syllabus: syllabusJson,
        jobs_info: jobsJson
    }]);

    if (error) {
        console.error('Create course error:', error);
        return { error: 'Failed to create course.' };
    }
    
    revalidatePath('/');
    revalidatePath('/courses');
    return { success: 'Course created successfully!' };
}


// --- NEW ACTION ---
// Action to update an existing course with all fields
export async function updateCourseAction(courseId: string, formData: {
    name: string; 
    description: string; 
    duration: string; 
    stream_id: string;
    syllabus: string;
    jobs_info: string;
}) {
    if (!courseId) return { error: 'Course ID is missing.' };

    const { name, description, duration, stream_id, syllabus, jobs_info } = formData;
    
    let syllabusJson, jobsJson;
    try {
        syllabusJson = syllabus ? JSON.parse(syllabus) : null;
        jobsJson = jobs_info ? JSON.parse(jobs_info) : null;
    } catch (e) {
        return { error: 'Invalid JSON format for Syllabus or Jobs Info.' };
    }
    
    const { error } = await supabase
      .from('courses')
      .update({ 
        name, 
        description, 
        duration, 
        stream_id, 
        syllabus: syllabusJson,
        jobs_info: jobsJson
    })
      .eq('id', courseId);

    if (error) {
        console.error('Update course error:', error);
        return { error: 'Failed to update course.'};
    }

    revalidatePath('/');
    revalidatePath('/courses');
    revalidatePath(`/courses/${courseId}`);
    return { success: 'Course updated successfully!' };
}
// ... (keep all your other existing actions)

// Action to create a new enquiry and revalidate the admin pages
export async function createEnquiryAction(enquiryData: any) {
    const { error } = await supabase.from("enquiries").insert([enquiryData]);

    if (error) {
        console.error("Create enquiry error:", error);
        return { error: "Failed to submit application." };
    }

    // This is the crucial part: tell Next.js to refresh these pages
    revalidatePath('/admin/Students');
    revalidatePath('/admin/Overview'); // Also refresh the dashboard stats

    return { success: true };
}

// NEW action to update a university's details
// in app/admin/actions.ts

export async function updateUniversityAction(universityId: string, formData: any) {
    if (!universityId) {
        return { error: 'University ID is missing.' };
    }

    const { error } = await supabase
        .from('universities')
        .update(formData)
        .eq('id', universityId);

    if (error) {
        console.error('Update university error:', error);
        return { error: 'Failed to update university.' };
    }

    // Revalidate all paths where this university's data could be displayed
    revalidatePath('/');                             // For the mega menu
    revalidatePath('/colleges');                       // For the main listing page
    revalidatePath(`/colleges/${universityId}`);     // --- THIS IS THE FIX --- For the specific details page cache

    return { success: '✅ University updated successfully!' };
}
// in app/admin/actions.ts

// ... (keep all your other existing actions)

// NEW action to update the 'called' status of an enquiry
export async function updateEnquiryCalledStatusAction(enquiryId: string, isCalled: boolean) {
    if (!enquiryId) return { error: "Enquiry ID is missing." };

    const { error } = await supabase
        .from('enquiries')
        .update({ called: isCalled, updated_at: new Date().toISOString() }) // Also update the timestamp
        .eq('id', enquiryId);

    if (error) {
        console.error("Update 'called' status error:", error);
        return { error: "Failed to update status." };
    }

    // Revalidate the pages that display this data
    revalidatePath('/admin/Students');
    revalidatePath('/admin/Overview');

    return { success: "Status updated." };
}

// NEW action to update the 'remark' of an enquiry
export async function updateEnquiryRemarkAction(enquiryId: string, remark: string) {
    if (!enquiryId) return { error: "Enquiry ID is missing." };
    
    const { error } = await supabase
        .from('enquiries')
        .update({ remark: remark, updated_at: new Date().toISOString() }) // Also update the timestamp
        .eq('id', enquiryId);

    if (error) {
        console.error("Update remark error:", error);
        return { error: "Failed to update remark." };
    }

    // Revalidate the pages that display this data
    revalidatePath('/admin/Students');
    revalidatePath('/admin/Overview');
    
    return { success: "Remark saved successfully!" };
}

// in app/admin/actions.ts

// ... (keep all your other existing actions)

// NEW action to update the admin_remark on a user's profile
export async function updateProfileRemarkAction(profileId: string, remark: string) {
    if (!profileId) return { error: "User ID is missing." };
    
    const { error } = await supabase
        .from('user_profiles')
        .update({ admin_remark: remark })
        .eq('id', profileId);

    if (error) {
        console.error("Update profile remark error:", error);
        return { error: "Failed to update remark." };
    }

    // Revalidate the page so the change is reflected
    revalidatePath('/admin/AllStudents');
    
    return { success: "Remark saved successfully!" };
}
// in app/admin/actions.ts

// ... (keep all your other existing actions)

// --- NEWS ACTIONS ---

// Action to create a new news item
export async function createNewsAction(content: string) {
    if (!content) {
        return { error: 'News content cannot be empty.' };
    }
    const { error } = await supabase.from('news').insert([{ content }]);
    if (error) {
        console.error("Create news error:", error);
        return { error: "Failed to add news item." };
    }
    revalidatePath('/admin/ManageNews');
    revalidatePath('/'); // Revalidate homepage to show new news
    return { success: "News item added successfully!" };
}

// Action to update a news item
export async function updateNewsAction(newsId: string, content: string) {
    if (!newsId || !content) {
        return { error: 'News ID and content are required.' };
    }
    const { error } = await supabase.from('news').update({ content }).eq('id', newsId);
    if (error) {
        console.error("Update news error:", error);
        return { error: "Failed to update news item." };
    }
    revalidatePath('/admin/ManageNews');
    revalidatePath('/');
    return { success: "News item updated successfully!" };
}

// Action to delete a news item
export async function deleteNewsAction(newsId: string) {
    if (!newsId) {
        return { error: 'News ID is required.' };
    }
    const { error } = await supabase.from('news').delete().eq('id', newsId);
    if (error) {
        console.error("Delete news error:", error);
        return { error: "Failed to delete news item." };
    }
    revalidatePath('/admin/ManageNews');
    revalidatePath('/');
    return { success: "News item deleted successfully." };
}
// in app/admin/actions.ts

// --- NEWSLETTER ACTION ---

export async function subscribeToNewsletterAction(email: string) {
    if (!email || !email.includes('@')) {
        return { error: 'Please provide a valid email address.' };
    }

    const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);

    if (error) {
        // Handle cases where the email might already exist (unique constraint)
        if (error.code === '23505') { 
            return { error: 'This email is already subscribed!' };
        }
        console.error("Newsletter subscription error:", error);
        return { error: "Failed to subscribe. Please try again." };
    }

    return { success: "Thank you for subscribing!" };
}