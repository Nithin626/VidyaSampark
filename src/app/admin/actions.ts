// src\app\admin\actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/utils/supabaseAdmin'; // Use the admin client for all RLS-protected operations

// --- AUTH ACTIONS (No changes needed here) ---
export async function loginAction(formData: FormData) {
  // ... (this action uses createServerActionClient, which is correct)
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createServerActionClient({ cookies });

  if (!email || !password) {
    return redirect('/admin/login?message=Email and password are required.');
  }

  const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError || !user) {
    return redirect('/admin/login?message=Could not authenticate user. Please check your credentials.');
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || profile?.role !== 'admin') {
    await supabase.auth.signOut();
    return redirect('/admin/login?message=Access Denied: You are not an administrator.');
  }
  
  redirect('/admin');
}

export async function signOutAction() {
    const supabase = createServerActionClient({ cookies });
    await supabase.auth.signOut();
    redirect('/admin/login');
}

// --- UNIVERSITY ACTIONS ---
export async function createUniversityAction(universityData: any) {
    const { error } = await supabaseAdmin.from('universities').insert([universityData]);
    if (error) {
        console.error("Create university error:", error);
        return { error: `Failed to create university: ${error.message}` };
    }
    revalidatePath('/');
    revalidatePath('/colleges');
    revalidatePath('/admin/NewUniversity');
    return { success: "✅ University created successfully!" };
}

export async function updateUniversityAction(universityId: string, formData: any) {
    if (!universityId) return { error: 'University ID is missing.' };
    const { error } = await supabaseAdmin.from('universities').update(formData).eq('id', universityId);
    if (error) {
        console.error('Update university error:', error);
        return { error: 'Failed to update university.' };
    }
    revalidatePath('/');
    revalidatePath('/colleges');
    revalidatePath(`/colleges/${universityId}`);
    revalidatePath('/admin/NewUniversity');
    return { success: '✅ University updated successfully!' };
}

export async function deleteUniversityAction(universityId: string) {
    if (!universityId) return { error: 'University ID is required.' };
    await supabaseAdmin.from('university_courses').delete().eq('university_id', universityId);
    const { count, error } = await supabaseAdmin.from('universities').delete({ count: 'exact' }).eq('id', universityId);
    if (error) {
        console.error('Supabase error deleting university:', error);
        return { error: 'Failed to delete university.' };
    }
    if (count === 0) return { error: "Couldn't find the selected university to delete." };
    revalidatePath('/');
    revalidatePath('/colleges');
    revalidatePath('/admin/NewUniversity');
    return { success: '🗑️ University deleted successfully!' };
}


// --- COURSE, STREAM, and ASSIGNMENT ACTIONS ---
export async function createCourseAction(formData: { name: string; description: string; duration: string; stream_id: string; syllabus: string; jobs_info: string; }) {
    const { name, description, duration, stream_id, syllabus, jobs_info } = formData;
    if (!name || !stream_id) return { error: 'Course Name and Stream are required fields.' };
    let syllabusJson, jobsJson;
    try {
        syllabusJson = syllabus ? JSON.parse(syllabus) : null;
        jobsJson = jobs_info ? JSON.parse(jobs_info) : null;
    } catch (e) {
        return { error: 'Invalid JSON format for Syllabus or Jobs Info.' };
    }
    const { error } = await supabaseAdmin.from('courses').insert([{ name, description, duration, stream_id, syllabus: syllabusJson, jobs_info: jobsJson }]);
    if (error) {
        console.error('Create course error:', error);
        return { error: 'Failed to create course.' };
    }
    revalidatePath('/');
    revalidatePath('/courses');
    revalidatePath('/admin/NewCourse');
    return { success: 'Course created successfully!' };
}

export async function updateCourseAction(courseId: string, formData: { name: string; description: string; duration: string; stream_id: string; syllabus: string; jobs_info: string; }) {
    if (!courseId) return { error: 'Course ID is missing.' };
    const { name, description, duration, stream_id, syllabus, jobs_info } = formData;
    let syllabusJson, jobsJson;
    try {
        syllabusJson = syllabus ? JSON.parse(syllabus) : null;
        jobsJson = jobs_info ? JSON.parse(jobs_info) : null;
    } catch (e) {
        return { error: 'Invalid JSON format for Syllabus or Jobs Info.' };
    }
    const { error } = await supabaseAdmin.from('courses').update({ name, description, duration, stream_id, syllabus: syllabusJson, jobs_info: jobsJson }).eq('id', courseId);
    if (error) {
        console.error('Update course error:', error);
        return { error: 'Failed to update course.'};
    }
    revalidatePath('/');
    revalidatePath('/courses');
    revalidatePath(`/courses/${courseId}`);
    revalidatePath('/admin/NewCourse');
    return { success: 'Course updated successfully!' };
}

