//src\app\admin\login\layout.tsx
import React from 'react';

// This simple layout will override the main admin layout for the login page only.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}