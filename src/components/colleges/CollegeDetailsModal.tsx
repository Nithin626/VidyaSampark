//src\components\colleges\CollegeDetailsModal.tsx

"use client";

import { University } from "@/types/menu";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import Image from "next/image";

interface CollegeDetailsModalProps {
  university: University | null;
  onClose: () => void;
}

const CollegeDetailsModal: React.FC<CollegeDetailsModalProps> = ({ university, onClose }) => {
  if (!university) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="relative">
            {/* Header Image */}
            {university.image_url && (
                <Image
                    src={university.image_url}
                    alt={`Image of ${university.name}`}
                    width={1024}
                    height={400}
                    className="w-full h-64 object-cover rounded-t-lg"
                />
            )}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-200 transition"
                aria-label="Close modal"
            >
                <Icon icon="tabler:x" className="h-6 w-6 text-gray-700" />
            </button>
        </div>

        <div className="p-8">
            {/* Title and basic info */}
            <h2 className="text-3xl font-bold text-gray-900">{university.name}</h2>
            <p className="text-md text-gray-600 mt-1">{university.location}</p>

            {/* Key stats */}
            <div className="flex flex-wrap gap-4 mt-4 text-center">
                {university.package && <div className="bg-blue-50 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">{`Avg. Package: ${university.package}`}</div>}
                {university.accreditation && <div className="bg-green-50 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">{university.accreditation}</div>}
                {university.website && <Link href={university.website} target="_blank" className="bg-gray-100 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full hover:bg-gray-200">Visit Website</Link>}
            </div>

            {/* About Section */}
            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-2">About {university.name}</h3>
                <div className="prose max-w-none text-gray-700">
                    <p>{university.about || "More details coming soon."}</p>
                </div>
            </div>
             {/* Apply Button */}
            <div className="mt-8 text-center">
                 <Link
                    href={`/apply?college=${encodeURIComponent(university.name)}`}
                    className="inline-block bg-primary text-white font-bold px-10 py-3 rounded-lg hover:bg-primary/90 transition-transform duration-200 hover:scale-105"
                  >
                    Apply Now
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetailsModal;