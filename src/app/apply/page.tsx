"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function ApplyFormPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    course: "",
    college: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, phone, course, college } = formData;

    const { error } = await supabase.from("enquiries").insert([
      { name, phone, course, college },
    ]);

    if (error) {
      console.error("Supabase error:", error);
      setErrorMsg("❌ Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Admission Enquiry Form</h1>

      {submitted ? (
        <div className="bg-green-100 text-green-800 p-4 rounded text-center">
          ✅ Thank you! Your details have been submitted.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md p-6 rounded-lg">
          {errorMsg && (
            <div className="bg-red-100 text-red-800 p-3 rounded">{errorMsg}</div>
          )}

          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full border p-2 rounded mt-1"
              onChange={handleChange}
              value={formData.name}
            />
          </div>

          <div>
            <label className="block font-medium">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full border p-2 rounded mt-1"
              onChange={handleChange}
              value={formData.phone}
            />
          </div>

          <div>
            <label className="block font-medium">Select Course</label>
            <select
              name="course"
              required
              className="w-full border p-2 rounded mt-1"
              onChange={handleChange}
              value={formData.course}
            >
              <option value="">-- Select --</option>
              <option>B.Tech AI & ML</option>
              <option>B.Tech Cyber Security</option>
              <option>BCA</option>
              <option>MBA</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Select College</label>
            <select
              name="college"
              required
              className="w-full border p-2 rounded mt-1"
              onChange={handleChange}
              value={formData.college}
            >
              <option value="">-- Select --</option>
              <option>Cambridge Institute of Technology</option>
              <option>Lisa School of Design</option>
              <option>AMET University</option>
              <option>Yenopoya University</option>
              <option>MNR University</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
