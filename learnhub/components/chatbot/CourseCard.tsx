'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface CourseCardProps {
  id?: string;
  title: string;
  thumbnailUrl: string;
  slug: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, thumbnailUrl, slug }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group max-w-[280px]">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
      </div>
      
      <div className="p-3 space-y-2">
        <h3 className="text-[12px] font-bold text-gray-800 line-clamp-2 leading-tight">{title}</h3>
        <Link 
          href={`/courses/${slug}`}
          className="w-full py-1.5 bg-purple-600 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-purple-700 transition-colors"
        >
          Go to course <ExternalLink size={10} />
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
