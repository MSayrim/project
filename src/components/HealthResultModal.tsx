import React, { useRef } from 'react';
import { X, Download, Share2, CheckCircle, Copy } from 'lucide-react';
import { FaWhatsapp, FaXTwitter, FaFacebook } from 'react-icons/fa6';
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';

interface HealthResultModalProps {
  open: boolean;
  onClose: () => void;
  bmi: number;
  height: number;
  weight: number;
  resultText: string;
  suggestion?: string;
}

const BMI_ACTIONS = [
  {
    key: 'lose',
    label: 'Kilo Ver',
    color: 'bg-red-100 dark:bg-red-900/30',
    border: 'ring-2 ring-red-400 dark:ring-red-600',
    description: 'Kilo vermeniz önerilir.',
    icon: <CheckCircle className="text-green-500 bg-white rounded-full border-2 border-white shadow absolute -left-3 -bottom-3 z-50" size={28} />,
  },
  {
    key: 'maintain',
    label: 'Kilonu Koru',
    color: 'bg-green-100 dark:bg-green-900/30',
    border: 'ring-2 ring-green-400 dark:ring-green-600',
    description: 'Kilonuzu koruyabilirsiniz.',
    icon: <CheckCircle className="text-green-500 bg-white rounded-full border-2 border-white shadow absolute -left-3 -bottom-3 z-50" size={28} />,
  },
  {
    key: 'gain',
    label: 'Kilo Al',
    color: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'ring-2 ring-blue-400 dark:ring-blue-600',
    description: 'Kilo almanız önerilir.',
    icon: <CheckCircle className="text-green-500 bg-white rounded-full border-2 border-white shadow absolute -left-3 -bottom-3 z-50" size={28} />,
  },
];

function getBmiActionKey(bmi: number) {
  if (bmi < 18.5) return 'gain';
  if (bmi < 25) return 'maintain';
  return 'lose';
}

