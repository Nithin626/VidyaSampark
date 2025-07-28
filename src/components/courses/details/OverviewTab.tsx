//src\components\courses\details\OverviewTab.tsx
"use client";

import { Course } from '@/types/menu';

interface OverviewTabProps {
  course: Course;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ course }) => {
  return (
    <div className="py-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Course Overview</h3>
      <div className="prose max-w-none text-gray-700">
        <p>
          {course.description || "A detailed overview for this course will be available soon."}
        </p>
      </div>
    </div>
  );
};

export default OverviewTab;