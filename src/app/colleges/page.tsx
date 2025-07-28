//src\app\colleges\page.tsx
import { supabase } from "@/utils/supabaseClient";
import { University, Stream, Course, UniversityCourse } from "@/types/menu";
import CollegePageClient from "@/components/colleges/CollegePageClient";

// This tells Next.js to always fetch fresh data for this page
export const dynamic = 'force-dynamic';

async function getCollegePageData() {
    const [
        { data: universities },
        { data: streams },
        { data: courses },
        { data: universityCourses }
    ] = await Promise.all([
        supabase.from('universities').select('*'),
        supabase.from('streams').select('*'),
        supabase.from('courses').select('id, stream_id'),
        supabase.from('university_courses').select('university_id, course_id')
    ]);

    return {
        universities: (universities as University[]) || [],
        streams: (streams as Stream[]) || [],
        courses: (courses as Course[]) || [],
        universityCourses: (universityCourses as UniversityCourse[]) || []
    };
}

export default async function CollegesPage() {
  const { universities, streams, courses, universityCourses } = await getCollegePageData();

  return (
    <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-32">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Our Partner Colleges
                </h1>
                <p className="mt-4 text-xl text-gray-600">
                    Explore top institutions to kickstart your career.
                </p>
            </div>
            
            <CollegePageClient
                allUniversities={universities}
                allStreams={streams}
                allCourses={courses}
                allUniversityCourses={universityCourses}
            />
        </div>
    </div>
  );
}