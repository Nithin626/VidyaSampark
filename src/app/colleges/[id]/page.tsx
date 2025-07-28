//src\app\colleges\[id]\page.tsx
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";
export const dynamic = 'force-dynamic';
interface CollegePageProps {
  params: { id?: string };
}

/*export async function generateStaticParams() {
  const { data: colleges } = await supabase.from("universities").select("id");
  return colleges?.map((college) => ({ id: college.id })) || [];
} */

export default async function CollegeDetailPage({ params }: CollegePageProps) {
  const id = params?.id;

  if (!id) return <div>❌ Invalid college ID</div>;

  // Fetch college details
  const { data: college } = await supabase
    .from("universities") 
    .select("*")
    .eq("id", id)
    .single();

  if (!college) {
    return <div className="text-center text-red-600 mt-10">❌ College not found.</div>;
  }

  // Fetch only valid (non-deleted) courses via inner join

interface Course {
  id: string;
  name: string;
  description: string;
}

interface UniversityCourseMapping {
  course: Course;
}

const { data: rawCourses, error } = await supabase
  .from("university_courses")
  .select("course:course_id(id, name, description)")
  .eq("university_id", id);

const courses: Course[] =
  rawCourses
    ?.map((entry) => {
      const course = entry.course;
      // Defensive: handle if it's an array
      if (Array.isArray(course)) return course[0]; // get first
      return course;
    })
    .filter((course): course is Course => !!course) || [];



  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{college.name}</h1>
      <p className="text-gray-600 mb-2">{college.location}</p>
      <p className="mb-2">
        <strong>Avg. Package:</strong> {college.package}
      </p>
      {college.website && (
        <a
          href={college.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline mb-6 block"
        >
          Visit Website
        </a>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-4">Courses Offered</h2>

      {courses.length === 0 ? (
        <p className="text-gray-500">No courses available.</p>
      ) : (
        <ul className="space-y-4">
          {courses.map((course) => (
            <li key={course.id} className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-semibold">{course.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {course.description || "No description available."}
              </p>
              <Link
                href={`/apply?college=${encodeURIComponent(
                  college.name
                )}&course=${encodeURIComponent(course.name)}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                Apply Now
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
