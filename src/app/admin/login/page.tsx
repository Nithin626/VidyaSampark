"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "nithing626@gmail.com";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "12345678";

export default function AdminLoginPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false); // <-- fix
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Prevent hydration mismatch
  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      toast.success("Admin login successful");
      router.push("/admin");
    } else {
      toast.error("Invalid admin credentials");
    }
  };

  if (!hydrated) return null; // prevent mismatch

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-6 text-center">Admin Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm mb-2">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded hover:bg-primary/90"
        >
          Login
        </button>
      </form>
    </div>
  );
}
