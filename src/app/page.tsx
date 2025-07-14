import React from "react";
import Hero from "@/components/Home/Hero";
import Companies from "@/components/Home/colleges";
import Courses from "@/components/Home/Courses";
//import Mentor from "@/components/Home/Mentor"; below add 
//import Testimonial from "@/components/Home/Testimonials"; below add
import Newsletter from "@/components/Home/Newsletter";
import AboutUs from "@/components/Home/AboutUs";
import News from "@/components/Home/News";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Vidya Sampark",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Companies />
      <Courses />
      <AboutUs />
      <News/>
      <Newsletter />
    </main>
  );
}