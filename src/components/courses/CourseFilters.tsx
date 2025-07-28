//src\components\courses\CourseFilters.tsx
"use client";

import { Stream } from "@/types/menu";

interface CourseFiltersProps {
  streams: Stream[];
  selectedStreams: string[];
  onStreamChange: (streamId: string) => void;
  clearFilters: () => void;
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

const CourseFilters: React.FC<CourseFiltersProps> = ({
  streams,
  selectedStreams,
  onStreamChange,
  clearFilters,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 ">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Filters</h2>
          {(selectedStreams.length > 0) && (
            <button 
                onClick={clearFilters} 
                className="text-sm font-semibold text-primary hover:underline"
            >
                Clear All
            </button>
          )}
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
    </div>
  );
};

export default CourseFilters;