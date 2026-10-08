import React, { useState } from 'react';
import { BookOpen, Film } from 'lucide-react';

interface ResilientImageProps {
  src?: string;
  alt: string;
  className?: string;
  category?: string;
  hasVideo?: boolean;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  category,
  hasVideo = false,
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#1E293B] text-white p-6 text-center select-none ${className}`}
      >
        <BookOpen className="w-8 h-8 text-blue-200/80 mb-2 shrink-0" />
        <span className="font-serif text-sm font-medium text-blue-100 line-clamp-2 max-w-xs">
          {alt || '40-MAKTAB'}
        </span>
        {category && (
          <span className="text-xs text-blue-300/80 mt-1">{category}</span>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-100">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={className}
      />
      {hasVideo && (
        <div
          className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-sm text-white px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-medium shadow-sm"
          title="Video lavha mavjud"
        >
          <Film className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Video</span>
        </div>
      )}
    </div>
  );
};
