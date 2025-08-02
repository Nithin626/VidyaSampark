// src/app/certifications/page.tsx

import { supabase } from "@/utils/supabaseClient";
import { CertificationCourse, CertificationCategory } from "@/types/menu";
import CertificationPageClient from "@/components/certifications/CertificationPageClient";
//src\components\certifications\CertificationPageClient.tsx

export const dynamic = 'force-dynamic';

async function getCertificationPageData() {
    const [
        { data: courses },
        { data: categories }
    ] = await Promise.all([
        supabase.from('certification_courses').select('*').order('name', { ascending: true }),
        supabase.from('certification_categories').select('*').order('name', { ascending: true })
    ]);

    return {
        courses: (courses as CertificationCourse[]) || [],
        categories: (categories as CertificationCategory[]) || [],
    };
}

export default async function CertificationsPage() {
  const { courses, categories } = await getCertificationPageData();

  return (
    <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-32">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Explore Our Certification Courses
                </h1>
                <p className="mt-4 text-xl text-gray-600">
                    Upskill and advance your career with our specialized programs.
                </p>
            </div>
            
            <CertificationPageClient
                allCourses={courses}
                allCategories={categories}
            />
        </div>
    </div>
  );
}