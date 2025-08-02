//src\app\page.tsx

import React from "react";
import Hero from "@/components/Home/Hero";
import Newsletter from "@/components/Home/Newsletter";
import AboutUs from "@/components/Home/AboutUs";
import News from "@/components/Home/News";
import LogoCarousel from "@/components/Home/LogoCarousel"; // 1. Import the new component
import { supabase } from "@/utils/supabaseClient";

// Define types for the data we're fetching
interface NewsItem {
  id: string;
  content: string;
  created_at: string;
}
interface UniversityLogo {
  id: string;
  name: string;
  logo_url: string | null;
}

// 2. Create functions to fetch all necessary data
async function getNews() {
  const { data } = await supabase
    .from("news")
    .select("*")
    .order('created_at', { ascending: false });
  return (data as NewsItem[]) || [];
}

async function getUniversityLogos() {
  const { data } = await supabase
    .from("universities")
    .select("id, name, logo_url")
    .not('logo_url', 'is', null); // Only fetch universities that have a logo
  return (data as UniversityLogo[]) || [];
}

export default async function Home() {
  // 3. Fetch all data in parallel
  const [newsItems, universityLogos] = await Promise.all([
    getNews(),
    getUniversityLogos()
  ]);

  return (
    <main>
      <Hero />

      <LogoCarousel logos={universityLogos} />
      <AboutUs />
      <News newsItems={newsItems} />
      <Newsletter />
    </main>
  );
}