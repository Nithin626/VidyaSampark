"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { MegaMenuData } from "@/types/menu"; // Import the type

// Define the props for this component
interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  menuData: MegaMenuData; // Add menuData here
}

export default function ClientLayoutWrapper({ children, menuData }: ClientLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {/* Pass the menuData prop down to the Header */}
      {!isAdmin && <Header menuData={menuData} />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}