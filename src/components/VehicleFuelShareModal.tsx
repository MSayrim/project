import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { X, Download, Copy } from 'lucide-react';
import { FaWhatsapp, FaXTwitter, FaFacebook } from 'react-icons/fa6';
import { CheckCircle } from 'lucide-react';
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
          <h3 className="text-lg font-extrabold text-violet-700 dark:text-violet-400 text-center mb-1">{t('vehicle.share.shareWithFriends')}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{t('vehicle.share.shareEasily')}</p>
        </div>
        <div ref={slipRef} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 shadow-inner mb-4 mx-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold text-xs">PC</div>
            <h3 className="ml-2 text-violet-800 dark:text-violet-300 font-bold">ParamCebimde</h3>
            <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString('tr-TR')}</div>
          </div>
          <h2 className="text-center text-violet-600 dark:text-violet-400 font-bold text-xl mb-2 border-b border-gray-200 dark:border-gray-700 pb-2 bg-gray-100 dark:bg-gray-800/80 -mx-5 px-5 py-2">
            {slipTitle || t('vehicle.comparison.resultTitle')}
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
                <span className="absolute -left-3 -bottom-3 flex items-center gap-1 text-green-600 dark:text-green-400 font-bold z-10">
                  <svg className="rounded-full ring-2 ring-green-500 bg-white dark:bg-green-900 shadow" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
              )}
            </div>
            {/* Benzinli */}
            <div className={`relative flex-1 flex flex-col items-center rounded-xl p-4 border ${cheapest.key === 'gasoline' ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-600' : 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/30'}`}> 
              <span className="font-bold text-red-700 dark:text-red-300">{t('vehicle.comparison.gasoline')}</span>
              <span className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">{result.gasoline.cost.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</span>
              <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">{result.gasoline.total.toFixed(2)} L</span>
              {cheapest.key === 'gasoline' && (
                <span className="absolute -left-3 -bottom-3 flex items-center gap-1 text-green-600 dark:text-green-400 font-bold z-10">
                  <svg className="rounded-full ring-2 ring-green-500 bg-white dark:bg-green-900 shadow" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
              )}
            </div>
            {/* Dizel */}
            <div className={`relative flex-1 flex flex-col items-center rounded-xl p-4 border ${cheapest.key === 'diesel' ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-600' : 'border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-700'}`}> 
              <span className="font-bold text-gray-800 dark:text-gray-300">{t('vehicle.comparison.diesel')}</span>
              <span className="text-2xl font-bold mt-1 text-gray-700 dark:text-gray-300">{result.diesel.cost.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</span>
              <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">{result.diesel.total.toFixed(2)} L</span>
              {cheapest.key === 'diesel' && (
                <span className="absolute -left-3 -bottom-3 flex items-center gap-1 text-green-600 dark:text-green-400 font-bold z-10">
                  <svg className="rounded-full ring-2 ring-green-500 bg-white dark:bg-green-900 shadow" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
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
        <div className="flex flex-col items-center gap-2 pb-4">
          <div className="flex gap-2 w-full px-4">
            <button onClick={shareAsImage} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg border-2 border-white dark:border-blue-900 font-semibold justify-center flex items-center gap-2">
              <Download size={18}/> {t('vehicle.share.quickShare')}
            </button>
            <button onClick={handleDownload} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg border-2 border-white dark:border-purple-900 font-semibold justify-center flex items-center gap-2">
              <Download size={18}/> {t('vehicle.share.downloadAsImage')}
            </button>
          </div>
          <div className="flex justify-center gap-3 mt-2">
            <button onClick={shareToWhatsApp} className="rounded-lg bg-green-500 hover:bg-green-600 w-9 h-9 flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-green-900"><FaWhatsapp size={18}/></button>
            <button onClick={shareToTwitter} className="rounded-lg bg-black hover:bg-gray-800 w-9 h-9 flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-gray-900"><FaXTwitter size={18}/></button>
            <button onClick={shareToFacebook} className="rounded-lg bg-blue-600 hover:bg-blue-700 w-9 h-9 flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-blue-900"><FaFacebook size={18}/></button>
            <button onClick={copyImageToClipboard} className="rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-700 w-9 h-9 flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-900" title={t('vehicle.share.copy')}>
              <Copy size={18}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleFuelShareModal;
