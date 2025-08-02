// src/app/admin/(protected)/CertificationStudents/page.tsx
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import CertificationEnquiryList, { CertificationEnquiry } from "./CertificationEnquiryList";

export const dynamic = "force-dynamic";

// Define raw types for data fetching
interface RawEnquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  current_class?: string;
  called?: boolean;
  remark?: string;
  certification_course_id: string | null; // The key field for this page
}
interface SimpleCertCourse { id: string; name: string; }

async function getCertificationEnquiries(): Promise<CertificationEnquiry[]> {
  // 1. Fetch all the raw data in parallel
  const [enquiriesRes, certCoursesRes] = await Promise.all([
    // IMPORTANT: Filter enquiries to only get those with a certification course ID
    supabaseAdmin.from("enquiries").select("*").not('certification_course_id', 'is', null),
    supabaseAdmin.from("certification_courses").select("id, name"),
  ]);

  if (enquiriesRes.error || certCoursesRes.error) {
    console.error("Error fetching certification data:", {
      enquiriesError: enquiriesRes.error,
      certCoursesError: certCoursesRes.error,
    });
    return [];
  }

  const rawEnquiries: RawEnquiry[] = enquiriesRes.data || [];
  const certCourses: SimpleCertCourse[] = certCoursesRes.data || [];

  // Create a map for quick lookups of certification course names
  const certCourseMap = new Map(certCourses.map(c => [c.id, c.name]));

  // 2. "Join" the data in code
  const joinedEnquiries: CertificationEnquiry[] = rawEnquiries.map(enquiry => {
    // We can be sure certification_course_id exists due to our filter
    const courseName = certCourseMap.get(enquiry.certification_course_id!) || "Unknown Course";
    
    return {
      ...enquiry,
      // Map the raw data to the expected prop structure for the client component
      certification_courses: { name: courseName },
    };
  });

  return joinedEnquiries;
}

export default async function CertificationStudentsPage() {
  const enquiries = await getCertificationEnquiries();

  return (
    <div className="p-4">
      <CertificationEnquiryList enquiries={enquiries} />
    </div>
  );
}