// app/admin/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome Admin 👨‍💻</h1>
    </div>
  );
}
