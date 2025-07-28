//src\components\colleges\CollegeCard.tsx
"use client";

import { University } from "@/types/menu";
import Image from "next/image";
import { Icon } from '@iconify/react/dist/iconify.js';

interface CollegeCardProps {
  university: University;
  onViewDetails: (university: University) => void;
}

const CollegeCard: React.FC<CollegeCardProps> = ({ university, onViewDetails }) => {
  const placeholderDescription = "A renowned institution offering a diverse range of undergraduate and postgraduate programs across various disciplines.";
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col">
      <div className="relative h-48 w-full">
        {university.image_url ? (
          <Image
            src={university.image_url}
            alt={`Image of ${university.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Icon icon="tabler:photo-off" className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 truncate">{university.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{university.location}</p>

        <div className="flex-grow">
            <div className="flex flex-wrap gap-2 mb-4">
                {university.accreditation && 
                    <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">{university.accreditation}</span>
                }
                {university.package && 
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{`Avg. ${university.package}`}</span>
                }
            </div>
            {/* --- THIS IS THE FIX for uneven heights --- */}
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                {university.description || placeholderDescription}
            </p>
        </div>

        <div className="mt-5">
          <button
            onClick={() => onViewDetails(university)}
            className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
          >
            View Full Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;