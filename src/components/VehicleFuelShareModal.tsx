import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { X, Download, Copy, CheckCircle } from 'lucide-react';
import { FaWhatsapp, FaXTwitter, FaFacebook } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

interface VehicleFuelShareModalProps {
  open: boolean;
  onClose: () => void;
  result: any;
  slipTitle?: string;
}

const VehicleFuelShareModal: React.FC<VehicleFuelShareModalProps> = ({ open, onClose, result, slipTitle }) => {
  const { t } = useTranslation();
  const slipRef = useRef<HTMLDivElement>(null);
  if (!open) return null;

  // En ucuz yakıt tipi bul
  const cheapest = (() => {
    const arr = [
      { key: 'electricity', label: t('vehicle.comparison.electric'), color: 'bg-blue-100 text-blue-800', cost: result.electricity.cost },
      { key: 'gasoline', label: t('vehicle.comparison.gasoline'), color: 'bg-red-100 text-red-700', cost: result.gasoline.cost },
      { key: 'diesel', label: t('vehicle.comparison.diesel'), color: 'bg-gray-200 text-gray-800', cost: result.diesel.cost }
    ];
    return arr.reduce((min, curr) => curr.cost < min.cost ? curr : min, arr[0]);
  })();

  // Görsel olarak paylaşım fonksiyonu
  const shareAsImage = async () => {
    if (!slipRef.current) return;
    
    // Geçici olarak slip kartının arka planını düz renge çevirelim
    const isDark = document.documentElement.classList.contains('dark');
    const originalStyle = slipRef.current.getAttribute('style');
    slipRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
    
    const canvas = await html2canvas(slipRef.current, {
      backgroundColor: isDark ? '#181c27' : '#f6f8ff',
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    // Orijinal stili geri yükle
    if (originalStyle) {
      slipRef.current.setAttribute('style', originalStyle);
    } else {
      slipRef.current.removeAttribute('style');
    }
    
    const image = canvas.toDataURL('image/png');
    const blob = await (await fetch(image)).blob();
    const file = new File([blob], 'ParamCebimde-Yakit-Karsilastirma.png', { type: 'image/png' });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: t('vehicle.share.title') });
    } else {
      const link = document.createElement('a');
      link.href = image;
      link.download = 'ParamCebimde-Yakit-Karsilastirma.png';
      link.click();
      alert(t('vehicle.share.downloadAlert'));
    }
  };

  // Resmi panoya kopyalama fonksiyonu
  const copyImageToClipboard = async () => {
    if (!slipRef.current) return;
    try {
      // Geçici olarak slip kartının arka planını düz renge çevirelim
      const isDark = document.documentElement.classList.contains('dark');
      const originalStyle = slipRef.current.getAttribute('style');
      slipRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      
      const canvas = await html2canvas(slipRef.current, { 
        backgroundColor: isDark ? '#181c27' : '#f6f8ff', 
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      // Orijinal stili geri yükle
      if (originalStyle) {
        slipRef.current.setAttribute('style', originalStyle);
      } else {
        slipRef.current.removeAttribute('style');
      }
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            alert(t('vehicle.share.copiedToClipboard'));
          } catch (err) {
            console.error('Resim panoya kopyalanamadı:', err);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'ParamCebimde-Yakit-Karsilastirma.png';
            link.click();
            alert(t('vehicle.share.copyFailedDownloaded'));
          }
        }
      });
    } catch (error) {
      console.error('Resim oluşturulamadı:', error);
      alert(t('vehicle.share.imageCreationError'));
    }
  };

  // WhatsApp'ta paylaşım fonksiyonu
  const shareToWhatsApp = async () => {
    if (!slipRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const originalStyle = slipRef.current.getAttribute('style');
      slipRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      
      const canvas = await html2canvas(slipRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      if (originalStyle) {
        slipRef.current.setAttribute('style', originalStyle);
      } else {
        slipRef.current.removeAttribute('style');
      }
      
      const image = canvas.toDataURL('image/png');
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], 'ParamCebimde-Yakit-Karsilastirma.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: t('vehicle.share.title') });
      } else {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'ParamCebimde-Yakit-Karsilastirma.png';
        link.click();
        alert(t('vehicle.share.downloadWhatsApp'));
      }
    } catch (error) {
      console.error('Resim oluşturulamadı:', error);
      alert(t('vehicle.share.imageCreationError'));
    }
  };

  // Facebook'ta paylaşım fonksiyonu
  const shareToFacebook = async () => {
    if (!slipRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const originalStyle = slipRef.current.getAttribute('style');
      slipRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      
      const canvas = await html2canvas(slipRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      if (originalStyle) {
        slipRef.current.setAttribute('style', originalStyle);
      } else {
        slipRef.current.removeAttribute('style');
      }
      
      const image = canvas.toDataURL('image/png');
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], 'ParamCebimde-Yakit-Karsilastirma.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: t('vehicle.share.title') });
      } else {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'ParamCebimde-Yakit-Karsilastirma.png';
        link.click();
        alert(t('vehicle.share.downloadFacebook'));
      }
    } catch (error) {
      console.error('Resim oluşturulamadı:', error);
      alert(t('vehicle.share.imageCreationError'));
    }
  };

  // Twitter'da paylaşım fonksiyonu
  const shareToTwitter = async () => {
    if (!slipRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const originalStyle = slipRef.current.getAttribute('style');
      slipRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      
      const canvas = await html2canvas(slipRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      if (originalStyle) {
        slipRef.current.setAttribute('style', originalStyle);
      } else {
        slipRef.current.removeAttribute('style');
      }
      
      const image = canvas.toDataURL('image/png');
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], 'ParamCebimde-Yakit-Karsilastirma.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: t('vehicle.share.title') });
      } else {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'ParamCebimde-Yakit-Karsilastirma.png';
        link.click();
        alert(t('vehicle.share.downloadTwitter'));
      }
    } catch (error) {
      console.error('Resim oluşturulamadı:', error);
      alert(t('vehicle.share.imageCreationError'));
    }
  };

  const handleDownload = async () => {
    if (!slipRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const originalStyle = slipRef.current.getAttribute('style');
      slipRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      
      const canvas = await html2canvas(slipRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      if (originalStyle) {
        slipRef.current.setAttribute('style', originalStyle);
      } else {
        slipRef.current.removeAttribute('style');
      }
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'ParamCebimde-Yakit-Karsilastirma.png';
      link.click();
    } catch (error) {
      console.error('Resim oluşturulamadı:', error);
      alert(t('vehicle.share.imageCreationError'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-0 w-full max-w-xl relative animate-fadeInUp border-2 border-violet-200 dark:border-violet-900/30">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 rounded-lg"><X size={22} /></button>
        <div className="flex flex-col items-center pt-6">
          <h3 className="text-lg font-extrabold text-violet-700 dark:text-violet-400 text-center mb-1">{slipTitle || t('vehicle.comparison.resultTitle')}</h3>
        </div>
        <div ref={slipRef} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 shadow-inner mb-4 mx-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold text-xs">PC</div>
            <h3 className="ml-2 text-violet-800 dark:text-violet-300 font-bold">ParamCebimde</h3>
            <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString('tr-TR')}</div>
          </div>
          <h2 className="text-center text-violet-600 dark:text-violet-400 font-bold text-xl mb-2 border-b border-gray-200 dark:border-gray-700 pb-2 bg-gray-100 dark:bg-gray-800/80 -mx-5 px-5 py-2">
            {t('vehicle.comparison.resultTitle')}
          </h2>
          <div className="text-center text-gray-700 dark:text-gray-300 text-sm mb-2">{t('vehicle.comparison.totalDistance')}: <b>{result.km} km</b></div>

          {/* En uygun özet başlık */}
          <div className="mb-2 mt-2 text-base font-bold text-center text-green-700 dark:text-green-400 flex items-center justify-center gap-2">
            <CheckCircle size={22} className="text-green-600 dark:text-green-400 -ml-2"/>
            {t('vehicle.share.mostEconomical')}: <span className="capitalize">{cheapest.label}</span>
          </div>

          <div className="mt-2 mb-1 text-base font-bold text-center text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-1">{t('vehicle.share.priceComparison')}</div>
          <div className="flex flex-row gap-2 justify-center items-end mb-5">
            {/* Elektrikli */}
            <div className={`relative flex-1 flex flex-col items-center rounded-xl p-4 border ${cheapest.key === 'electricity' ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-600' : 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800/30'}`}> 
              <span className="font-bold text-blue-800 dark:text-blue-300">{t('vehicle.comparison.electric')}</span>
              <span className="text-2xl font-bold mt-1 text-blue-700 dark:text-blue-400">{result.electricity.cost.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</span>
              <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">{result.electricity.total.toFixed(2)} kWh</span>
              {cheapest.key === 'electricity' && (
                <div className="tick-marker absolute -left-3 -bottom-3 z-50">
                  <CheckCircle size={32} className="text-green-500 bg-white dark:bg-green-900 rounded-full shadow border-2 border-white dark:border-green-900" />
                </div>
              )}
            </div>
            {/* Benzinli */}
            <div className={`relative flex-1 flex flex-col items-center rounded-xl p-4 border ${cheapest.key === 'gasoline' ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-600' : 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/30'}`}> 
              <span className="font-bold text-red-700 dark:text-red-300">{t('vehicle.comparison.gasoline')}</span>
              <span className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">{result.gasoline.cost.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</span>
              <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">{result.gasoline.total.toFixed(2)} L</span>
              {cheapest.key === 'gasoline' && (
                <div className="tick-marker absolute -left-3 -bottom-3 z-50">
                  <CheckCircle size={32} className="text-green-500 bg-white dark:bg-green-900 rounded-full shadow border-2 border-white dark:border-green-900" />
                </div>
              )}
            </div>
            {/* Dizel */}
            <div className={`relative flex-1 flex flex-col items-center rounded-xl p-4 border ${cheapest.key === 'diesel' ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-600' : 'border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-700'}`}> 
              <span className="font-bold text-gray-800 dark:text-gray-300">{t('vehicle.comparison.diesel')}</span>
              <span className="text-2xl font-bold mt-1 text-gray-700 dark:text-gray-300">{result.diesel.cost.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</span>
              <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">{result.diesel.total.toFixed(2)} L</span>
              {cheapest.key === 'diesel' && (
                <div className="tick-marker absolute -left-3 -bottom-3 z-50">
                  <CheckCircle size={32} className="text-green-500 bg-white dark:bg-green-900 rounded-full shadow border-2 border-white dark:border-green-900" />
                </div>
              )}
            </div>
          </div>
          {/* Fark bilgisi */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">{t('vehicle.share.difference')}:</span>
            <div className="px-3 py-1 rounded-lg font-bold text-base bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              {(Math.max(result.electricity.cost, result.gasoline.cost, result.diesel.cost) - Math.min(result.electricity.cost, result.gasoline.cost, result.diesel.cost)).toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            {t('vehicle.share.disclaimer')}
          </div>
        </div>
        {/* Alt paylaşım butonları bloğu */}
        <div className="px-6 pb-6 pt-2">
          <button 
            onClick={handleDownload}
            className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white text-base font-medium rounded-xl shadow-lg border-2 border-violet-200 dark:border-violet-900/40 transition flex items-center justify-center gap-2"
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

export default VehicleFuelShareModal;
