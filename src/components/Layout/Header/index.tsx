//src\components\Layout\Header\index.tsx
"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MegaMenuData } from "@/types/menu";
import Logo from "./Logo";
import Signin from "@/components/Auth/SignIn";
import SignUp from "@/components/Auth/SignUp";
import { Icon } from "@iconify/react/dist/iconify.js";
import useUser from "@/components/hooks/useUser";
import { supabase } from "@/utils/supabaseClient";
import CollegesMegaMenu from "./Navigation/CollegesMegaMenu";
import CoursesMegaMenu from "./Navigation/CoursesMegaMenu";
import { useUI } from "@/context/UIContext"; // --- 1. Import useUI ---

interface HeaderProps {
  menuData: MegaMenuData;
}

const Header: React.FC<HeaderProps> = ({ menuData }) => {
  // --- 2. Get modal state and functions from context ---
  const { 
    isSignInOpen, 
    openSignInModal, 
    closeSignInModal,
    isSignUpOpen,
    openSignUpModal,
    closeSignUpModal
  } = useUI();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const { user } = useUser();
  const [activeMenu, setActiveMenu] = useState<"colleges" | "courses" | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  const signInRef = useRef<HTMLDivElement>(null);
  const signUpRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    setSticky(window.scrollY >= 80);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen || navbarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSignInOpen, isSignUpOpen, navbarOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (signInRef.current && !signInRef.current.contains(event.target as Node)) {
      closeSignInModal();
    }
    if (signUpRef.current && !signUpRef.current.contains(event.target as Node)) {
      closeSignUpModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-300 bg-white ${
        sticky ? "shadow-lg py-4" : "py-6"
      }`}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="container mx-auto lg:max-w-screen-xl flex items-center justify-between px-4">
        <Logo />
        <nav className="hidden lg:flex flex-grow items-center gap-8 justify-center h-16">
          <Link href="/" className="text-black hover:text-primary font-medium">Home</Link>
          <Link href="/#about" className="text-black hover:text-primary font-medium">About Us</Link>
          <div className="h-full flex items-center" onMouseEnter={() => setActiveMenu("colleges")}>
            <span className="text-black cursor-pointer hover:text-primary font-medium flex items-center gap-1">
              Colleges <Icon icon="tabler:chevron-down" />
            </span>
            {activeMenu === 'colleges' && (
              <CollegesMegaMenu 
                streams={menuData.streams} 
                universities={menuData.universities} 
                courses={menuData.courses}
                universityCourses={menuData.universityCourses}
              />
            )}
          </div>
          <div className="h-full flex items-center" onMouseEnter={() => setActiveMenu("courses")}>
            <span className="text-black cursor-pointer hover:text-primary font-medium flex items-center gap-1">
              Courses <Icon icon="tabler:chevron-down" />
            </span>
            {activeMenu === 'courses' && (
              <CoursesMegaMenu streams={menuData.streams} courses={menuData.courses} />
            )}
          </div>
          <Link href="/#news" className="text-black hover:text-primary font-medium">Latest News</Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden lg:block text-sm font-medium text-black">
                Welcome, {user.user_metadata?.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="hidden lg:block bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* --- 3. Update buttons to use context functions --- */}
              <button
                className="hidden lg:block bg-primary text-white hover:bg-primary/90 px-8 py-3 rounded-full text-base font-medium"
                onClick={openSignInModal}
              >
                Sign In
              </button>
              <button
                className="hidden lg:block bg-gray-100 text-primary hover:bg-gray-200 px-8 py-3 rounded-full text-base font-medium"
                onClick={openSignUpModal}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- 4. Render modals based on context state --- */}
      {isSignInOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <div ref={signInRef} className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white p-8 text-center">
            <button onClick={closeSignInModal} className="absolute top-4 right-4" aria-label="Close">
                <Icon icon="tabler:x" className="h-6 w-6 text-gray-500 hover:text-black" />
            </button>
            <Signin onClose={closeSignInModal} />
          </div>
        </div>
      )}
      {isSignUpOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <div ref={signUpRef} className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white p-8 text-center">
             <button onClick={closeSignUpModal} className="absolute top-4 right-4" aria-label="Close">
                <Icon icon="tabler:x" className="h-6 w-6 text-gray-500 hover:text-black" />
            </button>
            <SignUp onClose={closeSignUpModal} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;