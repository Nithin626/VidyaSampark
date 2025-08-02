//src\app\layout.tsx
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import ScrollToTop from "@/components/ScrollToTop";
import ClientLayoutWrapper from "@/components/Layout/ClientLayoutWrapper";
import { supabase } from "@/utils/supabaseClient";
import { MegaMenuData } from "@/types/menu";
import { UIProvider } from '@/context/UIContext'; // Import the provider

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// The function to fetch all data needed for the mega menus
// in src/app/layout.tsx

async function getMegaMenuData(): Promise<MegaMenuData> {
  const [
    { data: streams, error: streamsError },
    { data: courses, error: coursesError },
    { data: universities, error: universitiesError },
    { data: universityCourses, error: ucError },
    // --- ADD THESE TWO FETCHES ---
    { data: certificationCategories, error: certCategoriesError },
    { data: certificationCourses, error: certCoursesError }
  ] = await Promise.all([
    supabase.from("streams").select("id, name").order('name', { ascending: true }),
    supabase.from("courses").select("id, name, stream_id").order('name', { ascending: true }),
    supabase.from("universities").select("id, name").order('name', { ascending: true }),
    supabase.from("university_courses").select("university_id, course_id"), // No name column to sort by
    supabase.from("certification_categories").select("id, name").order('name', { ascending: true }),
    supabase.from("certification_courses").select("id, name, category_id").order('name', { ascending: true })
  ]);

  if (streamsError || coursesError || universitiesError || ucError || certCategoriesError || certCoursesError) {
    console.error("Failed to fetch mega menu data:", { streamsError, coursesError, universitiesError, ucError, certCategoriesError, certCoursesError });
    // Return a default empty state for all fields
    return { 
      streams: [], 
      courses: [], 
      universities: [], 
      universityCourses: [],
      certificationCategories: [],
      certificationCourses: []
    };
  }

  return {
    streams: streams || [],
    courses: courses || [],
    universities: universities || [],
    universityCourses: universityCourses || [],
    // --- ADD THE NEW DATA TO THE RETURN OBJECT ---
    certificationCategories: certificationCategories || [],
    certificationCourses: certificationCourses || []
  };
}
export default async function RootLayout({ children }: { children: React.ReactNode; }) {
  const menuData = await getMegaMenuData();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <Toaster position="top-center" reverseOrder={false} />
        <ThemeProvider attribute="class" enableSystem defaultTheme="light">
          {/* Add the UIProvider here */}
          <UIProvider>
            <ClientLayoutWrapper menuData={menuData}>
              {children}
            </ClientLayoutWrapper>
          </UIProvider>
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}