export async function deleteCourseAction(courseId: string) {
    if (!courseId) return { error: 'Course ID is required.' };
    await supabaseAdmin.from('university_courses').delete().eq('course_id', courseId);
    const { count, error } = await supabaseAdmin.from('courses').delete({ count: 'exact' }).eq('id', courseId);
    if (error) {
        console.error('Supabase error deleting course:', error);
        return { error: 'Failed to delete course.' };
    }
    if (count === 0) return { error: "Couldn't find the selected course to delete." };
    revalidatePath('/');
    revalidatePath('/courses');
    revalidatePath('/colleges');
    revalidatePath('/admin/NewCourse');
    return { success: '🗑️ Course deleted successfully!' };
}

export async function createStreamAction(name: string) {
    if (!name) return { error: 'Stream name cannot be empty.' };
    const { data: existing } = await supabaseAdmin.from('streams').select('id').ilike('name', name).single();
    if (existing) return { error: 'A stream with this name already exists.' };
    const { error } = await supabaseAdmin.from('streams').insert([{ name }]);
    if (error) {
        console.error('Create stream error:', error);
        return { error: 'Failed to create stream.' };
    }
    revalidatePath('/');
    revalidatePath('/admin/NewCourse');
    return { success: 'Stream created successfully!' };
}

export async function deleteStreamAction(streamId: string) {
    if (!streamId) return { error: 'Stream ID is required.' };
    const { error } = await supabaseAdmin.from('streams').delete().eq('id', streamId);
    if (error) {
        console.error('Delete stream error:', error);
        return { error: 'Failed to delete stream.' };
    }
    revalidatePath('/');
    revalidatePath('/admin/NewCourse');
    return { success: 'Stream deleted successfully.' };
}

export async function assignCourseAction(courseId: string, universityIds: string[]) {
    if (!courseId || universityIds.length === 0) return { error: 'Course ID and University IDs are required.' };
    const { data: existingMappings, error: fetchError } = await supabaseAdmin.from('university_courses').select('university_id').eq('course_id', courseId).in('university_id', universityIds);
    if (fetchError) {
        console.error('Supabase fetch error:', fetchError);
        return { error: 'Could not verify existing assignments.' };
    }
    const existingUniIds = new Set(existingMappings.map(m => m.university_id));
    const newMappings = universityIds.filter(uniId => !existingUniIds.has(uniId)).map(uniId => ({ course_id: courseId, university_id: uniId, }));
    if (newMappings.length === 0) return { error: 'The selected course is already assigned to ALL selected universities.' };
    const { error: insertError } = await supabaseAdmin.from('university_courses').insert(newMappings);
    if (insertError) {
        console.error('Supabase insert error:', insertError);
        return { error: 'Failed to assign course.' };
    }
    revalidatePath('/');
    revalidatePath('/courses');
    revalidatePath(`/courses/${courseId}`);
    newMappings.forEach((mapping) => { revalidatePath(`/colleges/${mapping.university_id}`); });
    revalidatePath('/colleges');
    revalidatePath('/admin/NewCourse');
    return { success: '✅ Course assigned successfully!' };
}

export async function unassignCourseAction(courseId: string, universityId: string) {
    if (!courseId || !universityId) return { error: 'Course ID and University ID are required.' };
    const { count, error } = await supabaseAdmin.from('university_courses').delete({ count: 'exact' }).eq('course_id', courseId).eq('university_id', universityId);
    if (error) {
        console.error('Supabase error un-assigning course:', error);
        return { error: 'Failed to un-assign course.' };
    }
    if (count === 0) return { error: 'This course was not assigned to the selected university.' };
    revalidatePath('/');
    revalidatePath('/courses');
    revalidatePath(`/courses/${courseId}`);
    revalidatePath(`/colleges/${universityId}`);
    revalidatePath('/colleges');
    revalidatePath('/admin/NewCourse');
    return { success: '✅ Course un-assigned successfully!' };
}

