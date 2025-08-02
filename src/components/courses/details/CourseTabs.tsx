//src\components\courses\details\CourseTabs.tsx
"use client";

import { useState } from 'react';
import { Course, University } from '@/types/menu';
import OverviewTab from './OverviewTab';
import CollegesTab from './CollegesTab';
import SyllabusTab from './SyllabusTab';
import JobsTab from './JobsTab';  
import { cn } from '@/lib/utils'; // Assuming you have a cn utility for classnames

type TabName = 'overview' | 'colleges' | 'syllabus' | 'jobs';

export default function CourseTabs({ course, colleges }: { course: Course, colleges: University[] }) {
  //line added for debug
  
  const [activeTab, setActiveTab] = useState<TabName>('overview');

  const tabs: { id: TabName; label: string; disabled?: boolean }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'colleges', label: 'Colleges' },
    { id: 'syllabus', label: 'Syllabus' }, // Disabled for now
    { id: 'jobs', label: 'Jobs' },         // Disabled for now
  ];

// in src/components/courses/details/CourseTabs.tsx

  return (
    <div>
      {/* Tab Buttons */}
      <div className="border-b border-gray-200">
        {/* --- THIS IS THE FIX --- */}
        {/* Add overflow-x-auto to enable horizontal scrolling on small screens */}
        {/* Add scrollbar-hide for a cleaner look (requires tailwind-scrollbar-hide plugin if you have it, otherwise it's safe to ignore) */}
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'overview' && <OverviewTab course={course} />}
        {activeTab === 'colleges' && <CollegesTab colleges={colleges} />}
        {activeTab === 'syllabus' && <SyllabusTab course={course} />}
        {activeTab === 'jobs' && <JobsTab course={course} />}
      </div>
    </div>
  );
}