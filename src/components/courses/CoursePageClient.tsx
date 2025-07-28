//src\components\courses\CoursePageClient.tsx

"use client";

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Course, Stream } from '@/types/menu';
import CourseFilters from './CourseFilters';
import CourseCard from './CourseCard';

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

// in src/components/courses/CoursePageClient.tsx

  return (
    // --- THIS IS THE FIX ---
    // Change grid to 5 columns, give 1 to sidebar, 4 to content
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-1">
        <CourseFilters
          streams={allStreams}
          selectedStreams={selectedStreams}
          onStreamChange={handleStreamChange}
          clearFilters={clearFilters}
        />
      </div>

      <div className="lg:col-span-4">
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
      </div>
    </div>
  );
}