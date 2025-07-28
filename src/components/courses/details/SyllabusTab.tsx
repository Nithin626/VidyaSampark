"use client";

import { Course } from '@/types/menu';

interface SyllabusItem {
  semester: number;
  subjects: string[];
}

const SyllabusTab: React.FC<{ course: Course }> = ({ course }) => {
  // Defensive check to ensure course.syllabus is an object and has the semesters array
  const syllabusData: SyllabusItem[] =
    course && course.syllabus && Array.isArray(course.syllabus.semesters)
      ? course.syllabus.semesters
      : [];

  return (
    <div className="py-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Course Syllabus</h3>
      {syllabusData.length > 0 ? (
        <div className="space-y-6">
          {syllabusData.map((item) => (
            <div key={item.semester} className="p-4 border rounded-lg bg-gray-50">
              <h4 className="font-bold text-lg text-primary mb-2">Semester {item.semester}</h4>
              <ul className="space-y-1 list-disc list-inside text-gray-700">
                {item.subjects.map((subject, index) => (
                  <li key={index}>{subject}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">The syllabus for this course will be updated soon.</p>
      )}
    </div>
  );
};

export default SyllabusTab;