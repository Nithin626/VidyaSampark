//src\app\apply\page.tsx
// src/app/apply/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import useUser from "@/components/hooks/useUser";
import Loader from "@/components/Common/Loader";
import { useUI } from "@/context/UIContext";
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
// --- ADDED: Type for a single certification course ---
interface CertificationCourse {
  id: string;
  name: string;
}

export default function ApplyFormPage() {
  const searchParams = useSearchParams();
  const { user, loading: userLoading } = useUser();
  const { openSignInModal } = useUI();

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
  // --- ADDED: State to hold the pre-filled certification course ---
  const [certificationCourse, setCertificationCourse] = useState<CertificationCourse | null>(null);

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

      // --- MODIFIED: The entire data fetching logic is updated ---

      // 1. Fetch the user's profile first (no change here)
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
      
      // 2. Check for a certification course ID in the URL
      const certId = searchParams.get('certification_id');

      if (certId) {
        // This is a certification application
        const { data: certCourseData, error } = await supabase
          .from('certification_courses')
          .select('id, name')
          .eq('id', certId)
          .single();
        
        if (certCourseData) {
          setCertificationCourse(certCourseData);
        } else {
          setErrorMsg("Could not find the specified certification course.");
        }
      } else {
        // This is a regular college/course application (existing logic)
        const collegeParam = searchParams.get('college');
        let fetchedUniversities: DropdownUniversity[] = [];
        let fetchedCourses: DropdownCourse[] = [];
        
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

        const prefilledCourseName = searchParams.get("course");
        if (prefilledCourseName) {
            const course = fetchedCourses.find(c => c.name === prefilledCourseName);
            if (course) {
              setFormData(prev => ({ ...prev, course_id: course.id }));
            }
        }
      }

      setLoadingData(false);
    };

    initializeForm();
  }, [user, userLoading, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- MODIFIED: Submission logic handles both cases ---
    let enquiryPayload: any = {
        name: formData.name, 
        phone: formData.phone, 
        email: formData.email, 
        current_class: formData.current_class,
    };

    if (certificationCourse) {
        // Payload for a certification enquiry
        enquiryPayload.certification_course_id = certificationCourse.id;
        // Ensure regular course/college IDs are null
        enquiryPayload.course_id = null;
        enquiryPayload.college_id = null;
    } else {
        // Payload for a regular enquiry
        if (!formData.university_id || !formData.course_id) {
            setErrorMsg("Please select both a college and a course.");
            return;
        }
        enquiryPayload.course_id = formData.course_id;
        enquiryPayload.college_id = formData.university_id;
        enquiryPayload.course = courses.find(c => c.id === formData.course_id)?.name;
        enquiryPayload.college = universities.find(u => u.id === formData.university_id)?.name;
        enquiryPayload.certification_course_id = null;
    }

    const result = await createEnquiryAction(enquiryPayload);

    if (result.error) {
        setErrorMsg(`❌ ${result.error}`);
    } else {
        setSubmitted(true);
        setErrorMsg("");
    }
  };

  if (userLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }
  
  if (!user) {
    return (
        <div className="max-w-xl mx-auto text-center py-20 pt-40">
            <h2 className="text-2xl font-bold mb-4">Please Sign In to Apply</h2>
            <p className="text-gray-600 mb-6">You need an account to submit an application. Please sign in or create an account to continue.</p>
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
          ✅ Thank you! Your application has been submitted. Our team will contact you shortly.
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

          {/* --- MODIFIED: Conditionally render course selection --- */}
          {certificationCourse ? (
            <div>
              <label className="block font-medium text-gray-500">Applying for Certification Course</label>
              <input type="text" value={certificationCourse.name} readOnly className="w-full border p-2 rounded mt-1 bg-gray-100 cursor-not-allowed" />
            </div>
          ) : (
            <>
              <div>
                <label className="block font-medium">Select College</label>
                <select
                  name="university_id"
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
            </>
          )}

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

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