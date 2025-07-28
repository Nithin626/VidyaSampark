// app/admin/layout.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
// 1. Import the Newspaper icon
import { Home, Users, University, LogOut, UserCheck, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

// 2. Add the "Manage News" entry to the array
const adminNav = [
  {name: "Overview", href: "/admin/Overview", icon: Home },
  { name: "Student Enquiries", href: "/admin/Students", icon: UserCheck },
  { name: "All Students", href: "/admin/AllStudents", icon: Users },
  { name: "New University", href: "/admin/NewUniversity", icon: University },
  { name: "New Course", href: "/admin/NewCourse", icon: BookOpen },
  { name: "Manage News", href: "/admin/ManageNews", icon: Newspaper }, // <-- New Item
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen">
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

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}