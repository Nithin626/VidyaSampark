// src/components/certifications/CertificationPageClient.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CertificationCourse, CertificationCategory } from '@/types/menu';
import CertificationFilters from './CertificationFilters';
import CertificationCard from './CertificationCard';
import { Icon } from '@iconify/react/dist/iconify.js';

interface CertificationPageClientProps {
  allCourses: CertificationCourse[];
  allCategories: CertificationCategory[];
}

export default function CertificationPageClient({
  allCourses,
  allCategories,
}: CertificationPageClientProps) {
  const searchParams = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) setSelectedCategories([categoryParam]);
  }, [searchParams]);

  const filteredCourses = useMemo(() => {
    if (selectedCategories.length === 0) return allCourses;
    return allCourses.filter(course => selectedCategories.includes(course.category_id || ''));
  }, [selectedCategories, allCourses]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]);
  };

  const clearFilters = () => {
      setSelectedCategories([]);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-1/4">
        <div className="sticky top-28">
            <CertificationFilters
              categories={allCategories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              clearFilters={clearFilters}
            />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="w-full flex items-center justify-center gap-2 p-3 bg-white rounded-lg shadow font-semibold text-gray-700"
          >
            <Icon icon="tabler:filter" className="h-5 w-5" />
            Show Filters
          </button>
        </div>

        {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredCourses.map((course) => (
                    <CertificationCard key={course.id} course={course} />
                ))}
            </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">No Courses Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
          </div>
        )}
      </main>

      {/* Mobile Filter Panel (Overlay) */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setIsFilterOpen(false)} />
      )}
      <div className={`fixed top-0 left-0 h-full w-full max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={() => setIsFilterOpen(false)}><Icon icon="tabler:x" className="h-6 w-6" /></button>
        </div>
        <div className="p-2">
          <CertificationFilters
            categories={allCategories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            clearFilters={clearFilters}
          />
        </div>
      </div>
    </div>
  );
}