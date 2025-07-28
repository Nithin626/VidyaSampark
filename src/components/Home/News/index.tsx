//src\components\Home\News\index.tsx
"use client";
import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import './NewsTicker.css'; // We will create this new CSS file

interface NewsItem {
  id: string;
  content: string;
  created_at: string;
}

const News = ({ newsItems }: { newsItems: NewsItem[] }) => {
  // To create a seamless loop, we need to duplicate the news items
  const duplicatedItems = [...newsItems, ...newsItems];

  return (
    <section id="news" className="bg-gray-100 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-midnight_text mb-6">Latest News</h2>
        <div className="bg-white rounded-lg shadow-md h-48 flex flex-col p-6 overflow-hidden">
          {newsItems.length > 0 ? (
            <div className="animate-scroll-y flex-grow">
              {duplicatedItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="py-3 flex items-start text-left border-b last:border-b-0">
                  <Icon icon="tabler:bell" className="text-primary mr-4 mt-1 flex-shrink-0 h-5 w-5" />
                  <p className="text-gray-800">{item.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
                <p className="text-lg text-gray-500">
                    Stay tuned for the latest updates!
                </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default News;
