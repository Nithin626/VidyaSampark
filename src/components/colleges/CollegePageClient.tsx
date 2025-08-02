//src\components\colleges\CollegePageClient.tsx
"use client";

import { useState, useMemo } from 'react';
import { University, Stream, UniversityCourse, Course } from '@/types/menu';
import CollegeFilters from './CollegeFilters';
import CollegeList from './CollegeList';
import { Icon } from '@iconify/react/dist/iconify.js';

interface CollegePageClientProps {
  allUniversities: University[];
  allStreams: Stream[];
  allCourses: Course[];
  allUniversityCourses: UniversityCourse[];
}

export default function CollegePageClient({
  allUniversities,
  allStreams,
  allCourses,
  allUniversityCourses
}: CollegePageClientProps) {
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredUniversities = useMemo(() => {
    let universities = allUniversities;
    if (selectedLocations.length > 0) {
      universities = universities.filter(uni => selectedLocations.includes(uni.location));
    }
    if (selectedStreams.length > 0) {
      const courseIdsInStream = new Set(allCourses.filter(course => selectedStreams.includes(course.stream_id || '')).map(course => course.id));
      const universityIdsInStream = new Set(allUniversityCourses.filter(uc => courseIdsInStream.has(uc.course_id)).map(uc => uc.university_id));
      universities = universities.filter(uni => universityIdsInStream.has(uni.id));
    }
    return universities;
  }, [selectedStreams, selectedLocations, allUniversities, allCourses, allUniversityCourses]);

  const handleStreamChange = (streamId: string) => {
    setSelectedStreams(prev => prev.includes(streamId) ? prev.filter(id => id !== streamId) : [...prev, streamId]);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocations(prev => prev.includes(location) ? prev.filter(loc => loc !== location) : [...prev, location]);
  };

  const uniqueLocations = useMemo(() => 
    Array.from(new Set(allUniversities.map(uni => uni.location))), 
    [allUniversities]
  );

  return (
    // --- THIS IS THE FIX: A clean Flexbox layout ---
    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:block lg:w-1/4">
        <div className="sticky top-28">
            <CollegeFilters
              streams={allStreams}
              locations={uniqueLocations}
              selectedStreams={selectedStreams}
              selectedLocations={selectedLocations}
              onStreamChange={handleStreamChange}
              onLocationChange={handleLocationChange}
            />
        </div>
      </aside>

      {/* --- MAIN CONTENT (Mobile Button + College List) --- */}
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

        {filteredUniversities.length > 0 ? (
          <CollegeList universities={filteredUniversities} />
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">No Colleges Found</h3>
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
          <CollegeFilters
            streams={allStreams}
            locations={uniqueLocations}
            selectedStreams={selectedStreams}
            selectedLocations={selectedLocations}
            onStreamChange={handleStreamChange}
            onLocationChange={handleLocationChange}
          />
        </div>
      </div>
    </div>
  );
}
