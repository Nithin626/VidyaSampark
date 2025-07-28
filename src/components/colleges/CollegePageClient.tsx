//src\components\colleges\CollegePageClient.tsx
"use client";

import { useState, useMemo } from 'react';
import { University, Stream, UniversityCourse, Course } from '@/types/menu';
import CollegeFilters from './CollegeFilters';
import CollegeList from './CollegeList';

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

// in src/components/colleges/CollegePageClient.tsx

  return (
    // --- THIS IS THE FIX ---
    // Change grid to 5 columns, give 1 to sidebar, 4 to content
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-1">
        <CollegeFilters
          streams={allStreams}
          locations={uniqueLocations}
          selectedStreams={selectedStreams}
          selectedLocations={selectedLocations}
          onStreamChange={handleStreamChange}
          onLocationChange={handleLocationChange}
        />
      </div>

      <div className="lg:col-span-4">
        {filteredUniversities.length > 0 ? (
          <CollegeList universities={filteredUniversities} />
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">No Colleges Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}