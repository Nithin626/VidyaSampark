//src\app\admin\login\page.tsx
// In: src/app/admin/login/page.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import { loginAction } from '../actions';

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        action={loginAction} // <-- Use the server action here
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-6 text-center">Admin Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email" // <-- The 'name' attribute is essential for server actions
            type="email"
            className="w-full px-3 py-2 border rounded text-sm"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password" // <-- The 'name' attribute is essential
            type="password"
            className="w-full px-3 py-2 border rounded text-sm"
            required
          />
        </div>

        {/* Display error messages from the URL */}
        {message && (
            <p className="text-sm text-red-500 text-center mb-4">{message}</p>
        )}

        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded hover:bg-primary/90 disabled:bg-gray-400"
        >
          Login
        </button>
      </form>
    </div>
  );
}