// src/components/certifications/CertificationFilters.tsx
"use client";

import { CertificationCategory } from "@/types/menu";

interface CertificationFiltersProps {
  categories: CertificationCategory[];
  selectedCategories: string[];
  onCategoryChange: (categoryId: string) => void;
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

const CertificationFilters: React.FC<CertificationFiltersProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
  clearFilters,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 ">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Filters</h2>
          {(selectedCategories.length > 0) && (
            <button 
                onClick={clearFilters} 
                className="text-sm font-semibold text-primary hover:underline"
            >
                Clear All
            </button>
          )}
      </div>
      
      <FilterSection title="Category">
        {categories.map((category) => (
          <Checkbox
            key={category.id}
            id={`category-${category.id}`}
            label={category.name}
            checked={selectedCategories.includes(category.id)}
            onChange={() => onCategoryChange(category.id)}
          />
        ))}
      </FilterSection>
    </div>
  );
};

export default CertificationFilters;