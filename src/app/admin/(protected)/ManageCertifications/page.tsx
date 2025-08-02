// src/app/admin/(protected)/ManageCertifications/page.tsx
'use client';

import { useEffect, useState, FC, PropsWithChildren } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import {
  createCertificationCategoryAction,
  deleteCertificationCategoryAction,
  createCertificationCourseAction,
  updateCertificationCourseAction,
  deleteCertificationCourseAction,
} from '../../actions';

// --- Types (for clarity) ---
interface Category {
  id: string;
  name: string;
}
interface Course {
  id: string;
  name: string;
  overview: string;
  duration: string;
  category_id: string;
}

// --- Reusable Collapsible Component (copied from NewCoursePage) ---
const Collapsible: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="bg-white rounded-lg shadow">
      <button
        onClick={toggleOpen}
        className="w-full flex items-center p-4 font-semibold text-xl text-left focus:outline-none"
      >
        <svg
          className={`w-5 h-5 mr-3 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        <span>{title}</span>
      </button>
      {isOpen && <div className="p-4 border-t border-gray-200">{children}</div>}
    </div>
  );
};

export default function ManageCertificationsPage() {
  const supabase = createClientComponentClient();

  // --- State ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Create form state
  const [courseName, setCourseName] = useState('');
  const [overview, setOverview] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Edit form state
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [editName, setEditName] = useState('');
  const [editOverview, setEditOverview] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  
  // Delete form state
  const [selectedCourseIdToDelete, setSelectedCourseIdToDelete] = useState('');

  // --- Data Fetching & Refreshing ---
  const fetchData = async () => {
    const { data: catData } = await supabase.from('certification_categories').select('*');
    setCategories(catData || []);
    const { data: courseData } = await supabase.from('certification_courses').select('*');
    setCourses(courseData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshCategories = async () => {
    const { data } = await supabase.from('certification_categories').select('*');
    setCategories(data || []);
  };

  const refreshCourses = async () => {
    const { data } = await supabase.from('certification_courses').select('*');
    setCourses(data || []);
  };

  // --- Handlers for Categories ---
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createCertificationCategoryAction(newCategoryName);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success!);
      setNewCategoryName('');
      refreshCategories();
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm("Are you sure? This will remove the category from all associated courses.")) {
      const result = await deleteCertificationCategoryAction(categoryId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success!);
        refreshCategories();
        refreshCourses(); // Refresh courses in case any had this category
      }
    }
  };
  
  // --- Handlers for Courses ---
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createCertificationCourseAction({
      name: courseName,
      overview,
      duration,
      category_id: selectedCategoryId,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success!);
      setCourseName('');
      setOverview('');
      setDuration('');
      setSelectedCategoryId('');
      refreshCourses();
    }
  };

  const handleLoadCourseForEdit = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setCourseToEdit(course);
      setEditName(course.name || '');
      setEditOverview(course.overview || '');
      setEditDuration(course.duration || '');
      setEditCategoryId(course.category_id || '');
    } else {
      setCourseToEdit(null);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseToEdit) return;

    const result = await updateCertificationCourseAction(courseToEdit.id, {
      name: editName,
      overview: editOverview,
      duration: editDuration,
      category_id: editCategoryId,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success!);
      setCourseToEdit(null);
      refreshCourses();
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourseIdToDelete) {
      toast.error("Please select a course to delete.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this course?")) {
      const result = await deleteCertificationCourseAction(selectedCourseIdToDelete);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success!);
        setSelectedCourseIdToDelete("");
        refreshCourses();
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4 bg-gray-50">
      <Collapsible title="Manage Certification Categories">
        <form onSubmit={handleCreateCategory} className="space-y-4 mb-6">
          <div>
            <label className="block font-medium">New Category Name</label>
            <input
              type="text"
              placeholder="e.g., IT & Software, Digital Marketing"
              value={newCategoryName}
              required
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Create Category
          </button>
        </form>

        <div>
          <h3 className="font-semibold text-lg mb-2">Existing Categories</h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{cat.name}</span>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Collapsible>

      <Collapsible title="Create New Certification Course">
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="block font-medium">Course Name</label>
            <input
              type="text"
              placeholder="e.g., Certified Full-Stack Web Developer"
              
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Assign to Category</label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full border p-2 rounded mt-1 bg-white"
              required
            >
              <option value="">-- Select a Category --</option>
              {categories.map((cat) => (
                
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Course Duration</label>
            <input
              type="text"
              placeholder="e.g., 3 Months"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block font-medium">Overview</label>
            <textarea
              placeholder="Enter a brief description of the certification course"
              value={overview}
              required
              onChange={(e) => setOverview(e.target.value)}
              className="w-full border p-2 rounded mt-1"
              rows={4}
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Certification Course
          </button>
        </form>
      </Collapsible>
      
      <Collapsible title="Edit Certification Course">
          <select
              value={courseToEdit?.id || ''}
              onChange={(e) => handleLoadCourseForEdit(e.target.value)}
              className="w-full border p-2 rounded mb-4 bg-white"
          >
              <option value="">-- Select a course to edit --</option>
              {courses.map((course) => (
              <option key={course.id} value={course.id}>
                  {course.name}
              </option>
              ))}
          </select>
          
          {courseToEdit && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Form fields are identical to the create form but use 'edit' state variables */}
              <div>
                <label className="block font-medium">Course Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>
              <div>
                <label className="block font-medium">Assign to Category</label>
                <select
                  value={editCategoryId}
                  
                  onChange={(e) => setEditCategoryId(e.target.value)}
                  className="w-full border p-2 rounded mt-1 bg-white"
                  required
                >
                  <option value="">-- Select a Category --</option>
                  {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium">Course Duration</label>
                <input
                  type="text"
                  required
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>
              <div>
                <label className="block font-medium">Overview</label>
                <textarea
                  value={editOverview}
                  required
                  onChange={(e) => setEditOverview(e.target.value)}
                  className="w-full border p-2 rounded mt-1"
                  rows={4}
                />
              </div>
              <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                Update Course
              </button>
            </form>
          )}
      </Collapsible>

      <Collapsible title="Delete Certification Course">
        <select
          value={selectedCourseIdToDelete}
          onChange={(e) => setSelectedCourseIdToDelete(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        >
          <option value="">-- Select a course to delete --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleDeleteCourse}
          disabled={!selectedCourseIdToDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
        >
          Delete Course
        </button>
      </Collapsible>
    </div>
  );
}