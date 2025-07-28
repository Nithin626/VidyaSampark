//src\components\courses\details\CollegesTab.tsx
"use client";

import { University } from '@/types/menu';
import Link from 'next/link';

interface CollegesTabProps {
  colleges: University[];
}

const CollegesTab: React.FC<CollegesTabProps> = ({ colleges }) => {
  return (
    <div className="py-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Colleges Offering This Course</h3>
      {colleges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {colleges.map((college) => (
            <div key={college.id} className="bg-white p-5 shadow rounded-lg border border-gray-100">
              <h4 className="text-lg font-bold text-gray-900">{college.name}</h4>
              <p className="text-sm text-gray-500 mb-3">{college.location}</p>
              <Link 
                href={`/colleges?view=${college.id}`} 
                className="text-sm font-semibold text-primary hover:underline"
              >
                View College Details →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          We are in the process of updating our list of partner colleges for this course. Please check back soon!
        </p>
      )}
    </div>
  );
};

export default CollegesTab;