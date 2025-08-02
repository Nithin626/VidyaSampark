//src\app\admin\(protected)\AddCourse\page.tsx
'use client';

import { useEffect, useState } from 'react';
// Import the specific client creator for client components
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
// Import the new server action
import { addSimpleCourseWithUniversitiesAction } from '../../actions';

export default function AddCoursePage() {
  // 👇 Create an auth-aware Supabase client.
  const supabase = createClientComponentClient();

  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [universities, setUniversities] = useState<any[]>([]);
  const [selectedUniversityIds, setSelectedUniversityIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      // This now works because the client is auth-aware
      const { data } = await supabase.from('universities').select('id, name');
      setUniversities(data || []);
    };
    fetchUniversities();
  }, []);

  const handleCheckboxChange = (id: string) => {
    setSelectedUniversityIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName) return toast.error("Course name is required");

    // Call the new, secure server action instead of writing to the DB from the client
    const result = await addSimpleCourseWithUniversitiesAction(
      courseName,
      description,
      selectedUniversityIds
    );

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success!);
      setCourseName('');
      setDescription('');
      setSelectedUniversityIds([]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* The form JSX remains unchanged */}
        <div>
          <label className="block font-medium">Course Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded mt-1"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            className="w-full border p-2 rounded mt-1"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Select Colleges</label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
            {universities.map((uni) => (
              <label key={uni.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={uni.id}
                  checked={selectedUniversityIds.includes(uni.id)}
                  onChange={() => handleCheckboxChange(uni.id)}
                />
                {uni.name}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Course
        </button>
      </form>
    </div>
  );
}