export async function addSimpleCourseWithUniversitiesAction( courseName: string, description: string, universityIds: string[] ) {
    const { data: courseData, error: courseError } = await supabaseAdmin.from('courses').insert([{ name: courseName, description }]).select().single();
    if (courseError || !courseData) return { error: "Failed to add course" };
    if (universityIds.length > 0) {
        const links = universityIds.map((uniId) => ({ university_id: uniId, course_id: courseData.id, }));
        const { error: linkError } = await supabaseAdmin.from('university_courses').insert(links);
        if (linkError) return { error: "Course added but college mapping failed" };
    }
    revalidatePath('/admin/NewCourse');
    revalidatePath('/admin/AddCourse');
    return { success: "✅ Course & college mapping added!" };
}


// --- ENQUIRY AND PROFILE ACTIONS ---
export async function createEnquiryAction(enquiryData: any) {
    const { error } = await supabaseAdmin.from("enquiries").insert([enquiryData]);
    if (error) {
        console.error("Create enquiry error:", error);
        return { error: "Failed to submit application." };
    }
    revalidatePath('/admin/Students');
    revalidatePath('/admin/Overview');
    return { success: true };
}

export async function updateEnquiryCalledStatusAction(enquiryId: string, isCalled: boolean) {
    if (!enquiryId) return { error: "Enquiry ID is missing." };
    const { error } = await supabaseAdmin.from('enquiries').update({ called: isCalled, updated_at: new Date().toISOString() }).eq('id', enquiryId);
    if (error) {
        console.error("Update 'called' status error:", error);
        return { error: "Failed to update status." };
    }
    revalidatePath('/admin/Students');
    revalidatePath('/admin/Overview');
    return { success: "Status updated." };
}

export async function updateEnquiryRemarkAction(enquiryId: string, remark: string) {
    if (!enquiryId) return { error: "Enquiry ID is missing." };
    const { error } = await supabaseAdmin.from('enquiries').update({ remark: remark, updated_at: new Date().toISOString() }).eq('id', enquiryId);
    if (error) {
        console.error("Update remark error:", error);
        return { error: "Failed to update remark." };
    }
    revalidatePath('/admin/Students');
    revalidatePath('/admin/Overview');
    return { success: "Remark saved successfully!" };
}

export async function updateProfileRemarkAction(profileId: string, remark: string) {
    if (!profileId) return { error: "User ID is missing." };
    const { error } = await supabaseAdmin.from('user_profiles').update({ admin_remark: remark }).eq('id', profileId);
    if (error) {
        console.error("Update profile remark error:", error);
        return { error: "Failed to update remark." };
    }
    revalidatePath('/admin/AllStudents');
    return { success: "Remark saved successfully!" };
}


// --- NEWS ACTIONS ---
export async function createNewsAction(content: string) {
    if (!content) return { error: 'News content cannot be empty.' };
    const { error } = await supabaseAdmin.from('news').insert([{ content }]);
    if (error) {
        console.error("Create news error:", error);
        return { error: "Failed to add news item." };
    }
    revalidatePath('/admin/ManageNews');
    revalidatePath('/');
    return { success: "News item added successfully!" };
}

export async function updateNewsAction(newsId: string, content: string) {
    if (!newsId || !content) return { error: 'News ID and content are required.' };
    const { error } = await supabaseAdmin.from('news').update({ content }).eq('id', newsId);
    if (error) {
        console.error("Update news error:", error);
        return { error: "Failed to update news item." };
    }
    revalidatePath('/admin/ManageNews');
    revalidatePath('/');
    return { success: "News item updated successfully!" };
}

export async function deleteNewsAction(newsId: string) {
    if (!newsId) return { error: 'News ID is required.' };
    const { error } = await supabaseAdmin.from('news').delete().eq('id', newsId);
    if (error) {
        console.error("Delete news error:", error);
        return { error: "Failed to delete news item." };
    }
    revalidatePath('/admin/ManageNews');
    revalidatePath('/');
    return { success: "News item deleted successfully." };
}


// --- NEWSLETTER ACTION ---
export async function subscribeToNewsletterAction(email: string) {
    if (!email || !email.includes('@')) return { error: 'Please provide a valid email address.' };
    const { error } = await supabaseAdmin.from('newsletter_subscriptions').insert([{ email }]);
    if (error) {
        if (error.code === '23505') return { error: 'This email is already subscribed!' };
        console.error("Newsletter subscription error:", error);
        return { error: "Failed to subscribe. Please try again." };
    }
    return { success: "Thank you for subscribing!" };
}


