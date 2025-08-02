//src\app\admin\(protected)\NewUniversity\page.tsx
'use client';

import { useEffect, useState, FC, PropsWithChildren } from 'react';
// Import the specific client creator for client components
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import { deleteUniversityAction, updateUniversityAction, createUniversityAction } from '../../actions'; 

// --- Reusable Collapsible Component (No Changes Here) ---
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


interface UniversityFormData {
    name: string;
    location: string;
    website: string;
    package: string;
    description: string;
    accreditation: string;
    about: string;
}

export default function NewUniversityPage() {
  // 👇 THIS IS THE KEY CHANGE. Create an auth-aware Supabase client.
  const supabase = createClientComponentClient();

  // The rest of your state and functions will now work correctly...
  const initialFormData: UniversityFormData = {
    name: '', location: '', website: '', package: '', 
    description: '', accreditation: '', about: ''
  };
  
  const [formData, setFormData] = useState<UniversityFormData>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [universities, setUniversities] = useState<any[]>([]);
  const [selectedEditId, setSelectedEditId] = useState('');
  const [editData, setEditData] = useState<UniversityFormData>(initialFormData);
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    // This query will now work because the client knows you are authenticated
    const { data, error } = await supabase.from('universities').select('*');
    if (error) toast.error('Failed to fetch universities');
    else setUniversities(data || []);
  };

  // --- No other changes are needed below this line ---
  // All your handlers (handleFileChange, uploadFile, handleSubmit, etc.)
  // will use the new auth-aware 'supabase' client and work as expected.
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = fileType === 'image' ? 500 * 1024 : 200 * 1024;
    if (file.size > maxSize) {
        toast.error(`File is too large. Max size is ${maxSize / 1024}KB.`);
        e.target.value = '';
        return;
    }
    if (fileType === 'image') {
        setImageFile(file);
    } else {
        setLogoFile(file);
    }
  };
 
   const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       const file = e.target.files?.[0];
       if (!file) return;
       setEditLogoFile(file);
   };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      // This upload will now work because the client has the user's auth token
      const { error, data } = await supabase.storage.from(bucket).upload(fileName, file);
      if (error) {
          toast.error(`Upload failed for ${bucket}: ${error.message}`);
          return null;
      }
      
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !imageFile || !logoFile) {
        toast.error('Name, University Image, and University Logo are required.');
        return;
    }
    setIsUploading(true);
    const imageUrl = await uploadFile(imageFile, 'university-images');
    const logoUrl = await uploadFile(logoFile, 'university-logos');
    if (!imageUrl || !logoUrl) {
        setIsUploading(false);
        return;
    }
    const result = await createUniversityAction({
        ...formData,
        image_url: imageUrl,
        logo_url: logoUrl,
    });
    if (result.error) {
        toast.error(result.error);
    } else {
        toast.success(result.success!);
        setFormData(initialFormData);
        setImageFile(null);
        setLogoFile(null);
        (document.getElementById('universityImage') as HTMLInputElement).value = '';
        (document.getElementById('universityLogo') as HTMLInputElement).value = '';
        // No need to call fetchUniversities() thanks to revalidation in the action
    }
    setIsUploading(false);
  };

  const handleEditLoad = (id: string) => {
    const uni = universities.find((u) => u.id === id);
    if (uni) {
      setSelectedEditId(id);
      setEditData({
        name: uni.name || '', location: uni.location || '', website: uni.website || '',
        package: uni.package || '', description: uni.description || '',
        accreditation: uni.accreditation || '', about: uni.about || ''
      });
      setEditLogoFile(null);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedEditId) return;
    setIsUploading(true);
    let updatedData: any = { ...editData };
    if (editLogoFile) {
        const logoUrl = await uploadFile(editLogoFile, 'university-logos');
        if (logoUrl) {
            updatedData.logo_url = logoUrl;
        } else {
            setIsUploading(false);
            return;
        }
    }
    const result = await updateUniversityAction(selectedEditId, updatedData);
    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast.success(result.success);
      setSelectedEditId('');
      // No need to call fetchUniversities()
    }
    setIsUploading(false);
  };

  const handleDeleteUniversity = async () => {
    if (!selectedEditId) {
      toast.error("Please select a university to delete.");
      return;
    }
    if (window.confirm("Are you sure? This will remove the university from all courses.")) {
        const result = await deleteUniversityAction(selectedEditId);
        if (result.error) {
            toast.error(`❌ ${result.error}`);
        } else {
            toast.success(`🗑️ ${result.success}`);
            setSelectedEditId('');
            // No need to call fetchUniversities()
        }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-50 space-y-4">
      {/* The JSX below remains entirely unchanged */}
      <Collapsible title="Add New University">
        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
            <input name="name" placeholder="University Name" className="w-full border p-2 rounded" value={formData.name} onChange={handleChange} required />
            <input name="location" placeholder="Location - Enter Only City name (as the same will be displayed in Filters)" className="w-full border p-2 rounded" value={formData.location} onChange={handleChange} required />
            <input name="website" placeholder="Website URL" className="w-full border p-2 rounded" value={formData.website} onChange={handleChange} />
            <input name="package" placeholder="Average Package - with Prefix LPA (e.g., 10 LPA)" className="w-full border p-2 rounded" value={formData.package} onChange={handleChange} />
            <input name="accreditation" placeholder="Accreditation - Enter Full (e.g., NAAC A+, UGC)" className="w-full border p-2 rounded" value={formData.accreditation} onChange={handleChange} />
            <textarea name="description" placeholder="Short Description (for the card)" className="w-full border p-2 rounded" value={formData.description} onChange={handleChange} rows={3} />
            <textarea name="about" placeholder="About Section (for the details page/modal)" className="w-full border p-2 rounded" value={formData.about} onChange={handleChange} rows={6} />
            <div>
                <label className="block font-medium mb-1">University Image (for cards) prefarably campus view, under 500 kb</label>
                <input id="universityImage" type="file" accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => handleFileChange(e, 'image')}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required />
            </div>
            <div>
                <label className="block font-medium mb-1">University Logo (for carousel) preferably with white background, under 200 kb</label>
                <input id="universityLogo" type="file" accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => handleFileChange(e, 'logo')}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    required />
            </div>
            <button type="submit" disabled={isUploading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
                {isUploading ? 'Uploading...' : 'Add University'}
            </button>
        </form>
      </Collapsible>
      <Collapsible title="Edit University Details">
        <div className="space-y-3 mt-3">
          <select className="w-full border p-2 rounded bg-white" onChange={(e) => handleEditLoad(e.target.value)} value={selectedEditId}>
            <option value="">-- Select University to Edit --</option>
            {universities.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
          </select>
          {selectedEditId && (
            <>
              <input name="name" placeholder="University Name" className="w-full border p-2 rounded" value={editData.name} onChange={handleEditChange} />
              <input name="location" placeholder="Location" className="w-full border p-2 rounded" value={editData.location} onChange={handleEditChange} />
              <input name="website" placeholder="Website" className="w-full border p-2 rounded" value={editData.website} onChange={handleEditChange} />
              <input name="package" placeholder="Package" className="w-full border p-2 rounded" value={editData.package} onChange={handleEditChange} />
              <input name="accreditation" placeholder="Accreditation" className="w-full border p-2 rounded" value={editData.accreditation} onChange={handleEditChange} />
              <textarea name="description" placeholder="Short Description" className="w-full border p-2 rounded" value={editData.description} onChange={handleEditChange} />
              <textarea name="about" placeholder="About Section" className="w-full border p-2 rounded" value={editData.about} onChange={handleEditChange} />
              <div>
                  <label className="block font-medium mb-1">Update University Logo only for carousel with white background, under 200 kb</label>
                  <input type="file" accept="image/png, image/jpeg, image/jpg"
                      onChange={handleEditFileChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
              </div>
              <button onClick={handleEditSubmit} disabled={isUploading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400">
                  {isUploading ? 'Uploading...' : 'Save Changes'}
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