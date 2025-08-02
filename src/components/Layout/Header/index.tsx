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
import { useUI } from "@/context/UIContext";
import { cn } from "@/lib/utils";
// --- 1. IMPORT THE NEW COMPONENT ---
import CertificationsMegaMenu from "./Navigation/CertificationsMegaMenu";


// --- START: Mobile Menu Sub-Component ---
const MobileMenu = ({ menuData, closeMenu }: { menuData: MegaMenuData, closeMenu: () => void }) => {
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const { openSignInModal, openSignUpModal } = useUI();
    const { user } = useUser();

    const toggleAccordion = (menu: string) => {
        setOpenAccordion(openAccordion === menu ? null : menu);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        closeMenu();
    };

    return (
        <div className="p-6 flex flex-col h-full">
            <nav className="flex flex-col gap-4">
                <Link href="/" onClick={closeMenu} className="text-lg font-medium text-gray-700 hover:text-primary">Home</Link>
                <Link href="/#about" onClick={closeMenu} className="text-lg font-medium text-gray-700 hover:text-primary">About Us</Link>
                
                {/* Colleges Accordion */}
                <div>
                    <button onClick={() => toggleAccordion('colleges')} className="w-full flex justify-between items-center text-lg font-medium text-gray-700 hover:text-primary">
                        Colleges <Icon icon="tabler:chevron-down" className={`transition-transform ${openAccordion === 'colleges' ? 'rotate-180' : ''}`} />
                    </button>
                    {openAccordion === 'colleges' && (
                        <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-200">
                            {menuData.universities.slice(0, 10).map(uni => (
                                <Link key={uni.id} href={`/colleges?view=${uni.id}`} onClick={closeMenu} className="block text-gray-600 hover:text-primary">{uni.name}</Link>
                            ))}
                            <Link href="/colleges" onClick={closeMenu} className="block font-semibold text-primary hover:underline">View All</Link>
                        </div>
                    )}
                </div>

                {/* Courses Accordion */}
                <div>
                    <button onClick={() => toggleAccordion('courses')} className="w-full flex justify-between items-center text-lg font-medium text-gray-700 hover:text-primary">
                        Courses <Icon icon="tabler:chevron-down" className={`transition-transform ${openAccordion === 'courses' ? 'rotate-180' : ''}`} />
                    </button>
                    {openAccordion === 'courses' && (
                        <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-200">
                            {menuData.courses.slice(0, 10).map(course => (
                                <Link key={course.id} href={`/courses/${course.id}`} onClick={closeMenu} className="block text-gray-600 hover:text-primary">{course.name}</Link>
                            ))}
                             <Link href="/courses" onClick={closeMenu} className="block font-semibold text-primary hover:underline">View All</Link>
                        </div>
                    )}
                </div>

                {/* --- 4. ADD CERTIFICATIONS ACCORDION FOR MOBILE --- */}
                <div>
                    <button onClick={() => toggleAccordion('certifications')} className="w-full flex justify-between items-center text-lg font-medium text-gray-700 hover:text-primary">
                        Certification Courses <Icon icon="tabler:chevron-down" className={`transition-transform ${openAccordion === 'certifications' ? 'rotate-180' : ''}`} />
                    </button>
                    {openAccordion === 'certifications' && (
                        <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-200">
                            {menuData.certificationCourses.slice(0, 10).map(course => (
                                <Link key={course.id} href={`/certifications/${course.id}`} onClick={closeMenu} className="block text-gray-600 hover:text-primary">{course.name}</Link>
                            ))}
                             <Link href="/certifications" onClick={closeMenu} className="block font-semibold text-primary hover:underline">View All</Link>
                        </div>
                    )}
                </div>

                <Link href="/#news" onClick={closeMenu} className="text-lg font-medium text-gray-700 hover:text-primary">Latest News</Link>
            </nav>

            {/* Auth buttons at the bottom */}
            <div className="mt-auto pt-6 border-t">
                {user ? (
                    <button onClick={handleLogout} className="w-full text-center bg-red-500 text-white py-2 rounded-lg">Logout</button>
                ) : (
                    <div className="space-y-3">
                        <button onClick={() => { openSignInModal(); closeMenu(); }} className="w-full text-center bg-primary text-white py-2 rounded-lg">Sign In</button>
                        <button onClick={() => { openSignUpModal(); closeMenu(); }} className="w-full text-center bg-gray-200 text-primary py-2 rounded-lg">Sign Up</button>
                    </div>
                )}
            </div>
        </div>
    );
};
// --- END: Mobile Menu Sub-Component ---


