//src\app\admin\(protected)\Students\page.tsx
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import EnquiryList, { Enquiry } from "./EnquiryList";

// This tells Next.js to always fetch fresh data for this page
export const dynamic = "force-dynamic";

// Define simpler types for our raw data fetches (no change here)
interface RawEnquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  current_class?: string;
  called?: boolean;
  remark?: string;
  course_id: string | null;
  college_id: string | null;
}
interface SimpleCourse { id: string; name: string; }
interface SimpleUniversity { id: string; name: string; }


async function getEnquiries(): Promise<Enquiry[]> {
  // 1. Fetch all the raw data in parallel USING THE ADMIN CLIENT
  const [enquiriesRes, coursesRes, universitiesRes] = await Promise.all([
    supabaseAdmin.from("enquiries").select("*"),       // <--- Use supabaseAdmin
    supabaseAdmin.from("courses").select("id, name"),    // <--- Use supabaseAdmin
    supabaseAdmin.from("universities").select("id, name") // <--- Use supabaseAdmin
  ]);

  // The rest of the function remains the same...
  if (enquiriesRes.error || coursesRes.error || universitiesRes.error) {
    console.error("Error fetching data:", {
      enquiriesError: enquiriesRes.error,
      coursesError: coursesRes.error,
      universitiesError: universitiesRes.error,
    });
    return [];
  }

  const rawEnquiries: RawEnquiry[] = enquiriesRes.data || [];
  const courses: SimpleCourse[] = coursesRes.data || [];
  const universities: SimpleUniversity[] = universitiesRes.data || [];

  const courseMap = new Map(courses.map(c => [c.id, c.name]));
  const universityMap = new Map(universities.map(u => [u.id, u.name]));

  const joinedEnquiries: Enquiry[] = rawEnquiries.map(enquiry => {
    return {
      ...enquiry,
      courses: enquiry.course_id ? { name: courseMap.get(enquiry.course_id) || "Unknown Course" } : null,
      universities: enquiry.college_id ? { name: universityMap.get(enquiry.college_id) || "Unknown College" } : null,
    };
  });

  return joinedEnquiries;
}

export default async function StudentsPage() {
  const enquiries = await getEnquiries();

  return (
    <div className="p-4">
      <EnquiryList enquiries={enquiries} />
    </div>
  );
}