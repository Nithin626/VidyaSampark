//src\components\colleges\CollegeFilters.tsx

"use client";

import { Stream } from "@/types/menu";
import { Icon } from "@iconify/react/dist/iconify.js";

interface CollegeFiltersProps {
  streams: Stream[];
  locations: string[];
  selectedStreams: string[];
  selectedLocations: string[];
  onStreamChange: (streamId: string) => void;
  onLocationChange: (location: string) => void;
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-6 border-b border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const Checkbox: React.FC<{ id: string; label: string; checked: boolean; onChange: () => void; }> = ({ id, label, checked, onChange }) => (
  <label htmlFor={id} className="flex items-center cursor-pointer text-gray-700 hover:text-primary">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
    />
    <span className="ml-3">{label}</span>
  </label>
);


const CollegeFilters: React.FC<CollegeFiltersProps> = ({
  streams,
  locations,
  selectedStreams,
  selectedLocations,
  onStreamChange,
  onLocationChange,
}) => {
  return (
    // Add "sticky top-28" to this div to match the other filter component
    <div className="bg-white rounded-lg shadow-md p-6 ">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Filters</h2>
          {/* We can add a clear all button here later */}
      </div>
      
      <FilterSection title="Stream">
        {streams.map((stream) => (
          <Checkbox
            key={stream.id}
            id={`stream-${stream.id}`}
            label={stream.name}
            checked={selectedStreams.includes(stream.id)}
            onChange={() => onStreamChange(stream.id)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Location">
        {locations.map((location) => (
          <Checkbox
            key={location}
            id={`loc-${location}`}
            label={location}
            checked={selectedLocations.includes(location)}
            onChange={() => onLocationChange(location)}
          />
        ))}
      </FilterSection>
    </div>
  );
};

export default CollegeFilters;