interface HeaderProps {
  menuData: MegaMenuData;
}

const Header: React.FC<HeaderProps> = ({ menuData }) => {
  const { isSignInOpen, openSignInModal, closeSignInModal, isSignUpOpen, openSignUpModal, closeSignUpModal } = useUI();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const { user } = useUser();
  // --- 2. UPDATE ACTIVEMENU STATE TYPE ---
  const [activeMenu, setActiveMenu] = useState<"colleges" | "courses" | "certifications" | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  const signInRef = useRef<HTMLDivElement>(null);
  const signUpRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => setSticky(window.scrollY >= 80);

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
    if (signInRef.current && !signInRef.current.contains(event.target as Node)) closeSignInModal();
    if (signUpRef.current && !signUpRef.current.contains(event.target as Node)) closeSignUpModal();
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) setNavbarOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-300 bg-white ${ sticky ? "shadow-lg py-4" : "py-6" }`}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="container mx-auto lg:max-w-screen-xl flex items-center justify-between px-4">
        <Logo />
        
        {/* Desktop Navigation */}
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
          
          {/* --- 3. ADD NEW DESKTOP NAVIGATION ITEM --- */}
          <div className="h-full flex items-center" onMouseEnter={() => setActiveMenu("certifications")}>
            <span className="text-black cursor-pointer hover:text-primary font-medium flex items-center gap-1">
              Certification Courses <Icon icon="tabler:chevron-down" />
            </span>
            {activeMenu === 'certifications' && (
              <CertificationsMegaMenu
                categories={menuData.certificationCategories}
                courses={menuData.certificationCourses}
              />
            )}
          </div>

          <Link href="/#news" className="text-black hover:text-primary font-medium">Latest News</Link>
        </nav>

        {/* Desktop Auth & Mobile Hamburger */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm font-medium text-black">Welcome, {user.user_metadata?.name || user.email}</span>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm">Logout</button>
              </>
            ) : (
              <>
                <button className="bg-primary text-white hover:bg-primary/90 px-8 py-3 rounded-full text-base font-medium" onClick={openSignInModal}>Sign In</button>
                <button className="bg-gray-100 text-primary hover:bg-gray-200 px-8 py-3 rounded-full text-base font-medium" onClick={openSignUpModal}>Sign Up</button>
              </>
            )}
          </div>
          <button className="lg:hidden" onClick={() => setNavbarOpen(true)} aria-label="Open menu">
              <Icon icon="tabler:menu-2" className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {navbarOpen && <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setNavbarOpen(false)} />}
      <div
        ref={mobileMenuRef}
        className={cn(
            "fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50",
            navbarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <MobileMenu menuData={menuData} closeMenu={() => setNavbarOpen(false)} />
      </div>

      {/* Auth Modals */}
      {isSignInOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <div ref={signInRef} className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white p-8 text-center">
            <button onClick={closeSignInModal} className="absolute top-4 right-4" aria-label="Close"><Icon icon="tabler:x" className="h-6 w-6 text-gray-500 hover:text-black" /></button>
            <Signin onClose={closeSignInModal} />
          </div>
        </div>
      )}
      {isSignUpOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <div ref={signUpRef} className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white p-8 text-center">
              <button onClick={closeSignUpModal} className="absolute top-4 right-4" aria-label="Close"><Icon icon="tabler:x" className="h-6 w-6 text-gray-500 hover:text-black" /></button>
            <SignUp onClose={closeSignUpModal} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;