//src\app\courses\page.tsx
import { supabase } from "@/utils/supabaseClient";
import { Course, Stream } from "@/types/menu";
import CoursePageClient from "@/components/courses/CoursePageClient";

// This tells Next.js to always fetch fresh data for this page
export const dynamic = 'force-dynamic';

async function getCoursePageData() {
    const [
        { data: courses },
        { data: streams }
    ] = await Promise.all([
        supabase.from('courses').select('*').order('name', { ascending: true }),
        supabase.from('streams').select('*').order('name', { ascending: true })    ]);

    return {
        courses: (courses as Course[]) || [],
        streams: (streams as Stream[]) || [],
    };
}

export default async function CoursesPage() {
  const { courses, streams } = await getCoursePageData();

  return (
    <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-32">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Explore Our Courses
                </h1>
                <p className="mt-4 text-xl text-gray-600">
                    Find the perfect program to shape your future.
                </p>
            </div>
            
            <CoursePageClient
                allCourses={courses}
                allStreams={streams}
            />
        </div>
    </div>
  );
}