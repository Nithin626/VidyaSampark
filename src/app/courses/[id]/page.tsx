// src/app/courses/[id]/page.tsx

import { supabase } from "@/utils/supabaseClient";
import { Course, University } from "@/types/menu";
import CourseTabs from "@/components/courses/details/CourseTabs";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";

// This tells Next.js to always fetch fresh data for this page
export const dynamic = 'force-dynamic';

interface CourseDetailPageProps {
  params: { id: string };
}

// Fetches the details for a single course
async function getCourseDetails(id: string): Promise<Course | null> {
    const { data, error } = await supabase
        .from("courses")
        .select(`
            id,
            name,
            stream_id,
            description,
            duration,
            syllabus,
            jobs_info
        `)
        .eq("id", id)
        .single();
    
    if (error) {
        console.error("Error fetching course details:", error);
        return null;
    }
    return data as Course;
}

// Fetches all universities that offer a specific course
async function getCollegesForCourse(courseId: string): Promise<University[]> {
    const { data, error } = await supabase
        .from("university_courses")
        .select(`
            universities (
                id,
                name,
                location,
                image_url,
                package,
                accreditation,
                description,
                about,
                website
            )
        `)
        .eq("course_id", courseId);

    if (error) {
        console.error("Error fetching colleges for course:", error);
        return [];
    }
    
    // The result is nested, so we need to map over it to get the university objects
    // The 'as unknown' is a safe way to tell TypeScript we know the shape is correct
    const colleges = data.map(item => item.universities).filter(Boolean) as unknown as University[];
    return colleges;
}


export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = params;

  // Fetch data in parallel for better performance
  const [course, colleges] = await Promise.all([
      getCourseDetails(id),
      getCollegesForCourse(id)
  ]);
 

  if (!course) {
    return (    
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">❌ Course Not Found</h1>
        <p className="text-gray-600 mt-2">The course you are looking for does not exist or may have been removed.</p>
        <Link href="/courses" className="inline-block mt-6 bg-primary text-white px-6 py-2 rounded-lg">
            Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
        {/* Course Header Section */}
        <div className="bg-gray-800 text-white pt-32 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl font-extrabold">{course.name}</h1>
                {course.duration && (
                    <div className="flex items-center text-lg text-gray-300 mt-4">
                        <Icon icon="tabler:calendar-event" className="mr-2" />
                        <span>Duration: {course.duration}</span>
                    </div>
                )}
            </div>
        </div>
        
        {/* Main Content with Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <CourseTabs course={course} colleges={colleges} />
        </div>
    </div>
  );
}
