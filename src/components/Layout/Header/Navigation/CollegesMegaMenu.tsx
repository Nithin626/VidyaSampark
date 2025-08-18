//src\components\Layout\Header\Navigation\CollegesMegaMenu.tsx

import { useState } from 'react';
import Link from 'next/link';
import { Stream, MenuUniversity, MenuCourse, UniversityCourse } from '@/types/menu';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useBreakpoint } from '@/components/hooks/useBreakpoint';
import { siteConfig } from '@/config/site';

interface CollegesMegaMenuProps {
  streams: Stream[];
  universities: MenuUniversity[];
  courses: MenuCourse[];
  universityCourses: UniversityCourse[];
}

const CollegesMegaMenu: React.FC<CollegesMegaMenuProps> = ({
  streams,
  universities,
  courses,
  universityCourses
}) => {
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  const breakpoint = useBreakpoint();
  const maxUniversities = siteConfig.megaMenu.itemCount[breakpoint] || 12;
  const maxFilters = siteConfig.megaMenu.filterCount[breakpoint] || 8;

  const getFilteredUniversities = () => {
    if (!activeStream) return universities;

    const courseIdsInStream = new Set(
      courses.filter(course => course.stream_id === activeStream.id).map(course => course.id)
    );

    const universityIds = new Set(
      universityCourses
        .filter(uc => courseIdsInStream.has(uc.course_id))
        .map(uc => uc.university_id)
    );

    return universities.filter(uni => universityIds.has(uni.id));
  };

  const filteredUniversities = getFilteredUniversities();
  const universitiesToShow = filteredUniversities.slice(0, maxUniversities);

  return (
    <div
      className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg border-t border-gray-200"
      onMouseLeave={() => setActiveStream(null)}
    >
      <div className="container mx-auto lg:max-w-screen-xl p-6 grid grid-cols-12 gap-8">

        {/* Left Column: Streams */}
        <div className="col-span-3 flex flex-col">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Colleges by Degree</h3>
          <ul className="space-y-2 flex-grow max-h-64 overflow-y-auto pr-2">
            {streams.slice(0, maxFilters).map((stream) => (
              <li key={stream.id} onMouseEnter={() => setActiveStream(stream)}>
                <Link
                  href={`/colleges?stream=${stream.id}`}
                  className="flex items-center justify-between p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                >
                  <span>{stream.name}</span>
                  <Icon icon="tabler:chevron-right" className="text-gray-400" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Universities */}
        <div className="col-span-9 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">
              {activeStream ? `Colleges for ${activeStream.name}` : 'All Partner Colleges'}
            </h3>
            <Link href="/colleges" className="text-sm font-semibold text-primary hover:underline">
              View All Colleges →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-x-6 gap-y-3 max-h-64 overflow-y-auto pr-2">
            {universitiesToShow.length > 0 ? (
              universitiesToShow.map((uni) => (
                <Link
                  key={uni.id}
                  href={`/colleges?view=${uni.id}`}
                  className="block p-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-primary transition-colors duration-200"
                >
                  {uni.name}
                </Link>
              ))
            ) : (
              <p className="col-span-3 text-gray-500">
                {activeStream
                  ? `No colleges found for ${activeStream.name}.`
                  : 'No colleges found.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Thin scrollbar style */}
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

export default CollegesMegaMenu;

