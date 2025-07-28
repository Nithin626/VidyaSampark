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
    { data: universityCourses, error: ucError }
  ] = await Promise.all([
    supabase.from("streams").select("id, name"),
    supabase.from("courses").select("id, name, stream_id"), // This fetch is correct for the menu
    supabase.from("universities").select("id, name"),     // This fetch is correct for the menu
    supabase.from("university_courses").select("university_id, course_id")
  ]);

  if (streamsError || coursesError || universitiesError || ucError) {
    console.error("Failed to fetch mega menu data:", { streamsError, coursesError, universitiesError, ucError });
    return { streams: [], courses: [], universities: [], universityCourses: [] };
  }

  return {
    streams: streams || [],
    courses: courses || [],
    universities: universities || [],
    universityCourses: universityCourses || []
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