export async function createCertificationCategoryAction(name: string) {
  if (!name) return { error: 'Category name cannot be empty.' };

  const { data: existing } = await supabaseAdmin.from('certification_categories').select('id').ilike('name', name).single();
  if (existing) return { error: 'A category with this name already exists.' };

  const { error } = await supabaseAdmin.from('certification_categories').insert([{ name }]);
  if (error) {
    console.error('Create certification category error:', error);
    return { error: 'Failed to create category.' };
  }
  revalidatePath('/admin/ManageCertifications');
  return { success: '✅ Category created successfully!' };
}

export async function deleteCertificationCategoryAction(categoryId: string) {
  if (!categoryId) return { error: 'Category ID is required.' };
  
  // Note: RLS and the 'ON DELETE SET NULL' constraint on certification_courses will handle associations.
  const { error } = await supabaseAdmin.from('certification_categories').delete().eq('id', categoryId);
  if (error) {
    console.error('Delete certification category error:', error);
    return { error: 'Failed to delete category.' };
  }
  revalidatePath('/admin/ManageCertifications');
  return { success: '🗑️ Category deleted successfully.' };
}

export async function createCertificationCourseAction(formData: { name: string; overview: string; duration: string; category_id: string; }) {
  const { name, category_id } = formData;
  if (!name || !category_id) return { error: 'Course Name and Category are required fields.' };

  const { error } = await supabaseAdmin.from('certification_courses').insert([formData]);
  if (error) {
    console.error('Create certification course error:', error);
    return { error: 'Failed to create certification course.' };
  }
  revalidatePath('/admin/ManageCertifications');
  revalidatePath('/certifications');
  return { success: '✅ Certification course created successfully!' };
}

export async function updateCertificationCourseAction(courseId: string, formData: { name: string; overview: string; duration: string; category_id: string; }) {
  if (!courseId) return { error: 'Course ID is missing.' };

  const { error } = await supabaseAdmin.from('certification_courses').update(formData).eq('id', courseId);
  if (error) {
    console.error('Update certification course error:', error);
    return { error: 'Failed to update certification course.'};
  }
  revalidatePath('/admin/ManageCertifications');
  revalidatePath('/certifications');
  revalidatePath(`/certifications/${courseId}`);
  return { success: '✅ Certification course updated successfully!' };
}

export async function deleteCertificationCourseAction(courseId: string) {
  if (!courseId) return { error: 'Course ID is required.' };
  
  const { count, error } = await supabaseAdmin.from('certification_courses').delete({ count: 'exact' }).eq('id', courseId);
  if (error) {
    console.error('Supabase error deleting certification course:', error);
    return { error: 'Failed to delete certification course.' };
  }
  if (count === 0) return { error: "Couldn't find the selected course to delete." };

  revalidatePath('/admin/ManageCertifications');
  revalidatePath('/certifications');
  return { success: '🗑️ Certification course deleted successfully!' };
}
// src/app/admin/actions.ts

// ... (keep all your existing actions, including the certification management ones)

// --- CERTIFICATION ENQUIRY ACTIONS ---

export async function updateCertEnquiryCalledStatusAction(enquiryId: string, isCalled: boolean) {
  if (!enquiryId) return { error: "Enquiry ID is missing." };
  
  const { error } = await supabaseAdmin
    .from('enquiries')
    .update({ called: isCalled, updated_at: new Date().toISOString() })
    .eq('id', enquiryId);

  if (error) {
    console.error("Update 'called' status error for cert enquiry:", error);
    return { error: "Failed to update status." };
  }
  revalidatePath('/admin/CertificationStudents'); // Revalidate the correct page
  return { success: "Status updated." };
}

export async function updateCertEnquiryRemarkAction(enquiryId: string, remark: string) {
  if (!enquiryId) return { error: "Enquiry ID is missing." };

  const { error } = await supabaseAdmin
    .from('enquiries')
    .update({ remark: remark, updated_at: new Date().toISOString() })
    .eq('id', enquiryId);

  if (error) {
    console.error("Update remark error for cert enquiry:", error);
    return { error: "Failed to update remark." };
  }
  revalidatePath('/admin/CertificationStudents'); // Revalidate the correct page
  return { success: "Remark saved successfully!" };
}