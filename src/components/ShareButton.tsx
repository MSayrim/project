import React from 'react';
import { ShareService } from '../services/ShareService';
import { Capacitor } from '@capacitor/core';

interface ShareButtonProps {
  resultId: string;
  title: string;
  text: string;
  url?: string;
  className?: string;
}

/**
 * Paylaşım butonu bileşeni
 * Hesaplama sonuçlarını metin veya görsel olarak paylaşmak için kullanılır
 */
const ShareButton: React.FC<ShareButtonProps> = ({ resultId, title, text, url, className = '' }) => {
  const isMobile = Capacitor.isNativePlatform() || window.innerWidth < 768;

  const handleShare = async () => {
    if (resultId) {
      // Belirli bir element ID'si varsa, o elementi görsel olarak paylaş
      await ShareService.shareElement(resultId);
    } else {
      // Sadece metin paylaşımı
      await ShareService.shareText(title, text, url);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      aria-label="Paylaş"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
        />
      </svg>
      {isMobile ? '' : 'Paylaş'}
    </button>
  );
};

export default ShareButton;
