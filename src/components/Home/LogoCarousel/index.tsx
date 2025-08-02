"use client";
import React from 'react';
import Image from 'next/image';
import './LogoCarousel.css'; // We will create this CSS file next

interface UniversityLogo {
  id: string;
  name: string;
  logo_url: string | null;
}

const LogoCarousel = ({ logos }: { logos: UniversityLogo[] }) => {
  if (!logos || logos.length === 0) {
    return null; // Don't render anything if there are no logos
  }

  // Duplicate the logos to create a seamless loop effect
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl font-semibold text-gray-600 mb-8">Our Partner Universities</h2>
        <div className="logo-carousel-container">
          <div className="logo-carousel-track">
            {duplicatedLogos.map((logo, index) => (
              <div key={`${logo.id}-${index}`} className="logo-carousel-item">
                {logo.logo_url && (
                  <Image
                    src={logo.logo_url}
                    alt={`${logo.name} Logo`}
                    width={150}
                    height={75}
                    style={{ objectFit: 'contain', width: '150px', height: '75px' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoCarousel;