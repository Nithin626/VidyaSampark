// src/app/certifications/[id]/page.tsx

import { supabase } from "@/utils/supabaseClient";
import { CertificationCourse } from "@/types/menu";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";

export const dynamic = 'force-dynamic';

interface CertDetailPageProps {
  params: { id: string };
}

// Fetches the details for a single certification course
async function getCertificationDetails(id: string): Promise<CertificationCourse | null> {
    const { data, error } = await supabase
        .from("certification_courses")
        .select(`
            id,
            name,
            overview,
            duration
        `)
        .eq("id", id)
        .single();
    
    if (error) {
        console.error("Error fetching certification details:", error);
        return null;
    }
    return data as CertificationCourse;
}

export default async function CertificationDetailPage({ params }: CertDetailPageProps) {
  const { id } = params;
  const course = await getCertificationDetails(id);

  if (!course) {
    return (     
      <div className="text-center py-40">
        <h1 className="text-2xl font-bold">❌ Course Not Found</h1>
        <p className="text-gray-600 mt-2">The certification you are looking for does not exist or may have been removed.</p>
        <Link href="/certifications" className="inline-block mt-6 bg-primary text-white px-6 py-2 rounded-lg">
            Back to All Certifications
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
        {/* Course Header Section */}
        <div className="bg-gray-800 text-white pt-32 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl lg:text-5xl font-extrabold">{course.name}</h1>
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {course.duration && (
                        <div className="flex items-center text-lg text-gray-300">
                            <Icon icon="tabler:calendar-event" className="mr-2 h-6 w-6" />
                            <span>Duration: {course.duration}</span>
                        </div>
                    )}
                    {/* The "Apply Now" button links to the apply page with the course ID in the URL */}
                    <Link 
                        href={`/apply?certification_id=${course.id}`}
                        className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg text-center transition-colors duration-300"
                    >
                        Apply Now
                    </Link>
                </div>
            </div>
        </div>
        
        {/* Main Content with Overview */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Course Overview</h3>
<div className="prose max-w-none text-gray-700 leading-relaxed text-justify whitespace-pre-wrap">
                <p>
                    {course.overview || "A detailed overview for this course will be available soon."}
                </p>
            </div>
        </div>
    </div>
  );
}