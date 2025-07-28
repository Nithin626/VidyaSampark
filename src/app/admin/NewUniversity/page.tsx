//src\app\admin\NewUniversity\page.tsx
'use client';

import { useEffect, useState, FC, PropsWithChildren } from 'react';
import { supabase } from '@/utils/supabaseClient';
import toast from 'react-hot-toast';
import { deleteUniversityAction, updateUniversityAction } from '../actions'; 

// --- Reusable Collapsible Component ---
interface CollapsibleProps {
  title: string;
}

const Collapsible: FC<PropsWithChildren<CollapsibleProps>> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="bg-white rounded-lg shadow">
      <button
        onClick={toggleOpen}
        className="w-full flex items-center p-4 font-semibold text-xl text-left focus:outline-none"
      >
        <svg
          className={`w-5 h-5 mr-3 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        <span>{title}</span>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

// Define the structure of your form data for better type safety
interface UniversityFormData {
    name: string;
    location: string;
    website: string;
    package: string;
    description: string; // This is the short description for the card
    accreditation: string;
    about: string; // This is the long description for the modal/details
}

export default function NewUniversityPage() {
  const initialFormData: UniversityFormData = {
    name: '',
    location: '',
    website: '',
    package: '',
    description: '',
    accreditation: '',
    about: ''
  };
  
  const [formData, setFormData] = useState<UniversityFormData>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [universities, setUniversities] = useState<any[]>([]);
  const [selectedEditId, setSelectedEditId] = useState('');
  const [editData, setEditData] = useState<UniversityFormData>(initialFormData);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    const { data, error } = await supabase
      .from('universities')
      .select('*'); // Select all fields to populate the edit form

    if (error) toast.error('Failed to fetch universities');
    else setUniversities(data || []);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 500 * 1024; // 500KB

        if (!allowedTypes.includes(file.type)) {
            toast.error('Invalid file type. Please select a JPG, JPEG, or PNG image.');
            e.target.value = ''; // Reset file input
            return;
        }
        if (file.size > maxSize) {
            toast.error('File is too large. Maximum size is 500KB.');
            e.target.value = ''; // Reset file input
            return;
        }
        setImageFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !imageFile) {
        toast.error('Name, Location, and an Image are required.');
        return;
    }

    setIsUploading(true);
    
    // 1. Upload the image file
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('university-images')
        .upload(filePath, imageFile);

    if (uploadError) {
        toast.error(`Image upload failed: ${uploadError.message}`);
        setIsUploading(false);
        return;
    }

    // 2. Get the public URL of the uploaded image
    const { data: urlData } = supabase.storage
        .from('university-images')
        .getPublicUrl(filePath);

    if (!urlData) {
        toast.error("Could not get the public URL for the image.");
        setIsUploading(false);
        return;
    }

    // 3. Insert the university data with the image URL
    const { error: insertError } = await supabase
        .from('universities')
        .insert([{ ...formData, image_url: urlData.publicUrl }]);

    setIsUploading(false);

    if (insertError) {
        toast.error(`❌ Failed to create university: ${insertError.message}`);
    } else {
        toast.success('✅ University created successfully!');
        setFormData(initialFormData); // Reset form
        setImageFile(null);
        // Clear file input visually
        const fileInput = document.getElementById('universityImage') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        fetchUniversities(); // Refresh the list
    }
  };

  const handleEditLoad = (id: string) => {
    const uni = universities.find((u) => u.id === id);
    if (uni) {
      setSelectedEditId(id);
      setEditData({
        name: uni.name || '',
        location: uni.location || '',
        website: uni.website || '',
        package: uni.package || '',
        description: uni.description || '',
        accreditation: uni.accreditation || '',
        about: uni.about || ''
      });
    }
  };

// in src/app/admin/NewUniversity/page.tsx

const handleEditSubmit = async () => {
    if (!selectedEditId) {
        toast.error("Please select a university to edit.");
        return;
    }

    const result = await updateUniversityAction(selectedEditId, editData);

    if (result.error) {
      toast.error(result.error);
    } else if (result.success) { // Add this check
      toast.success(result.success);
      setSelectedEditId('');
      fetchUniversities();
    }
  };

  const handleDeleteUniversity = async () => {
    if (!selectedEditId) {
      toast.error("Please select a university to delete.");
      return;
    }

    if (window.confirm("Are you sure? This will also remove the university from all courses.")) {
        const result = await deleteUniversityAction(selectedEditId);

        if (result.error) {
            toast.error(`❌ ${result.error}`);
        } else {
            toast.success(`🗑️ ${result.success}`);
            setSelectedEditId('');
            fetchUniversities();
        }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-50 space-y-4">
      <Collapsible title="Add New University">
        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
            {/* Standard Text Inputs */}
            <input name="name" placeholder="University Name" className="w-full border p-2 rounded" value={formData.name} onChange={handleChange} required />
            <input name="location" placeholder="Location (Only city name)" className="w-full border p-2 rounded" value={formData.location} onChange={handleChange} required />
            <input name="website" placeholder="Website URL" className="w-full border p-2 rounded" value={formData.website} onChange={handleChange} />
            <input name="package" placeholder="Average Package (e.g., 10 LPA) Prefix LPA" className="w-full border p-2 rounded" value={formData.package} onChange={handleChange} />
            <input name="accreditation" placeholder="Accreditation (e.g., NAAC A+, UGC)" className="w-full border p-2 rounded" value={formData.accreditation} onChange={handleChange} />
            
            {/* Description Textarea (Short) */}
            <textarea name="description" placeholder="Short Description (for the card) under 4 Lines" className="w-full border p-2 rounded" value={formData.description} onChange={handleChange} rows={3} />
            
            {/* About Textarea (Long) */}
            <textarea name="about" placeholder="About Section (for the details page/modal)" className="w-full border p-2 rounded" value={formData.about} onChange={handleChange} rows={6} />
            
            {/* File Input */}
            <div>
                <label className="block font-medium mb-1">University Image</label>
                <input 
                    id="universityImage"
                    type="file" 
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                />
                {imageFile && <p className="text-xs text-gray-600 mt-1">Selected: {imageFile.name}</p>}
            </div>

            <button type="submit" disabled={isUploading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
                {isUploading ? 'Uploading...' : 'Add University'}
            </button>
        </form>
      </Collapsible>

      <Collapsible title="Edit University Details">
        <div className="space-y-3 mt-3">
          <select
            className="w-full border p-2 rounded bg-white"
            onChange={(e) => handleEditLoad(e.target.value)}
            value={selectedEditId}
          >
            <option value="">-- Select University to Edit --</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          {selectedEditId && (
            <>
              {/* Note: Image editing is not included in this form for simplicity. */}
              <input name="name" placeholder="University Name" className="w-full border p-2 rounded" value={editData.name} onChange={handleEditChange} />
              <input name="location" placeholder="Location" className="w-full border p-2 rounded" value={editData.location} onChange={handleEditChange} />
              <input name="website" placeholder="Website" className="w-full border p-2 rounded" value={editData.website} onChange={handleEditChange} />
              <input name="package" placeholder="Package" className="w-full border p-2 rounded" value={editData.package} onChange={handleEditChange} />
              <input name="accreditation" placeholder="Accreditation" className="w-full border p-2 rounded" value={editData.accreditation} onChange={handleEditChange} />
              <textarea name="description" placeholder="Short Description" className="w-full border p-2 rounded" value={editData.description} onChange={handleEditChange} />
              <textarea name="about" placeholder="About Section" className="w-full border p-2 rounded" value={editData.about} onChange={handleEditChange} />
              
              <button
                onClick={handleEditSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </Collapsible>

      <Collapsible title="Delete University">
        <div className="mt-3 space-y-2">
          <select
            className="w-full border p-2 rounded bg-white"
            onChange={(e) => setSelectedEditId(e.target.value)}
            value={selectedEditId}
          >
            <option value="">-- Select University to Delete --</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleDeleteUniversity}
            disabled={!selectedEditId}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
          >
            Delete University
          </button>
        </div>
      </Collapsible>
    </div>
  );
}
