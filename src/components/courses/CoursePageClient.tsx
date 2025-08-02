//src\components\courses\CoursePageClient.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Course, Stream } from '@/types/menu';
import CourseFilters from './CourseFilters';
import CourseCard from './CourseCard';
import { Icon } from '@iconify/react/dist/iconify.js';

interface CoursePageClientProps {
  allCourses: Course[];
  allStreams: Stream[];
}

export default function CoursePageClient({
  allCourses,
  allStreams,
}: CoursePageClientProps) {
  const searchParams = useSearchParams();
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  useEffect(() => {
    const streamParam = searchParams.get('stream');
    if (streamParam) setSelectedStreams([streamParam]);
  }, [searchParams]);

  const filteredCourses = useMemo(() => {
    if (selectedStreams.length === 0) return allCourses;
    return allCourses.filter(course => selectedStreams.includes(course.stream_id || ''));
  }, [selectedStreams, allCourses]);

  const handleStreamChange = (streamId: string) => {
    setSelectedStreams(prev => prev.includes(streamId) ? prev.filter(id => id !== streamId) : [...prev, streamId]);
  };

  const clearFilters = () => {
      setSelectedStreams([]);
  };

  return (
    // --- THIS IS THE FIX: A clean Flexbox layout ---
    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:block lg:w-1/4">
        <div className="sticky top-28">
            <CourseFilters
              streams={allStreams}
              selectedStreams={selectedStreams}
              onStreamChange={handleStreamChange}
              clearFilters={clearFilters}
            />
        </div>
      </aside>

      {/* --- MAIN CONTENT (Mobile Button + Course List) --- */}
      <main className="flex-1">
        {/* --- MOBILE FILTER BUTTON --- */}
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
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">No Courses Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
          </div>
        )}
      </main>

      {/* --- MOBILE FILTER PANEL (OVERLAY) --- */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setIsFilterOpen(false)} />
      )}
      <div className={`fixed top-0 left-0 h-full w-full max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={() => setIsFilterOpen(false)}><Icon icon="tabler:x" className="h-6 w-6" /></button>
        </div>
        <div className="p-2">
          <CourseFilters
            streams={allStreams}
            selectedStreams={selectedStreams}
            onStreamChange={handleStreamChange}
            clearFilters={clearFilters}
          />
        </div>
      </div>
    </div>
  );
}
