//src\components\Layout\Header\Navigation\HeaderLink.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HeaderItem } from "@/types/menu";
import { usePathname } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const path = usePathname();
  const [isActive, setIsActive] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isLinkActive =
      path === item.href || item.submenu?.some((sub) => path === sub.href);
    setIsActive(Boolean(isLinkActive));
  }, [path, item.href, item.submenu]);

  useEffect(() => {
    const fetchData = async () => {
      if (item.label === "Courses") {
        const { data, error } = await supabase.from("courses").select("id, name");
        if (!error && data) setCourses(data);
      } else if (item.label === "Colleges") {
        const { data, error } = await supabase.from("universities").select("id, name");
        if (!error && data) setColleges(data);
      }
    };
    fetchData();
  }, [item.label]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (item.label === "Courses" || item.label === "Colleges") {
      setSubmenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setSubmenuOpen(false);
    }, 200);
  };

  const renderMegaDropdown = () => {
    const items = item.label === "Courses" ? courses : colleges;
    const basePath = item.label === "Courses" ? "/courses" : "/colleges";

    return (
      <div
        className="absolute left-0 mt-2 p-4 bg-white shadow-lg rounded-lg z-50 w-[600px] grid grid-cols-2 gap-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {items.slice(0, 10).map((entry) => (
          <Link
            key={entry.id}
            href={`${basePath}/${entry.id}`}
            className="text-gray-700 hover:text-blue-600 block"
          >
            {entry.name}
          </Link>
        ))}
        <Link
          href={basePath}
          className="col-span-2 text-blue-600 font-semibold mt-2 block hover:underline"
        >
          View All {item.label} →
        </Link>
      </div>
    );
  };

  return (
    <div
      className="relative group"
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="cursor-pointer">
        <Link
          href={item.href}
          className={`text-lg flex items-center gap-1 hover:text-black relative ${
            isActive
              ? "text-black after:absolute after:w-8 after:h-1 after:bg-primary after:rounded-full after:-bottom-1"
              : "text-grey"
          }`}
        >
          {item.label}
          {(item.label === "Courses" || item.label === "Colleges") && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.2em"
              height="1.2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="m7 10l5 5l5-5"
              />
            </svg>
          )}
        </Link>
      </div>

      {submenuOpen && renderMegaDropdown()}
    </div>
  );
};

export default HeaderLink;
