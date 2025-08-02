// --- Detailed types for pages ---
export interface University {
  id: string;
  name: string;
  location: string;
  image_url: string | null;
  package: string | null;
  accreditation: string | null;
  description: string | null;
  about: string | null;
  website: string | null;
}

export interface Course {
  id: string;
  name: string;
  stream_id: string | null;
  description: string | null;
  duration: string | null;
  syllabus: any | null;
  jobs_info: any | null;
}

// --- Simple types for the Mega Menu ---
export interface MenuUniversity {
  id: string;
  name: string;
}

export interface MenuCourse {
  id: string;
  name: string;
  stream_id: string | null;
}

export interface Stream {
  id: string;
  name: string;
}

export interface UniversityCourse {
  university_id: string;
  course_id: string;
}

// This interface now uses the simple types
export interface MegaMenuData {
  streams: Stream[];
  courses: MenuCourse[];
  universities: MenuUniversity[];
  universityCourses: UniversityCourse[];
}

// Type for old menu data (can be removed later)
export interface HeaderItem { 
  label: string;
  href: string;
}
// in src/types/menu.ts

export interface HeaderItem { 
  label: string;
  href: string;
  submenu?: { label: string; href: string; }[]; // <-- ADD THIS LINE
}
// src/types/menu.ts

// ... (keep all your existing types)

// --- ADD THESE NEW TYPES FOR THE CERTIFICATIONS MEGA MENU ---
export interface CertificationCategory {
  id: string;
  name: string;
}

export interface MenuCertificationCourse {
  id: string;
  name: string;
  category_id: string | null;
}

// And add the new types to the main MegaMenuData interface
export interface MegaMenuData {
  streams: Stream[];
  courses: MenuCourse[];
  universities: MenuUniversity[];
  universityCourses: UniversityCourse[];
  // --- ADD THESE TWO LINES ---
  certificationCategories: CertificationCategory[];
  certificationCourses: MenuCertificationCourse[];
}
// src/types/menu.ts

// ... (keep all your existing types)

// --- ADD THIS NEW TYPE FOR THE CERTIFICATION PAGES ---
export interface CertificationCourse {
  id: string;
  name: string;
  category_id: string | null;
  overview: string | null;
  duration: string | null;
}