// src/components/certifications/CertificationCard.tsx
"use client";

import Link from 'next/link';
import { CertificationCourse } from '@/types/menu';
import { Icon } from '@iconify/react/dist/iconify.js';

interface CertificationCardProps {
  course: CertificationCourse;
}

const CertificationCard: React.FC<CertificationCardProps> = ({ course }) => {
  const truncateText = (text: string | null | undefined, length: number) => {
    if (!text) return "No overview available.";
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105">
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex-grow">
            {course.duration && (
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Icon icon="tabler:clock" className="mr-1.5" />
                    <span>{course.duration}</span>
                </div>
            )}
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{course.name}</h3>
            <p className="text-gray-600 leading-relaxed">
                {truncateText(course.overview, 120)}
            </p>
        </div>
        <div className="mt-6">
          <Link 
            href={`/certifications/${course.id}`}
            className="inline-flex items-center font-semibold text-primary hover:text-primary/80"
          >
            View More Details
            <Icon icon="tabler:arrow-right" className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CertificationCard;