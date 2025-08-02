// src\app\admin\(protected)\layout.tsx

// src\app\admin\(protected)\layout.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  // Check if a user is logged in
  if (user) {
    // Check if the user has the 'admin' role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // If the user is an admin, show the protected content
    if (profile?.role === 'admin') {
      return (
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
      );
    }
  }
  
  // If there's no user or the user is not an admin, redirect to the login page.
  redirect('/admin/login');
}