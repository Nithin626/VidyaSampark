"use client";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/admin" className="text-xl font-bold text-primary">
      AdminPanel
    </Link>
  );
};

export default Logo;
