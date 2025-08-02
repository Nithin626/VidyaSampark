// src/components/Layout/Header/Navigation/CertificationsMegaMenu.tsx
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

  const maxCourses = siteConfig.megaMenu.itemCount[breakpoint];
  
  const maxFilters = siteConfig.megaMenu.filterCount[breakpoint];

  const filteredCourses = activeCategory
    ? courses.filter(course => course.category_id === activeCategory.id)
    : courses;

  const coursesToShow = filteredCourses.slice(0, maxCourses);

  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg border-t border-gray-200">
      <div className="container mx-auto lg:max-w-screen-xl p-6 grid grid-cols-12 gap-8">

        {/* Left Column: Categories */}
        <div className="col-span-3">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Courses by Category</h3>
          <ul className="space-y-2">
            {categories.slice(0, maxFilters).map((category) => (
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
        </div>

        {/* Right Column: Certification Courses */}
        <div className="col-span-9">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">
              {activeCategory ? `${activeCategory.name} Courses` : 'All Certification Courses'}
            </h3>
            <Link href="/certifications" className="text-sm font-semibold text-primary hover:underline">
              View All Certifications →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-x-6 gap-y-3 max-h-64 overflow-y-auto">
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
              <p className="col-span-3 text-gray-500">
                {activeCategory ? `No courses found for ${activeCategory.name}.` : 'No courses found.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationsMegaMenu;