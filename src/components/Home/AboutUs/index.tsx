//src\components\Home\AboutUs\index.tsx
"use client";
import React from "react";

const AboutUs = () => {
  return (
    <section id="about" className="bg-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-semibold text-midnight_text mb-6">About Us</h2>
        {/* Adjusted classes for better readability */}
        <p className="text-base md:text-lg text-gray-600 leading-8 text-justify">
          Founded in XXXX and based in Bangalore, <strong>Vidya Sampark</strong> is dedicated to simplifying the college admissions process. We partner with renowned universities to create a seamless, trusted path from aspiration to admission. Whether you're pursuing technical or creative fields, we make the connection easy and reliable, guiding you every step of the way. Our expert counselors provide personalized support, ensuring you find the best fit for your academic and career goals.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;

