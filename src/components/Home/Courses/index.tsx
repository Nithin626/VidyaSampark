"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { courseData } from "@/app/api/data";
import { getImagePrefix } from "@/utils/util";

const Courses = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 2,
    arrows: false,
    autoplay: true,
    speed: 500,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <>
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <Icon
              key={`full-${i}`}
              icon="tabler:star-filled"
              className="text-yellow-500 text-xl"
            />
          ))}
        {halfStars > 0 && (
          <Icon
            icon="tabler:star-half-filled"
            className="text-yellow-500 text-xl"
          />
        )}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <Icon
              key={`empty-${i}`}
              icon="tabler:star-filled"
              className="text-gray-400 text-xl"
            />
          ))}
      </>
    );
  };

  return (
    <section id="courses">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <div className="sm:flex justify-between items-center mb-20">
          <h2 className="text-midnight_text text-4xl lg:text-5xl font-semibold mb-5 sm:mb-0">
            Popular courses.
          </h2>
          <Link
            href={"/courses"} // 🔁 NOW points to the full courses page
            className="text-primary text-lg font-medium hover:tracking-widest duration-500"
          >
            Explore courses&nbsp;&gt;&nbsp;
          </Link>
        </div>

        <Slider {...settings}>
          {courseData.map((items, i) => (
            <div key={i}>
              <div className="bg-white m-3 mb-12 px-3 pt-3 pb-6 shadow-course-shadow rounded-2xl h-full flex flex-col justify-between">
                <div className="relative rounded-3xl">
                  <Image
                    src={`${getImagePrefix()}${items.imgSrc}`}
                    alt="course-image"
                    width={389}
                    height={262}
                    className="m-auto clipPath"
                  />

                </div>

                <div className="px-3 pt-6">
                  <Link
                    href="#"
                    className="text-2xl font-bold text-black max-w-[75%] inline-block"
                  >
                    {items.heading}
                  </Link>

                  <div className="flex items-center gap-4 pt-4">
                    <h3 className="text-red-700 text-xl font-medium">{items.rating}</h3>
                    <div className="flex">{renderStars(items.rating)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Courses;