const HealthResultModal: React.FC<HealthResultModalProps> = ({ open, onClose, bmi, height, weight, resultText, suggestion }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const downloadAsImage = async () => {
    if (!cardRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      cardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        useCORS: true,
        scale: 2,
        allowTaint: true
      });
      
      // Restore original background
      cardRef.current.style.background = '';
      
      canvas.toBlob((blob) => {
        if (!blob) return alert(t('common.errors.imageCreationFailed'));
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'ParamCebimde-BMI.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 'image/png', 1.0);
    } catch (e) {
      alert(t('common.errors.downloadFailed'));
    }
  };

  const shareToWhatsApp = async () => {
    if (!cardRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      cardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        useCORS: true,
        scale: 2,
        allowTaint: true
      });
      
      // Restore original background
      cardRef.current.style.background = '';
      
      const image = canvas.toDataURL('image/png');
      
      // Try to use Web Share API if available
      if (navigator.share) {
        try {
          const blob = await (await fetch(image)).blob();
          const file = new File([blob], 'ParamCebimde-BMI.png', { type: 'image/png' });
          await navigator.share({
            title: t('share.title.bmi'),
            text: t('share.text.bmi'),
            files: [file]
          });
          return;
        } catch (error) {
          console.error('Error sharing:', error);
        }
      }
      
      // Fallback for WhatsApp
      const encodedImage = encodeURIComponent(image);
      window.open(`https://wa.me/?text=${t('share.text.bmi')}%20${encodedImage}`);
    } catch (error) {
      console.error('Error generating image:', error);
      alert(t('common.errors.shareFailed'));
    }
  };

  const shareToTwitter = async () => {
    if (!cardRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      cardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        useCORS: true,
        scale: 2,
        allowTaint: true
      });
      
      // Restore original background
      cardRef.current.style.background = '';
      
      const image = canvas.toDataURL('image/png');
      const text = encodeURIComponent(t('share.text.bmi'));
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(image)}`);
    } catch (error) {
      console.error('Error generating image:', error);
      alert(t('common.errors.shareFailed'));
    }
  };

  const shareToFacebook = async () => {
    if (!cardRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      cardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        useCORS: true,
        scale: 2,
        allowTaint: true
      });
      
      // Restore original background
      cardRef.current.style.background = '';
      
      const image = canvas.toDataURL('image/png');
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(image)}`);
    } catch (error) {
      console.error('Error generating image:', error);
      alert(t('common.errors.shareFailed'));
    }
  };

  const copyToClipboard = async () => {
    if (!cardRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      cardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        useCORS: true,
        scale: 2,
        allowTaint: true
      });
      
      // Restore original background
      cardRef.current.style.background = '';
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert(t('common.errors.imageCreationFailed'));
          return;
        }
        
        try {
          const clipboardItem = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([clipboardItem]);
          alert(t('common.success.imageCopied'));
        } catch (error) {
          console.error('Error copying to clipboard:', error);
          alert(t('common.errors.copyFailed'));
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error generating image:', error);
      alert(t('common.errors.copyFailed'));
    }
  };

  const quickShare = async () => {
    if (!cardRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      cardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        useCORS: true,
        scale: 2,
        allowTaint: true
      });
      
      // Restore original background
      cardRef.current.style.background = '';
      
      const image = canvas.toDataURL('image/png');
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], 'ParamCebimde-BMI.png', { type: 'image/png' });
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: t('share.title.bmi'),
            text: t('share.text.bmi'),
            files: [file]
          });
          return;
        } catch (error) {
          console.error('Error sharing:', error);
          // Fall back to download if sharing fails
          downloadAsImage();
        }
      } else {
        // If Web Share API is not available, fall back to download
        downloadAsImage();
        alert(t('common.info.downloadedInstead'));
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert(t('common.errors.shareFailed'));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-0">
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-[calc(100%-2rem)] sm:w-full max-w-md relative border-2 border-violet-200 dark:border-violet-800 overflow-y-auto max-h-[85vh]"
        ref={cardRef}
      >
        <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="flex flex-col items-center gap-2 mb-4">
          <span className="text-lg font-bold text-violet-700 dark:text-violet-300">health.paramcebimde</span>
          <span className="text-xs text-gray-400">{new Date().toLocaleDateString('tr-TR')}</span>
        </div>
        <h2 className="text-2xl font-bold text-center text-violet-600 dark:text-violet-400 mb-2">BMI Hesaplama</h2>
        <div className="flex flex-col items-center gap-1 mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">Boy: <b>{height} cm</b></span>
          <span className="text-sm text-gray-600 dark:text-gray-300">Kilo: <b>{weight} kg</b></span>
        </div>
        <div className="flex flex-col items-center bg-violet-50 dark:bg-violet-900/30 rounded-lg p-4 mb-4">
          <span className="text-base font-medium text-gray-700 dark:text-gray-200">BMI:</span>
          <span className="text-3xl font-bold text-violet-600 dark:text-violet-300">{bmi.toFixed(2)}</span>
          <span className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">{resultText}</span>
        </div>
        {/* 3 seçenekli öneri kutuları */}
        <div className="w-full max-w-lg mx-auto mt-2 mb-4">
          <div className="flex items-center justify-center gap-2">
            {/* Lose Weight */}
            <div className={`relative flex flex-col items-center p-3 rounded-lg transition-all duration-300 w-1/3 ${getBmiActionKey(bmi)==='lose' ? 'bg-green-50 dark:bg-green-900/50 ring-2 ring-green-500 dark:ring-green-400' : 'bg-gray-50 dark:bg-gray-800'}`}>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Kilo Ver</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">{bmi > 24.9 ? 'Önerilir' : '-'}</span>
              {getBmiActionKey(bmi)==='lose' && (
                <div className="tick-marker absolute -left-3 -bottom-3 z-50">
                  <CheckCircle size={32} className="text-green-500 bg-white dark:bg-green-900 rounded-full shadow border-2 border-white dark:border-green-900" />
                </div>
              )}
            </div>
            {/* VS ve çizgi */}
            <div className="flex flex-col items-center z-20 mx-1">
              <span className="text-xs font-bold text-gray-400 select-none">VS</span>
              <div className="h-8 w-0.5 bg-gradient-to-b from-green-300 via-gray-300 to-green-300 dark:from-green-700 dark:via-gray-700 dark:to-green-700 opacity-70"></div>
            </div>
            {/* Maintain Weight */}
            <div className={`relative flex flex-col items-center p-3 rounded-lg transition-all duration-300 w-1/3 ${getBmiActionKey(bmi)==='maintain' ? 'bg-green-50 dark:bg-green-900/50 ring-2 ring-green-500 dark:ring-green-400' : 'bg-gray-50 dark:bg-gray-800'}`}>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Kilonu Koru</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">{bmi >= 18.5 && bmi < 25 ? 'Önerilir' : '-'}</span>
              {getBmiActionKey(bmi)==='maintain' && (
                <div className="tick-marker absolute -left-3 -bottom-3 z-50">
                  <CheckCircle size={32} className="text-green-500 bg-white dark:bg-green-900 rounded-full shadow border-2 border-white dark:border-green-900" />
                </div>
              )}
            </div>
            {/* VS ve çizgi */}
            <div className="flex flex-col items-center z-20 mx-1">
              <span className="text-xs font-bold text-gray-400 select-none">VS</span>
              <div className="h-8 w-0.5 bg-gradient-to-b from-green-300 via-gray-300 to-green-300 dark:from-green-700 dark:via-gray-700 dark:to-green-700 opacity-70"></div>
            </div>
            {/* Gain Weight */}
            <div className={`relative flex flex-col items-center p-3 rounded-lg transition-all duration-300 w-1/3 ${getBmiActionKey(bmi)==='gain' ? 'bg-green-50 dark:bg-green-900/50 ring-2 ring-green-500 dark:ring-green-400' : 'bg-gray-50 dark:bg-gray-800'}`}>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Kilo Al</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">{bmi < 18.5 ? 'Önerilir' : '-'}</span>
              {getBmiActionKey(bmi)==='gain' && (
                <div className="tick-marker absolute -left-3 -bottom-3 z-50">
                  <CheckCircle size={32} className="text-green-500 bg-white dark:bg-green-900 rounded-full shadow border-2 border-white dark:border-green-900" />
                </div>
              )}
            </div>
          </div>
        </div>
        {suggestion && (
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 text-green-700 dark:text-green-300 text-sm mb-4">
            {suggestion}
          </div>
        )}
        {/* Standardized social media sharing and download UI */}
        <div className="flex flex-col gap-3 w-full mt-2 mb-2">
          {/* Primary download button - full width */}
          <button 
            onClick={downloadAsImage}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-md border border-violet-500 transition-all duration-200"
          >
            <Download size={20} />
            {t('common.buttons.downloadAsImage')}
          </button>
          
          {/* Social media share buttons in a row */}
          <div className="flex justify-center gap-3 mt-1">
            <button 
              onClick={shareToWhatsApp}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#1DA851] text-white shadow-md border border-[#20BD5F] hover:shadow-lg transition-all duration-200"
              title={t('common.buttons.shareWhatsApp')}
              aria-label={t('common.buttons.shareWhatsApp')}
            >
              <FaWhatsapp size={22} />
            </button>
            
            <button 
              onClick={shareToTwitter}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-black hover:bg-gray-800 text-white shadow-md border border-gray-700 hover:shadow-lg transition-all duration-200"
              title={t('common.buttons.shareTwitter')}
              aria-label={t('common.buttons.shareTwitter')}
            >
              <FaXTwitter size={20} />
            </button>
            
            <button 
              onClick={shareToFacebook}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white shadow-md border border-[#166FE5] hover:shadow-lg transition-all duration-200"
              title={t('common.buttons.shareFacebook')}
              aria-label={t('common.buttons.shareFacebook')}
            >
              <FaFacebook size={22} />
            </button>
            
            <button 
              onClick={copyToClipboard}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md border border-gray-300 hover:shadow-lg transition-all duration-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:border-gray-600"
              title={t('common.buttons.copyToClipboard')}
              aria-label={t('common.buttons.copyToClipboard')}
            >
              <Copy size={20} />
            </button>
          </div>
          
          <div className="text-xs text-center text-gray-400 mt-1">
            {t('share.platformsNote', 'Bazı platformlar doğrudan resim paylaşımını desteklemeyebilir. Bu durumda, resmi indirip manuel olarak paylaşabilirsiniz.')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthResultModal;
