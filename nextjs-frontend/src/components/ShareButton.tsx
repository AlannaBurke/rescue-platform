'use client';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 border border-amber-200 text-amber-700 font-semibold px-4 py-2.5 rounded-full hover:bg-amber-100 transition-colors text-sm"
    >
      <Share2 className="w-4 h-4" />
      Share
    </button>
  );
}
