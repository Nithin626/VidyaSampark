//src\app\admin\(protected)\AllStudents\page.tsx
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import AllStudentsList, { UserProfile } from "./AllStudentsList";

// This tells Next.js to always fetch fresh data for this page
export const dynamic = "force-dynamic";

async function getUserProfiles(): Promise<UserProfile[]> {
  // Use the admin client and add a filter to exclude admins
  const { data, error } = await supabaseAdmin
    .from("user_profiles")
    .select("*")
    .neq('role', 'admin'); // <-- This line excludes admins

  if (error) {
    console.error("Error fetching user profiles:", error.message);
    return [];
  }

  return data as UserProfile[];
}

export default async function AllStudentsPage() {
  const profiles = await getUserProfiles();

  return (
    <div className="p-4">
      <AllStudentsList profiles={profiles} />
    </div>
  );
}