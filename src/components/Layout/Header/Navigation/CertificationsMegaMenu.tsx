//src\components\Layout\Header\Navigation\CertificationsMegaMenu.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';
import { CertificationCategory, MenuCertificationCourse } from '@/types/menu';
import { useBreakpoint } from '@/components/hooks/useBreakpoint';
import { siteConfig } from '@/config/site';

interface CertificationsMegaMenuProps {
  categories: CertificationCategory[];
  courses: MenuCertificationCourse[];
}

const CertificationsMegaMenu: React.FC<CertificationsMegaMenuProps> = ({ categories, courses }) => {
  const [activeCategory, setActiveCategory] = useState<CertificationCategory | null>(null);
  const breakpoint = useBreakpoint();

  const maxCourses = siteConfig.megaMenu.itemCount[breakpoint] || 12;
  const maxFilters = siteConfig.megaMenu.filterCount[breakpoint] || 8;

  const filteredCourses = activeCategory
    ? courses.filter(course => course.category_id === activeCategory.id)
    : courses;

  const categoriesToShow = categories.slice(0, maxFilters);
  const coursesToShow = filteredCourses.slice(0, maxCourses);

  return (
    <div
      className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg border-t border-gray-200"
      onMouseLeave={() => setActiveCategory(null)}
    >
      <div className="container mx-auto lg:max-w-screen-xl p-6 grid grid-cols-12 gap-8">

        {/* Left Column: Categories */}
        <div className="col-span-3 flex flex-col">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Courses by Category</h3>
          <ul
            className="space-y-2 flex-grow max-h-64 overflow-y-auto pr-2"
            style={{ scrollbarWidth: 'thin' }}
          >
            {categoriesToShow.map((category) => (
              <li key={category.id} onMouseEnter={() => setActiveCategory(category)}>
                <Link
                  href={`/certifications?category=${category.id}`}
                  className="flex items-center justify-between p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                >
                  <span>{category.name}</span>
                  <Icon icon="tabler:chevron-right" className="text-gray-400" />
                </Link>
              </li>
            ))}
          </ul>
          {categories.length > maxFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link href="/certifications" className="text-sm font-semibold text-primary hover:underline">
                View all categories →
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Certification Courses */}
        <div className="col-span-9 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">
              {activeCategory ? `${activeCategory.name} Courses` : 'All Certification Courses'}
            </h3>
            {filteredCourses.length > maxCourses && (
              <Link href="/certifications" className="text-sm font-semibold text-primary hover:underline">
                View All Certifications →
              </Link>
            )}
          </div>

          <div
            className="grid grid-cols-3 gap-x-6 gap-y-3 min-h-[200px] max-h-64 overflow-y-auto pr-2"
            style={{ scrollbarWidth: 'thin' }}
          >
            {coursesToShow.length > 0 ? (
              coursesToShow.map((course) => (
                <Link
                  key={course.id}
                  href={`/certifications/${course.id}`}
                  className="block p-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-primary transition-colors duration-200"
                >
                  {course.name}
                </Link>
              ))
            ) : (
              <div className="col-span-3 flex items-center justify-center text-gray-400">
                <p>
                  {activeCategory
                    ? `No courses found for ${activeCategory.name}.`
                    : "No courses found."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hide scrollbars for WebKit browsers */}
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default CertificationsMegaMenu;
