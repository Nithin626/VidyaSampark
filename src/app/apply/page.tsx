//src\app\apply\page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import useUser from "@/components/hooks/useUser";
import Loader from "@/components/Common/Loader";
import { useUI } from "@/context/UIContext"; // Import the useUI hook
import { createEnquiryAction } from "../admin/actions";

// Simple types for the dropdown data
interface DropdownCourse {
  id: string;
  name: string;
}
interface DropdownUniversity {
  id: string;
  name: string;
}

export default function ApplyFormPage() {
  const searchParams = useSearchParams();
  const { user, loading: userLoading } = useUser();
  const { openSignInModal } = useUI(); // Get the function to open the modal from context

  // Get pre-filled data from URL
  const prefilledCourseName = searchParams.get("course");
  const prefilledCollegeName = searchParams.get("college");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    current_class: "",
    course_id: "",
    university_id: "",
  });

  const [courses, setCourses] = useState<DropdownCourse[]>([]);
  const [universities, setUniversities] = useState<DropdownUniversity[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const initializeForm = async () => {
      if (userLoading) return;

      if (!user) {
        setLoadingData(false);
        return;
      }

      setLoadingData(true);

      // 1. Fetch the logged-in user's profile
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("name, phone, email, current_class")
        .eq("id", user.id)
        .single();
      
      if (profileData) {
        setFormData(prev => ({
            ...prev,
            name: profileData.name || '',
            phone: profileData.phone || '',
            email: profileData.email || '',
            current_class: profileData.current_class || '',
        }));
      }
      
      // 2. Fetch courses and universities with contextual filtering
      let fetchedUniversities: DropdownUniversity[] = [];
      let fetchedCourses: DropdownCourse[] = [];
      
      const collegeParam = searchParams.get('college');
      if (collegeParam) {
          const { data: uniData } = await supabase.from('universities').select('id, name').eq('name', collegeParam).single();
          if (uniData) {
              fetchedUniversities = [uniData];
              setFormData(prev => ({ ...prev, university_id: uniData.id }));
              
              const { data: courseMappings } = await supabase
                .from('university_courses')
                .select('courses(id, name)')
                .eq('university_id', uniData.id);

              if (courseMappings) {
                fetchedCourses = courseMappings.map(m => m.courses).flat().filter(Boolean) as DropdownCourse[];
              }
          }
      } else {
          const { data: allUnis } = await supabase.from("universities").select("id, name");
          const { data: allCourses } = await supabase.from("courses").select("id, name");
          fetchedUniversities = allUnis || [];
          fetchedCourses = allCourses || [];
      }
      
      setUniversities(fetchedUniversities);
      setCourses(fetchedCourses);

      if (prefilledCourseName) {
        const course = fetchedCourses.find(c => c.name === prefilledCourseName);
        if (course) {
          setFormData(prev => ({ ...prev, course_id: course.id }));
        }
      }

      setLoadingData(false);
    };

    initializeForm();
  }, [user, userLoading, searchParams, prefilledCourseName]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createEnquiryAction({ 
        name: formData.name, 
        phone: formData.phone, 
        email: formData.email, 
        current_class: formData.current_class,
        course_id: formData.course_id,
        college_id: formData.university_id,
        course: courses.find(c => c.id === formData.course_id)?.name,
        college: universities.find(u => u.id === formData.university_id)?.name
    });

    if (result.error) {
        setErrorMsg(`❌ ${result.error}`);
    } else {
        setSubmitted(true);
    }
};

  if (userLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }
  
  // Updated UI for logged-out users
  if (!user) {
    return (
        <div className="max-w-xl mx-auto text-center py-20 pt-40">
            <h2 className="text-2xl font-bold mb-4">Please Sign In to Apply</h2>
            <p className="text-gray-600 mb-6">
                You need an account to submit an application. Please sign in or create an account to continue.
            </p>
            <button 
                onClick={openSignInModal}
                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90"
            >
                Sign In / Sign Up
            </button>
        </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 pt-32">
      <h1 className="text-3xl font-bold mb-6 text-center">Admission Enquiry Form</h1>
      {submitted ? (
        <div className="bg-green-100 text-green-800 p-4 rounded text-center">
          ✅ Thank you! Your application has been submitted.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md p-8 rounded-lg">
          {/* User Details (pre-filled and read-only) */}
          <div>
            <label className="block font-medium text-gray-500">Full Name</label>
            <input type="text" value={formData.name} readOnly className="w-full border p-2 rounded mt-1 bg-gray-100 cursor-not-allowed" />
          </div>
          <div>
            <label className="block font-medium text-gray-500">Phone Number</label>
            <input type="tel" value={formData.phone} readOnly className="w-full border p-2 rounded mt-1 bg-gray-100 cursor-not-allowed" />
          </div>
          <div>
            <label className="block font-medium text-gray-500">Email Address</label>
            <input type="email" value={formData.email} readOnly className="w-full border p-2 rounded mt-1 bg-gray-100 cursor-not-allowed" />
          </div>
          <div>
            <label className="block font-medium text-gray-500">Current Class</label>
            <input type="text" value={formData.current_class} readOnly className="w-full border p-2 rounded mt-1 bg-gray-100 cursor-not-allowed" />
          </div>
          <hr/>
          {/* Dynamic Selections */}
          <div>
            <label className="block font-medium">Select College</label>
            <select
              name="university_id"
              required
              className="w-full border p-2 rounded mt-1 bg-white"
              onChange={handleChange}
              value={formData.university_id}
              disabled={loadingData || !!searchParams.get('college')}
            >
              <option value="">{loadingData ? "Loading..." : "-- Select College --"}</option>
              {universities.map(uni => (
                  <option key={uni.id} value={uni.id}>{uni.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Select Course</label>
            <select
              name="course_id"
              required
              className="w-full border p-2 rounded mt-1 bg-white"
              onChange={handleChange}
              value={formData.course_id}
              disabled={loadingData}
            >
              <option value="">{loadingData ? "Loading..." : "-- Select Course --"}</option>
              {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loadingData}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-bold disabled:bg-gray-400"
          >
            Submit Application
          </button>
        </form>
      )}
    </div>
  );
}
