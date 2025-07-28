//src\components\colleges\CollegeList.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { University } from "@/types/menu";
import CollegeCard from "./CollegeCard";
import CollegeDetailsModal from "./CollegeDetailsModal";

interface CollegeListProps {
  universities: University[];
}

const CollegeList: React.FC<CollegeListProps> = ({ universities }) => {
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const searchParams = useSearchParams();

  // Effect to open modal from URL parameter
  useEffect(() => {
    const universityIdToView = searchParams.get('view');
    if (universityIdToView) {
      const uniToOpen = universities.find(u => u.id === universityIdToView);
      if (uniToOpen) {
        setSelectedUniversity(uniToOpen);
      }
    }
  }, [searchParams, universities]);

  // --- THIS IS THE FIX FOR THE SCROLLING ISSUE ---
  // This effect manages the body scroll based on whether a modal is open
  useEffect(() => {
    if (selectedUniversity) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup function to ensure scroll is restored when the component unmounts
    return () => {
        document.body.style.overflow = '';
    };
  }, [selectedUniversity]);
  // --- END OF FIX ---


  const handleViewDetails = (university: University) => {
    setSelectedUniversity(university);
    // We no longer need to set the style directly here
  };

  const handleCloseModal = () => {
    setSelectedUniversity(null);
    // We no longer need to set the style directly here
    window.history.pushState({}, '', '/colleges');
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {universities.map((uni) => (
          <CollegeCard 
            key={uni.id} 
            university={uni} 
            onViewDetails={handleViewDetails} 
          />
        ))}
      </div>
      
      <CollegeDetailsModal 
        university={selectedUniversity}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default CollegeList;