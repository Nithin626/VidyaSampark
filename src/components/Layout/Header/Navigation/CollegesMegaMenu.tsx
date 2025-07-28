import { useState } from 'react';
import Link from 'next/link';
import { Stream, MenuUniversity, MenuCourse, UniversityCourse, Course } from '@/types/menu';
import { Icon } from '@iconify/react/dist/iconify.js';

interface CollegesMegaMenuProps {
  streams: Stream[];
  universities: MenuUniversity[]; // Change this from University[]
  courses: MenuCourse[];       // Change this from Course[]
  universityCourses: UniversityCourse[];
}

const CollegesMegaMenu: React.FC<CollegesMegaMenuProps> = ({ 
  streams, 
  universities, 
  courses, 
  universityCourses 
}) => {
  const [activeStream, setActiveStream] = useState<Stream | null>(null);

  // Logic to determine which universities to show
  const getVisibleUniversities = () => {
    if (!activeStream) {
      return universities; // If no stream is hovered, show all
    }

    // 1. Find all courses that belong to the active stream
    const courseIdsInStream = new Set(
      courses
        .filter(course => course.stream_id === activeStream.id)
        .map(course => course.id)
    );

    // 2. Find all university IDs that offer these courses
    const universityIdsInStream = new Set(
      universityCourses
        .filter(uc => courseIdsInStream.has(uc.course_id))
        .map(uc => uc.university_id)
    );
    
    // 3. Filter the main universities list
    return universities.filter(uni => universityIdsInStream.has(uni.id));
  };

  const universitiesToShow = getVisibleUniversities();

  return (
    <div 
        className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg border-t border-gray-200"
        onMouseLeave={() => setActiveStream(null)} // Reset when mouse leaves the menu
    >
      <div className="container mx-auto lg:max-w-screen-xl p-6 grid grid-cols-12 gap-8">
        {/* Left Column: Streams */}
        <div className="col-span-3">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Colleges by Degree</h3>
          <ul className="space-y-2">
            {streams.map((stream) => (
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

        {/* Right Column: Filtered Universities */}
        <div className="col-span-9">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800">
                    {activeStream ? `Colleges for ${activeStream.name}` : 'All Partner Colleges'}
                </h3>
                <Link href="/colleges" className="text-sm font-semibold text-primary hover:underline">
                    View All Colleges →
                </Link>
            </div>
          
            <div className="grid grid-cols-3 gap-x-6 gap-y-3 max-h-64 overflow-y-auto">
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
                        {activeStream ? `No colleges found for ${activeStream.name}.` : 'No colleges found.'}
                    </p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CollegesMegaMenu;