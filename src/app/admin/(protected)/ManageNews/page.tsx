//src\app\admin\(protected)\ManageNews\page.tsx
import NewsManager from "./NewsManager";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

// Define the type here so it can be used by the client component
export interface NewsItem {
  id: string;
  content: string;
  created_at: string;
}

// This tells Next.js to always fetch fresh data when this page is loaded
export const dynamic = "force-dynamic";

async function getNews(): Promise<NewsItem[]> {
  const { data, error } = await supabaseAdmin
    .from("news")
    .select("*")
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching news:", error.message);
    return [];
  }
  return data;
}

export default async function ManageNewsPage() {
  // Fetch initial data on the server
  const initialNews = await getNews();

  return (
    <div className="p-4">
      {/* Pass the initial data down as a prop */}
      <NewsManager initialNews={initialNews} />
    </div>
  );
}