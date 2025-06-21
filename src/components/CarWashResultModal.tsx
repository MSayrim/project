import React, { useRef } from 'react';
import { X, Share2, Download, Copy, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { FaFacebook, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

interface CarWashResultModalProps {
  open: boolean;
  onClose: () => void;
  result: any;
  slipTitle?: string;
  selectedServices?: any[];
  paidAmount?: number;
  homemadeTotal?: number;
}

const CarWashResultModal: React.FC<CarWashResultModalProps> = ({ open, onClose, result, slipTitle, selectedServices, paidAmount, homemadeTotal }) => {
  const slipCardRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  if (!open) return null;

  // Görsel olarak paylaşım fonksiyonu
  const shareAsImage = async () => {
    if (!slipCardRef.current) return;
    const isDark = document.documentElement.classList.contains('dark');
    const originalStyle = slipCardRef.current.getAttribute('style');
    slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
    
    // Metin hizalama için geçici stiller uygula
    const dataRows = slipCardRef.current.querySelectorAll('div.py-2 > div, .flex.justify-between, .text-sm.text-gray-700, .text-gray-800.dark\:text-gray-200');
    const originalRowStyles: { paddingTop: string; paddingBottom: string; verticalAlign: string }[] = [];
    dataRows.forEach(row => {
      const htmlRow = row as HTMLElement;
      originalRowStyles.push({
        paddingTop: htmlRow.style.paddingTop,
        paddingBottom: htmlRow.style.paddingBottom,
        verticalAlign: htmlRow.style.verticalAlign,
      });
      htmlRow.style.paddingTop = '8px';
      htmlRow.style.paddingBottom = '8px';
      htmlRow.style.verticalAlign = 'middle';
    });

    // Tick işaretlerinin görünürlüğünü düzelt
    const tickMarkers = slipCardRef.current.querySelectorAll('.tick-marker');
    tickMarkers.forEach(marker => {
      (marker as HTMLElement).style.position = 'absolute';
      (marker as HTMLElement).style.left = '-12px';
      (marker as HTMLElement).style.bottom = '-12px';
      (marker as HTMLElement).style.zIndex = '50';
    });
    
    const canvas = await html2canvas(slipCardRef.current, {
      backgroundColor: isDark ? '#181c27' : '#f6f8ff',
      scale: 2.5, // Scale artırıldı
      logging: false,
      useCORS: true,
      allowTaint: true,
      scrollX: 0, // scrollX eklendi
      scrollY: 0, // scrollY eklendi
      windowWidth: slipCardRef.current.scrollWidth, // windowWidth eklendi
      windowHeight: slipCardRef.current.scrollHeight, // windowHeight eklendi
      onclone: (clonedDoc, clonedElement) => {
        // Klonlanmış dokümandaki tick işaretlerini düzelt
        const clonedTicks = clonedElement.querySelectorAll('.tick-marker');
        clonedTicks.forEach(marker => {
          (marker as HTMLElement).style.position = 'absolute';
          (marker as HTMLElement).style.left = '-12px';
          (marker as HTMLElement).style.bottom = '-12px';
          (marker as HTMLElement).style.zIndex = '50';
        });
      }
    });
    if (originalStyle) {
      slipCardRef.current.setAttribute('style', originalStyle);
    } else {
      slipCardRef.current.removeAttribute('style');
    }
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'carwash-slip.png';
    link.click();

    // Geçici stilleri geri al
    dataRows.forEach((row, index) => {
      const htmlRow = row as HTMLElement;
      htmlRow.style.paddingTop = originalRowStyles[index].paddingTop;
      htmlRow.style.paddingBottom = originalRowStyles[index].paddingBottom;
      htmlRow.style.verticalAlign = originalRowStyles[index].verticalAlign;
    });
  };

  // Panoya kopyala
  const copyImageToClipboard = async () => {
    if (!slipCardRef.current) return;
    const isDark = document.documentElement.classList.contains('dark');
    const originalStyle = slipCardRef.current.getAttribute('style');
    slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';

    // Metin hizalama için geçici stiller uygula
    const dataRows = slipCardRef.current.querySelectorAll('div.py-2 > div, .flex.justify-between, .text-sm.text-gray-700, .text-gray-800.dark\:text-gray-200');
    const originalRowStyles: { paddingTop: string; paddingBottom: string; verticalAlign: string }[] = [];
    dataRows.forEach(row => {
      const htmlRow = row as HTMLElement;
      originalRowStyles.push({
        paddingTop: htmlRow.style.paddingTop,
        paddingBottom: htmlRow.style.paddingBottom,
        verticalAlign: htmlRow.style.verticalAlign,
      });
      htmlRow.style.paddingTop = '8px';
      htmlRow.style.paddingBottom = '8px';
      htmlRow.style.verticalAlign = 'middle';
    });
    
    // Tick işaretlerinin görünürlüğünü düzelt
    const tickMarkers = slipCardRef.current.querySelectorAll('.tick-marker');
    tickMarkers.forEach(marker => {
      (marker as HTMLElement).style.position = 'absolute';
      (marker as HTMLElement).style.left = '-12px';
      (marker as HTMLElement).style.bottom = '-12px';
      (marker as HTMLElement).style.zIndex = '50';
    });
    
    const canvas = await html2canvas(slipCardRef.current, {
      backgroundColor: isDark ? '#181c27' : '#f6f8ff',
      scale: 2.5, // Scale artırıldı
      logging: false,
      useCORS: true,
      allowTaint: true,
      scrollX: 0, // scrollX eklendi
      scrollY: 0, // scrollY eklendi
      windowWidth: slipCardRef.current.scrollWidth, // windowWidth eklendi
      windowHeight: slipCardRef.current.scrollHeight, // windowHeight eklendi
      onclone: (clonedDoc, clonedElement) => {
        // Klonlanmış dokümandaki tick işaretlerini düzelt
        const clonedTicks = clonedElement.querySelectorAll('.tick-marker');
        clonedTicks.forEach(marker => {
          (marker as HTMLElement).style.position = 'absolute';
          (marker as HTMLElement).style.left = '-12px';
          (marker as HTMLElement).style.bottom = '-12px';
          (marker as HTMLElement).style.zIndex = '50';
        });
      }
    });
    if (originalStyle) {
      slipCardRef.current.setAttribute('style', originalStyle);
    } else {
      slipCardRef.current.removeAttribute('style');
    }
    canvas.toBlob(async (blob) => {
      if (blob) {
        try {
          await navigator.clipboard.write([
            new window.ClipboardItem({ 'image/png': blob })
          ]);
        } catch {}
      }
    }, 'image/png');

    // Geçici stilleri geri al
    dataRows.forEach((row, index) => {
      const htmlRow = row as HTMLElement;
      htmlRow.style.paddingTop = originalRowStyles[index].paddingTop;
      htmlRow.style.paddingBottom = originalRowStyles[index].paddingBottom;
      htmlRow.style.verticalAlign = originalRowStyles[index].verticalAlign;
    });
  };

  // WhatsApp'ta paylaşım fonksiyonu
  const shareToWhatsApp = async () => {
    if (!slipCardRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const originalStyle = slipCardRef.current.getAttribute('style');
      slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';

      // Metin hizalama için geçici stiller uygula
      const dataRows = slipCardRef.current.querySelectorAll('div.py-2 > div, .flex.justify-between, .text-sm.text-gray-700, .text-gray-800.dark\:text-gray-200');
      const originalRowStyles: { paddingTop: string; paddingBottom: string; verticalAlign: string }[] = [];
      dataRows.forEach(row => {
        const htmlRow = row as HTMLElement;
        originalRowStyles.push({
          paddingTop: htmlRow.style.paddingTop,
          paddingBottom: htmlRow.style.paddingBottom,
          verticalAlign: htmlRow.style.verticalAlign,
        });
        htmlRow.style.paddingTop = '8px';
        htmlRow.style.paddingBottom = '8px';
        htmlRow.style.verticalAlign = 'middle';
      });
      
      const canvas = await html2canvas(slipCardRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        scale: 2.5, // Scale artırıldı
        useCORS: true,
        allowTaint: true,
        scrollX: 0, // scrollX eklendi
        scrollY: 0, // scrollY eklendi
        windowWidth: slipCardRef.current.scrollWidth, // windowWidth eklendi
        windowHeight: slipCardRef.current.scrollHeight, // windowHeight eklendi
      });

      // Geçici stilleri geri al
      dataRows.forEach((row, index) => {
        const htmlRow = row as HTMLElement;
        htmlRow.style.paddingTop = originalRowStyles[index].paddingTop;
        htmlRow.style.paddingBottom = originalRowStyles[index].paddingBottom;
        htmlRow.style.verticalAlign = originalRowStyles[index].verticalAlign;
      });
      
      if (originalStyle) {
        slipCardRef.current.setAttribute('style', originalStyle);
      } else {
        slipCardRef.current.removeAttribute('style');
      }
      
      const image = canvas.toDataURL('image/png');
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], 'ParamCebimde-Hesaplama.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: t('common.calculationResult') });
      } else {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'ParamCebimde-Hesaplama.png';
        link.click();
        alert(t('share.downloadAndShareWhatsapp'));
      }
    } catch (error) {
      console.error('Resim oluşturulamadı:', error);
      alert(t('share.imageCreationError'));
    }
  };

  // Facebook'ta paylaşım fonksiyonu
  const shareToFacebook = async () => {
    if (!slipCardRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const originalStyle = slipCardRef.current.getAttribute('style');
      slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';

      // Metin hizalama için geçici stiller uygula
      const dataRows = slipCardRef.current.querySelectorAll('div.py-2 > div, .flex.justify-between, .text-sm.text-gray-700, .text-gray-800.dark\:text-gray-200');
      const originalRowStyles: { paddingTop: string; paddingBottom: string; verticalAlign: string }[] = [];
      dataRows.forEach(row => {
        const htmlRow = row as HTMLElement;
        originalRowStyles.push({
          paddingTop: htmlRow.style.paddingTop,
          paddingBottom: htmlRow.style.paddingBottom,
          verticalAlign: htmlRow.style.verticalAlign,
        });
        htmlRow.style.paddingTop = '8px';
        htmlRow.style.paddingBottom = '8px';
        htmlRow.style.verticalAlign = 'middle';
      });
      
      const canvas = await html2canvas(slipCardRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        scale: 2.5, // Scale artırıldı
        useCORS: true,
        allowTaint: true,
        scrollX: 0, // scrollX eklendi
        scrollY: 0, // scrollY eklendi
        windowWidth: slipCardRef.current.scrollWidth, // windowWidth eklendi
        windowHeight: slipCardRef.current.scrollHeight, // windowHeight eklendi
      });

      // Geçici stilleri geri al
      dataRows.forEach((row, index) => {
        const htmlRow = row as HTMLElement;
        htmlRow.style.paddingTop = originalRowStyles[index].paddingTop;
        htmlRow.style.paddingBottom = originalRowStyles[index].paddingBottom;
        htmlRow.style.verticalAlign = originalRowStyles[index].verticalAlign;
      });
      
      if (originalStyle) {
        slipCardRef.current.setAttribute('style', originalStyle);
      } else {
        slipCardRef.current.removeAttribute('style');
      }
      
      const image = canvas.toDataURL('image/png');
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], 'ParamCebimde-Hesaplama.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: t('common.calculationResult') });
      } else {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'ParamCebimde-Hesaplama.png';
        link.click();
        alert(t('share.downloadAndShareFacebook'));
      }
    } catch (error) {
      console.error('Resim oluşturulamadı:', error);
      alert(t('share.imageCreationError'));
    }
  };

  // Twitter'da paylaşım fonksiyonu
  const shareToTwitter = async () => {
    if (!slipCardRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const originalStyle = slipCardRef.current.getAttribute('style');
      slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';

      // Metin hizalama için geçici stiller uygula
      const dataRows = slipCardRef.current.querySelectorAll('div.py-2 > div, .flex.justify-between, .text-sm.text-gray-700, .text-gray-800.dark\:text-gray-200');
      const originalRowStyles: { paddingTop: string; paddingBottom: string; verticalAlign: string }[] = [];
      dataRows.forEach(row => {
        const htmlRow = row as HTMLElement;
        originalRowStyles.push({
          paddingTop: htmlRow.style.paddingTop,
          paddingBottom: htmlRow.style.paddingBottom,
          verticalAlign: htmlRow.style.verticalAlign,
        });
        htmlRow.style.paddingTop = '8px';
        htmlRow.style.paddingBottom = '8px';
        htmlRow.style.verticalAlign = 'middle';
      });
      
      const canvas = await html2canvas(slipCardRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        scale: 2.5, // Scale artırıldı
        useCORS: true,
        allowTaint: true,
        scrollX: 0, // scrollX eklendi
        scrollY: 0, // scrollY eklendi
        windowWidth: slipCardRef.current.scrollWidth, // windowWidth eklendi
        windowHeight: slipCardRef.current.scrollHeight, // windowHeight eklendi
      });

      // Geçici stilleri geri al
      dataRows.forEach((row, index) => {
        const htmlRow = row as HTMLElement;
        htmlRow.style.paddingTop = originalRowStyles[index].paddingTop;
        htmlRow.style.paddingBottom = originalRowStyles[index].paddingBottom;
        htmlRow.style.verticalAlign = originalRowStyles[index].verticalAlign;
      });
      
      if (originalStyle) {
        slipCardRef.current.setAttribute('style', originalStyle);
      } else {
        slipCardRef.current.removeAttribute('style');
      }
      
      const image = canvas.toDataURL('image/png');
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], 'ParamCebimde-Hesaplama.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: t('common.calculationResult') });
      } else {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'ParamCebimde-Hesaplama.png';
        link.click();
        alert(t('share.downloadAndShareTwitter'));
      }
    } catch (error) {
      console.error('Resim oluşturulamadı:', error);
      alert(t('share.imageCreationError'));
    }
  };

  // Resmi indirme fonksiyonu
  const downloadAsImage = async () => {
    if (!slipCardRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const originalStyle = slipCardRef.current.getAttribute('style');
      slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      
      // Metin hizalama için geçici stiller uygula
      const dataRows = slipCardRef.current.querySelectorAll('div.py-2 > div, .flex.justify-between, .text-sm.text-gray-700, .text-gray-800.dark\:text-gray-200');
      const originalRowStyles: { paddingTop: string; paddingBottom: string; verticalAlign: string }[] = [];
      dataRows.forEach(row => {
        const htmlRow = row as HTMLElement;
        originalRowStyles.push({
          paddingTop: htmlRow.style.paddingTop,
          paddingBottom: htmlRow.style.paddingBottom,
          verticalAlign: htmlRow.style.verticalAlign,
        });
        htmlRow.style.paddingTop = '8px';
        htmlRow.style.paddingBottom = '8px';
        htmlRow.style.verticalAlign = 'middle';
      });
      
      // Tick işaretlerinin görünürlüğünü düzelt
      const tickMarkers = slipCardRef.current.querySelectorAll('.tick-marker');
      tickMarkers.forEach(marker => {
        (marker as HTMLElement).style.position = 'absolute';
        (marker as HTMLElement).style.left = '-12px';
        (marker as HTMLElement).style.bottom = '-12px';
        (marker as HTMLElement).style.zIndex = '50';
      });
      
      const canvas = await html2canvas(slipCardRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        scale: 2.5, // Scale artırıldı
        useCORS: true,
        allowTaint: true,
        scrollX: 0, // scrollX eklendi
        scrollY: 0, // scrollY eklendi
        windowWidth: slipCardRef.current.scrollWidth, // windowWidth eklendi
        windowHeight: slipCardRef.current.scrollHeight, // windowHeight eklendi
        logging: false,
        onclone: (clonedDoc, clonedElement) => {
          // Klonlanmış dokümandaki tick işaretlerini düzelt
          const clonedTicks = clonedElement.querySelectorAll('.tick-marker');
          clonedTicks.forEach(marker => {
            (marker as HTMLElement).style.position = 'absolute';
            (marker as HTMLElement).style.left = '-12px';
            (marker as HTMLElement).style.bottom = '-12px';
            (marker as HTMLElement).style.zIndex = '50';
          });
        }
      });
      
      if (originalStyle) {
        slipCardRef.current.setAttribute('style', originalStyle);
      } else {
        slipCardRef.current.removeAttribute('style');
      }
      
      // Canvas'ı blob'a dönüştür
      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (!blob) {
            alert(t('share.imageCreationError', 'Resim oluşturulurken bir hata oluştu.'));
            return;
          }
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = 'ParamCebimde-Hesaplama.png';
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          }, 100);
        }, 'image/png', 1.0);
      } else {
        // Fallback for browsers that do not support toBlob
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'ParamCebimde-Hesaplama.png';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
      }

      // Geçici stilleri geri al
      dataRows.forEach((row, index) => {
        const htmlRow = row as HTMLElement;
        htmlRow.style.paddingTop = originalRowStyles[index].paddingTop;
        htmlRow.style.paddingBottom = originalRowStyles[index].paddingBottom;
        htmlRow.style.verticalAlign = originalRowStyles[index].verticalAlign;
      });
    } catch (error) {
      console.error('Resim oluşturulamadı:', error);
      alert(t('share.imageCreationError', 'Resim oluşturulurken bir hata oluştu.'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full relative border-2 border-violet-200 dark:border-violet-800">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-violet-600 dark:text-violet-400">ParamCebimde</span>
            <span className="text-xs text-gray-500">{new Date().toLocaleDateString('tr-TR')}</span>
          </div>
          <h2 className="text-center text-xl font-extrabold text-gray-800 dark:text-white">
            {t('carwash.resultTitle')}
          </h2>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="p-6 pt-4">
          <div ref={slipCardRef} style={{ background: 'inherit' }}>
            <div className="bg-gray-100 dark:bg-gray-800/80 rounded p-3 mb-3">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">{t('common.paidAmount')}:</span>
                <span className="font-bold text-green-600 dark:text-green-400">{paidAmount?.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
              </div>
              {result?.discount !== undefined && result.discount !== 0 && (
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('common.discount')}:</span>
                  <span className="text-gray-700 dark:text-gray-300">-{result.discount.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                </div>
              )}
              {result?.tax !== undefined && result.tax !== 0 && (
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('common.tax')}:</span>
                  <span className="text-gray-700 dark:text-gray-300">{result.tax.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                </div>
              )}
              {result?.commission !== undefined && result.commission !== 0 && (
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('common.commission')}:</span>
                  <span className="text-gray-700 dark:text-gray-300">{result.commission.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                </div>
              )}
            </div>
            {/* Hizmet ve Kendin Yaparsan Bölümleri */}
            <div className="flex flex-col md:flex-row gap-4 mt-3 mb-3">
              {/* Alınan Hizmetler */}
              <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-200 dark:border-gray-700">
                <span className="font-bold text-gray-700 dark:text-gray-300 block mb-2 text-sm">{t('carwash.services')}</span>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 text-xs md:text-sm space-y-1">
                  {selectedServices?.map((service, i) => (
                    <li key={i} className="flex justify-between"><span>{service.name}</span> <span className="font-semibold">{service.price?.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span></li>
                  ))}
                </ul>
              </div>
              {/* Kendin Yaparsan */}
              <div className="flex-1 bg-blue-50 dark:bg-blue-900/30 rounded-xl shadow-sm p-3 border border-blue-200 dark:border-blue-700">
                <span className="font-bold text-blue-700 dark:text-blue-200 block mb-2 text-sm">{t('carwash.diySection')}</span>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs md:text-sm text-blue-700 dark:text-blue-200">{t('common.totalCost')}</span>
                  <span className="font-bold text-blue-700 dark:text-blue-200 text-base">{homemadeTotal?.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                </div>
                {result?.waterUsed !== undefined && (
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{t('carwash.waterUsage')}</span>
                    <span className="text-gray-700 dark:text-gray-300">{result.waterUsed} {t('carwash.liter')}</span>
                  </div>
                )}
                {result?.electricityUsed !== undefined && (
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{t('carwash.electricityUsage')}</span>
                    <span className="text-gray-700 dark:text-gray-300">{result.electricityUsed} kWh</span>
                  </div>
                )}
              </div>
            </div>
            {(paidAmount !== undefined && homemadeTotal !== undefined) && (
              <div className="mt-5">
                <div className="text-center font-bold text-gray-700 dark:text-gray-200 mb-2 text-base border-b border-gray-200 dark:border-gray-700 pb-1">{t('common.priceComparison')}</div>
                <div className="flex items-center justify-center gap-6 mt-2 mb-1">
                  {/* Ödenen Tutar */}
                  <div className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-300
                    ${paidAmount < homemadeTotal
                      ? 'bg-green-50 dark:bg-green-900/50 ring-2 ring-green-500 dark:ring-green-400 border border-green-500 dark:border-green-400'
                      : 'bg-gray-50 dark:bg-gray-800'}`}>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t('common.paidAmount')}</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">{paidAmount.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                    {paidAmount < homemadeTotal && (
                      <div className="tick-marker absolute -left-3 -bottom-3 z-50">
                        <CheckCircle size={32}
                          className="text-green-500 bg-white dark:bg-green-900 rounded-full shadow border-2 border-white dark:border-green-900"/>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center z-20">
                    <span className="text-2xl font-extrabold text-gray-400 drop-shadow-sm tracking-wider select-none">VS</span>
                    <div className="h-8 w-0.5 bg-gradient-to-b from-green-300 via-gray-300 to-green-300 dark:from-green-700 dark:via-gray-700 dark:to-green-700 opacity-70"></div>
                  </div>
                  {/* Kendin Yaparsan */}
                  <div className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-300
                    ${homemadeTotal < paidAmount
                      ? 'bg-green-50 dark:bg-green-900/50 ring-2 ring-green-500 dark:ring-green-400 border border-green-500 dark:border-green-400'
                      : 'bg-gray-50 dark:bg-gray-800'}`}>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t('carwash.diySection')}</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">{homemadeTotal.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                    {homemadeTotal < paidAmount && (
                      <div className="tick-marker absolute -left-3 -bottom-3 z-50">
                        <CheckCircle size={32}
                          className="text-green-500 bg-white dark:bg-green-900 rounded-full shadow border-2 border-white dark:border-green-900"/>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t('common.difference')}:</span>
                  <div className={`px-3 py-1 rounded-lg font-bold text-base
                    ${(paidAmount - homemadeTotal) < 0
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                    {typeof (paidAmount - homemadeTotal) === 'number' ? Math.abs((paidAmount - homemadeTotal)).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}₺
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Download Button */}
        <div className="px-6 pb-6 pt-2">
          <button 
            onClick={downloadAsImage}
            className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white text-base font-medium rounded-xl shadow-lg border-2 border-violet-200 dark:border-violet-800 transition flex items-center justify-center gap-2"
          >
            <Download className="h-5 w-5" />
            {t('common.buttons.downloadAsImage')}
          </button>
          
          {/* Social Share Buttons */}
          <div className="flex justify-center gap-3 mt-4">
            <button 
              onClick={shareToWhatsApp}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-md border border-gray-200 dark:border-gray-700"
              title={t('common.buttons.shareWhatsApp')}
            >
              <FaWhatsapp className="w-6 h-6 text-green-500" />
            </button>
            <button 
              onClick={shareToTwitter}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-md border border-gray-200 dark:border-gray-700"
              title={t('common.buttons.shareTwitter')}
            >
              <FaXTwitter className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            </button>
            <button 
              onClick={shareToFacebook}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-md border border-gray-200 dark:border-gray-700"
              title={t('common.buttons.shareFacebook')}
            >
              <FaFacebook className="w-6 h-6 text-blue-500" />
            </button>
            <button 
              onClick={copyImageToClipboard}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-md border border-gray-200 dark:border-gray-700"
              title={t('common.buttons.copyToClipboard')}
            >
              <Copy className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </button>
          </div>
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
            {t('share.platformsNote', 'Bazı platformlar doğrudan resim paylaşımını desteklemeyebilir. Bu durumda, resmi indirip manuel olarak paylaşabilirsiniz.')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarWashResultModal;
