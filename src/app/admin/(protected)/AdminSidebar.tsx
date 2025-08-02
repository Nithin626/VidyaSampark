//src\app\admin\(protected)\AdminSidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Users, University, LogOut, UserCheck, Newspaper, BookOpen, Award, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "../actions"; // Corrected path

const adminNav = [
  {name: "Overview", href: "/admin/Overview", icon: Home },
  { name: "Student Enquiries", href: "/admin/Students", icon: UserCheck },
  { name: "All Students", href: "/admin/AllStudents", icon: Users },
  { name: "New University", href: "/admin/NewUniversity", icon: University },
  { name: "New Course", href: "/admin/NewCourse", icon: BookOpen },
  { name: "Manage Certifications", href: "/admin/ManageCertifications", icon: Award }, // New
  { name: "Certification Students", href: "/admin/CertificationStudents", icon: UserPlus }, // New
  { name: "Manage News", href: "/admin/ManageNews", icon: Newspaper },

];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOutAction();
  };

  return (
    <aside className="w-64 bg-gray-100 border-r p-4 flex flex-col">
      <div className="text-2xl font-bold mb-6">Admin Panel</div>
      <nav className="flex flex-col gap-2">
        {adminNav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200",
              pathname.toLowerCase() === item.href.toLowerCase() && "bg-gray-300 font-semibold"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-2 text-red-500 px-3 py-2 hover:bg-red-100 rounded w-full"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </aside>
  );
}