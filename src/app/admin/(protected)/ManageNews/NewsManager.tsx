//src\app\admin\(protected)\ManageNews\NewsManager.tsx
"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
// We no longer need the supabase client here
import { createNewsAction, updateNewsAction, deleteNewsAction } from '../../actions';
import { Icon } from '@iconify/react/dist/iconify.js';
import { type NewsItem } from './page'; // Import the type from the page

// The component now receives the news list as a prop
export default function NewsManager({ initialNews }: { initialNews: NewsItem[] }) {
  const [newContent, setNewContent] = useState('');
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [editContent, setEditContent] = useState('');

  // No more useEffect or fetchNews needed. Revalidation in your actions handles all updates.

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createNewsAction(newContent);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success!);
      setNewContent('');
    }
  };

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    
    const result = await updateNewsAction(editingItem.id, editContent);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success!);
      setEditingItem(null);
      setEditContent('');
    }
  };

  const handleDeleteNews = async (newsId: string) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      const result = await deleteNewsAction(newsId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success!);
      }
    }
  };

  const startEditing = (item: NewsItem) => {
    setEditingItem(item);
    setEditContent(item.content);
  };

  return (
    <div className="space-y-8">
      {/* Form for adding or editing news (no change here) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit News Item' : 'Add New News Item'}</h2>
        <form onSubmit={editingItem ? handleUpdateNews : handleAddNews} className="space-y-4">
          <textarea
            value={editingItem ? editContent : newContent}
            onChange={(e) => editingItem ? setEditContent(e.target.value) : setNewContent(e.target.value)}
            placeholder="Enter news content here..."
            className="w-full p-2 border rounded-md"
            rows={3}
            required
          />
          <div className="flex gap-4">
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
              {editingItem ? 'Update News' : 'Add News'}
            </button>
            {editingItem && (
              <button type="button" onClick={() => setEditingItem(null)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List of existing news items now uses the prop */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Existing News</h2>
        <div className="space-y-3">
            {initialNews.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <p className="text-gray-800">{item.content}</p>
                <div className="flex gap-3 flex-shrink-0">
                  <button onClick={() => startEditing(item)} className="p-1 text-blue-600 hover:text-blue-800" aria-label="Edit">
                      <Icon icon="tabler:edit" className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDeleteNews(item.id)} className="p-1 text-red-600 hover:text-red-800" aria-label="Delete">
                      <Icon icon="tabler:trash" className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}