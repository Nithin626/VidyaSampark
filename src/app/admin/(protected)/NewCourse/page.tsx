//src\app\admin\(protected)\NewCourse\page.tsx
'use client';

import { useEffect, useState, FC, PropsWithChildren } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import { 
    assignCourseAction, 
    unassignCourseAction, 
    deleteCourseAction, 
    createStreamAction,
    deleteStreamAction,
    createCourseAction,
    updateCourseAction
} from '../../actions';

// --- Reusable Collapsible Component ---
interface CollapsibleProps {
  title: string;
}

const Collapsible: FC<PropsWithChildren<CollapsibleProps>> = ({ title, children }) => {
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
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};
 
export default function NewCoursePage() {
  // Create an auth-aware Supabase client for client-side operations
  const supabase = createClientComponentClient();

  // --- States for creating a course ---
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedStreamId, setSelectedStreamId] = useState('');
  const [syllabus, setSyllabus] = useState('');
  const [jobsInfo, setJobsInfo] = useState('');

  // --- States for editing a course ---
  const [selectedCourseIdToEdit, setSelectedCourseIdToEdit] = useState('');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editStreamId, setEditStreamId] = useState('');
  const [editSyllabus, setEditSyllabus] = useState('');
  const [editJobsInfo, setEditJobsInfo] = useState('');

  // --- Other existing states  ---
  const [universities, setUniversities] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [selectedUniversityIds, setSelectedUniversityIds] = useState<string[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourseIdToDelete, setSelectedCourseIdToDelete] = useState('');
  const [selectedCourseIdForUnassign, setSelectedCourseIdForUnassign] = useState('');
  const [assignedUniversities, setAssignedUniversities] = useState<any[]>([]);
  const [selectedUniversityIdToUnassign, setSelectedUniversityIdToUnassign] = useState('');
  const [newStreamName, setNewStreamName] = useState('');

  // --- Data Fetching and Refreshing ---
  const fetchData = async () => {
    const { data: uniData } = await supabase.from('universities').select('id, name');
    setUniversities(uniData || []);

    const { data: courseData } = await supabase.from('courses').select('*');
    setCourses(courseData || []);

    const { data: streamData } = await supabase.from('streams').select('*');
    setStreams(streamData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshStreams = async () => {
      const { data } = await supabase.from('streams').select('*');
      setStreams(data || []);
  };

  const refreshCourses = async () => {
    const { data } = await supabase.from('courses').select('*');
    setCourses(data || []);
  };

  useEffect(() => {
    const fetchAssignedUniversities = async () => {
      if (!selectedCourseIdForUnassign) {
        setAssignedUniversities([]);
        setSelectedUniversityIdToUnassign('');
        return;
      }
      const { data, error } = await supabase
        .from('university_courses')
        .select('universities(id, name)')
        .eq('course_id', selectedCourseIdForUnassign);

      if (error) {
        toast.error('Failed to fetch assigned universities.');
        setAssignedUniversities([]);
      } else {
        const mappedUniversities = data.map(item => item.universities).filter(Boolean);
        setAssignedUniversities(mappedUniversities as any[]);
      }
    };

    fetchAssignedUniversities();
  }, [selectedCourseIdForUnassign]);


  // --- Handler Functions ---

  const handleCreateStream = async (e: React.FormEvent) => {
      e.preventDefault();
      const result = await createStreamAction(newStreamName);
      if (result.error) {
          toast.error(result.error);
      } else {
          toast.success(result.success!);
          setNewStreamName('');
          refreshStreams();
      }
  };

  const handleDeleteStream = async (streamId: string) => {
      if (window.confirm("Are you sure? Deleting a stream will remove it as a category for all associated courses.")) {
          const result = await deleteStreamAction(streamId);
          if (result.error) {
              toast.error(result.error);
          } else {
              toast.success(result.success!);
              refreshStreams();
          }
      }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createCourseAction({
        name: courseName,
        description: description,
        duration: duration,
        stream_id: selectedStreamId,
        syllabus: syllabus,
        jobs_info: jobsInfo,
    });

    if (result.error) {
        toast.error(result.error);
    } else {
        toast.success(result.success!);
        // Reset form fields
        setCourseName('');
        setDescription('');
        setDuration('');
        setSelectedStreamId('');
        setSyllabus('');
        setJobsInfo('');
        refreshCourses();
    }
  };
  
  const handleLoadCourseForEdit = (courseId: string) => {
      setSelectedCourseIdToEdit(courseId);
      const course = courses.find((c) => c.id === courseId);
      if (course) {
          setEditName(course.name || '');
          setEditDescription(course.description || '');
          setEditDuration(course.duration || '');
          setEditStreamId(course.stream_id || '');
          setEditSyllabus(course.syllabus ? JSON.stringify(course.syllabus, null, 2) : '');
          setEditJobsInfo(course.jobs_info ? JSON.stringify(course.jobs_info, null, 2) : '');
      }
  };

  const handleAssign = async () => {
    if (!selectedCourseId || selectedUniversityIds.length === 0) {
      toast.error('Select a course and at least one university.');
      return;
    }
    const result = await assignCourseAction(selectedCourseId, selectedUniversityIds);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success!);
      setSelectedUniversityIds([]);
    }
  };

  const handleUnassign = async () => {
    if (!selectedCourseIdForUnassign || !selectedUniversityIdToUnassign) {
      toast.error('Please select a course and a university to un-assign.');
      return;
    }
    const result = await unassignCourseAction(selectedCourseIdForUnassign, selectedUniversityIdToUnassign);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success!);
      const currentCourse = selectedCourseIdForUnassign;
      setSelectedCourseIdForUnassign('');
      setSelectedCourseIdForUnassign(currentCourse);
    }
  };


  const handleEditSubmit = async () => {
      if (!selectedCourseIdToEdit) {
          toast.error('Please select a course to edit.');
          return;
      }

      const result = await updateCourseAction(selectedCourseIdToEdit, {
          name: editName,
          description: editDescription,
          duration: editDuration,
          stream_id: editStreamId,
          syllabus: editSyllabus,
          jobs_info: editJobsInfo
      });
      
      if (result.error) {
          toast.error(result.error);
      } else {
          toast.success(result.success!);
          setSelectedCourseIdToEdit(''); // This will hide the edit form
          refreshCourses(); // This updates the list with the new data
      }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourseIdToDelete) {
      toast.error("Please select a course to delete.");
      return;
    }
    if (window.confirm("Are you sure?")) {
      const result = await deleteCourseAction(selectedCourseIdToDelete);
      if (result.error) {
        toast.error(`❌ ${result.error}`);
      } else {
        toast.success(`✅ ${result.success}`);
        setSelectedCourseIdToDelete("");
        refreshCourses();
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4 bg-gray-50">
      
      <Collapsible title="Manage Course Streams">
        <form onSubmit={handleCreateStream} className="space-y-4 mb-6">
            <div>
                <label className="block font-medium">New Stream Name</label>
                <input
                type="text"
                placeholder="e.g., Engineering, Medical, Commerce"
                value={newStreamName}
                onChange={(e) => setNewStreamName(e.target.value)}
                className="w-full border p-2 rounded mt-1"
                />
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                Create Stream
            </button>
        </form>

        <div>
            <h3 className="font-semibold text-lg mb-2">Existing Streams</h3>
            <ul className="space-y-2">
                {streams.map(stream => (
                    <li key={stream.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                        <span>{stream.name}</span>
                        <button 
                            onClick={() => handleDeleteStream(stream.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
      </Collapsible>

      <Collapsible title="Create New Course">
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="block font-medium">Course Name</label>
            <input
              type="text"
              placeholder="e.g., B.Tech in Computer Science"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
           <div>
              <label className="block font-medium">Assign to Stream</label>
              <select
                value={selectedStreamId}
                onChange={(e) => setSelectedStreamId(e.target.value)}
                className="w-full border p-2 rounded mt-1 bg-white"
                required
              >
                  <option value="">-- Select a Stream --</option>
                  {streams.map(stream => (
                      <option key={stream.id} value={stream.id}>{stream.name}</option>
                  ))}
              </select>
           </div>
          <div>
            <label className="block font-medium">Course Duration</label>
            <input
              type="text"
              placeholder="e.g., 4 Years"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              placeholder="Enter a brief description of the course"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block font-medium">Syllabus (JSON format)</label>
            <textarea
              placeholder='e.g., [{"semester": 1, "subjects": ["Math", "Physics"]}]'
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              className="w-full border p-2 rounded mt-1 font-mono text-sm"
              rows={5}
              />
          </div>
          <div>
              <label className="block font-medium">Jobs Info (JSON format)</label>
              <textarea
                placeholder='e.g., [{"title": "Software Engineer", "avg_salary": "12 LPA"}]'
                value={jobsInfo}
                onChange={(e) => setJobsInfo(e.target.value)}
                className="w-full border p-2 rounded mt-1 font-mono text-sm"
                rows={5}
              />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Course
          </button>
        </form>
      </Collapsible>

      <Collapsible title="Assign Course to Universities">
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">-- Select a course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border p-2 rounded">
          {universities.map((uni) => (
            <label key={uni.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedUniversityIds.includes(uni.id)}
                onChange={() =>
                  setSelectedUniversityIds((prev) =>
                    prev.includes(uni.id)
                      ? prev.filter((id) => id !== uni.id)
                      : [...prev, uni.id]
                  )
                }
              />
              <span>{uni.name}</span>
            </label>
          ))}
        </div>
        <button
          onClick={handleAssign}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Assign to Universities
        </button>
      </Collapsible>

      <Collapsible title="Un-assign Course from University">
        <select
          value={selectedCourseIdForUnassign}
          onChange={(e) => setSelectedCourseIdForUnassign(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">-- Select a course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        {selectedCourseIdForUnassign && (
          <select
            value={selectedUniversityIdToUnassign}
            onChange={(e) => setSelectedUniversityIdToUnassign(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            disabled={assignedUniversities.length === 0}
          >
            <option value="">-- Select university to un-assign --</option>
            {assignedUniversities.length > 0 ? (
              assignedUniversities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.name}
                </option>
              ))
            ) : (
              <option disabled>No universities assigned to this course</option>
            )}
          </select>
        )}

        <button
          onClick={handleUnassign}
          disabled={!selectedCourseIdForUnassign || !selectedUniversityIdToUnassign}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:bg-gray-400"
        >
          Un-assign Course
        </button>
      </Collapsible>

      <Collapsible title="Edit Existing Course">
          <select
              value={selectedCourseIdToEdit}
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
          
          {selectedCourseIdToEdit && (
              <div className="space-y-4">
                  <div>
                      <label className="block font-medium">Course Name</label>
                      <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full border p-2 rounded mt-1"
                      />
                  </div>
                  <div>
                      <label className="block font-medium">Assign to Stream</label>
                      <select
                          value={editStreamId}
                          onChange={(e) => setEditStreamId(e.target.value)}
                          className="w-full border p-2 rounded mt-1 bg-white"
                          required
                      >
                          <option value="">-- Select a Stream --</option>
                          {streams.map(stream => (
                              <option key={stream.id} value={stream.id}>{stream.name}</option>
                          ))}
                      </select>
                  </div>
                  <div>
                      <label className="block font-medium">Course Duration</label>
                      <input
                          type="text"
                          value={editDuration}
                          onChange={(e) => setEditDuration(e.target.value)}
                          className="w-full border p-2 rounded mt-1"
                      />
                  </div>
                  <div>
                      <label className="block font-medium">Description</label>
                      <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full border p-2 rounded mt-1"
                          rows={4}
                      />
                  </div>
                  <div>
                      <label className="block font-medium">Syllabus (JSON format)</label>
                      <textarea
                          value={editSyllabus}
                          onChange={(e) => setEditSyllabus(e.target.value)}
                          className="w-full border p-2 rounded mt-1 font-mono text-sm"
                          rows={5}
                      />
                  </div>
                  <div>
                      <label className="block font-medium">Jobs Info (JSON format)</label>
                      <textarea
                          value={editJobsInfo}
                          onChange={(e) => setEditJobsInfo(e.target.value)}
                          className="w-full border p-2 rounded mt-1 font-mono text-sm"
                          rows={5}
                      />
                  </div>
                  <button
                      onClick={handleEditSubmit}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                      Update Course
                  </button>
              </div>
          )}
      </Collapsible>

      <Collapsible title="Delete Course">
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
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Course
        </button>
      </Collapsible>
    </div>
  );
}