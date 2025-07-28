// src/components/Layout/Header/Navigation/CoursesMegaMenu.tsx
//
import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Stream, MenuCourse } from '@/types/menu';
interface CoursesMegaMenuProps {
  streams: Stream[];
  courses: MenuCourse[]; // Change this from Course[]
}


const CoursesMegaMenu: React.FC<CoursesMegaMenuProps> = ({ streams, courses }) => {
  const [activeStream, setActiveStream] = useState<Stream | null>(null);

  const coursesToShow = activeStream
    ? courses.filter(course => course.stream_id === activeStream.id)
    : courses;

  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg border-t border-gray-200">
      <div className="container mx-auto lg:max-w-screen-xl p-6 grid grid-cols-12 gap-8">
        {/* Left Column: Streams */}
        <div className="col-span-3">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Courses by Stream</h3>
          <ul className="space-y-2">
            {streams.map((stream) => (
              <li key={stream.id} onMouseEnter={() => setActiveStream(stream)}>
                <Link 
                  href={`/courses?stream=${stream.id}`} 
                  className="flex items-center justify-between p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                >
                  <span>{stream.name}</span>
                  <Icon icon="tabler:chevron-right" className="text-gray-400" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Courses */}
        <div className="col-span-9">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800">
                    {activeStream ? `${activeStream.name} Courses` : 'All Courses'}
                </h3>
                <Link href="/courses" className="text-sm font-semibold text-primary hover:underline">
                    View All Courses →
                </Link>
            </div>
          
            <div className="grid grid-cols-3 gap-x-6 gap-y-3 max-h-64 overflow-y-auto">
                {coursesToShow.length > 0 ? (
                    coursesToShow.map((course) => (
                        <Link 
                            key={course.id} 
                            href={`/courses/${course.id}`}
                            className="block p-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-primary transition-colors duration-200"
                        >
                            {course.name}
                        </Link>
                    ))
                ) : (
                    <p className="col-span-3 text-gray-500">No courses found for this stream.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesMegaMenu;