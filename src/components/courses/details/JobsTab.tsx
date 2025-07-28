"use client";

import { Course } from '@/types/menu';

interface JobInfo {
  title: string;
  avg_salary: string;
}

const JobsTab: React.FC<{ course: Course }> = ({ course }) => {
  // Defensive check to ensure course.jobs_info is an object and has the jobs array
  const jobsData: JobInfo[] =
    course && course.jobs_info && Array.isArray(course.jobs_info.jobs)
      ? course.jobs_info.jobs
      : [];

  return (
    <div className="py-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Career Opportunities</h3>
      {jobsData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left font-semibold text-gray-700 p-3">Job Title</th>
                <th className="text-left font-semibold text-gray-700 p-3">Average Salary</th>
              </tr>
            </thead>
            <tbody>
              {jobsData.map((job, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3 text-gray-800">{job.title}</td>
                  <td className="p-3 text-gray-800">{job.avg_salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">Information about career opportunities will be updated soon.</p>
      )}
    </div>
  );
};

export default JobsTab;