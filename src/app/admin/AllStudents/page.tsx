import { supabase } from "@/utils/supabaseClient";
import AllStudentsList, { UserProfile } from "./AllStudentsList";

// This tells Next.js to always fetch fresh data for this page
export const dynamic = "force-dynamic";

async function getUserProfiles(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*");

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