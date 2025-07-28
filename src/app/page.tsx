//src\app\page.tsx

import React from "react";
import Hero from "@/components/Home/Hero";
import Newsletter from "@/components/Home/Newsletter";
import AboutUs from "@/components/Home/AboutUs";
import News from "@/components/Home/News";
import { supabase } from "@/utils/supabaseClient"; // 1. Import supabase

// Define the type for a news item right here for simplicity
interface NewsItem {
  id: string;
  content: string;
  created_at: string;
}

// 2. Fetch news data on the server
async function getNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order('created_at', { ascending: false }); // Newest first

  if (error) {
    console.error("Error fetching news:", error);
    return [];
  }
  return data as NewsItem[];
}

// 3. Convert the component to an async function
export default async function Home() {
  const newsItems = await getNews(); // 4. Call the fetch function

  return (
    <main>
      <Hero />
      <AboutUs />
      {/* 5. Pass the fetched data to the News component */}
      <News newsItems={newsItems} />
      <Newsletter />
    </main>
  );
}
