import React, { useRef } from 'react';
import { X, Share2, Download, Copy } from 'lucide-react';
import html2canvas from 'html2canvas';
import { FaFacebook, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';

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
  if (!open) return null;

  // Görsel olarak paylaşım fonksiyonu
  const shareAsImage = async () => {
    if (!slipCardRef.current) return;
    const isDark = document.documentElement.classList.contains('dark');
    const originalStyle = slipCardRef.current.getAttribute('style');
    slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
    const canvas = await html2canvas(slipCardRef.current, {
      backgroundColor: isDark ? '#181c27' : '#f6f8ff',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
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
  };

  // Panoya kopyala
  const copyImageToClipboard = async () => {
    if (!slipCardRef.current) return;
    const isDark = document.documentElement.classList.contains('dark');
    const originalStyle = slipCardRef.current.getAttribute('style');
    slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
    const canvas = await html2canvas(slipCardRef.current, {
      backgroundColor: isDark ? '#181c27' : '#f6f8ff',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
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
  };

  // WhatsApp'ta paylaşım fonksiyonu
  const shareToWhatsApp = async () => {
    if (!slipCardRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const originalStyle = slipCardRef.current.getAttribute('style');
      slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      
      const canvas = await html2canvas(slipCardRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        scale: 2,
        useCORS: true,
        allowTaint: true
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
        await navigator.share({ files: [file], title: 'ParamCebimde Hesaplama Sonucu' });
      } else {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'ParamCebimde-Hesaplama.png';
        link.click();
        alert('Resim indirildi. Lütfen indirilen resmi WhatsApp\'ta paylaşın.');
      }
    } catch (error) {
      console.error('Resim oluşturulamadı:', error);
      alert('Resim oluşturulurken bir hata oluştu.');
    }
  };

  // Facebook'ta paylaşım fonksiyonu
  const shareToFacebook = async () => {
    if (!slipCardRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const originalStyle = slipCardRef.current.getAttribute('style');
      slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      
      const canvas = await html2canvas(slipCardRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        scale: 2,
        useCORS: true,
        allowTaint: true
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
        await navigator.share({ files: [file], title: 'ParamCebimde Hesaplama Sonucu' });
      } else {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'ParamCebimde-Hesaplama.png';
        link.click();
        alert('Resim indirildi. Lütfen indirilen resmi Facebook\'ta paylaşın.');
      }
    } catch (error) {
      console.error('Resim oluşturulamadı:', error);
      alert('Resim oluşturulurken bir hata oluştu.');
    }
  };

  // Twitter'da paylaşım fonksiyonu
  const shareToTwitter = async () => {
    if (!slipCardRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const originalStyle = slipCardRef.current.getAttribute('style');
      slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      
      const canvas = await html2canvas(slipCardRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        scale: 2,
        useCORS: true,
        allowTaint: true
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
        await navigator.share({ files: [file], title: 'ParamCebimde Hesaplama Sonucu' });
      } else {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'ParamCebimde-Hesaplama.png';
        link.click();
        alert('Resim indirildi. Lütfen indirilen resmi X\'te paylaşın.');
      }
    } catch (error) {
      console.error('Resim oluşturulamadı:', error);
      alert('Resim oluşturulurken bir hata oluştu.');
    }
  };

  // Resim olarak indirme fonksiyonu
  const downloadAsImage = async () => {
    if (!slipCardRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const originalStyle = slipCardRef.current.getAttribute('style');
      slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      
      const canvas = await html2canvas(slipCardRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      if (originalStyle) {
        slipCardRef.current.setAttribute('style', originalStyle);
      } else {
        slipCardRef.current.removeAttribute('style');
      }
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'ParamCebimde-Hesaplama.png';
      link.click();
    } catch (error) {
      console.error('Resim oluşturulamadı:', error);
      alert('Resim oluşturulurken bir hata oluştu.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-0 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
          <X size={24}/>
        </button>
        <div className="flex flex-col items-center pt-6 pb-2 px-5">
          <div className="w-full" ref={slipCardRef} style={{ background: 'inherit' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-bold text-indigo-600">ParamCebimde</span>
              <span className="text-xs text-gray-400">{new Date().toLocaleDateString('tr-TR')}</span>
            </div>
            <h2 className="text-center text-lg font-bold text-gray-800 dark:text-white mb-2">Araç Yıkama Sonucu</h2>
            <div className="bg-gray-100 dark:bg-gray-800/80 rounded p-3 mb-3">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">Ödenen Tutar:</span>
                <span className="font-bold text-green-600 dark:text-green-400">{paidAmount?.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
              </div>
              {result?.discount !== undefined && (
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">İndirim:</span>
                  <span className="text-gray-700 dark:text-gray-300">-{result.discount.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                </div>
              )}
              {result?.tax !== undefined && (
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">KDV:</span>
                  <span className="text-gray-700 dark:text-gray-300">{result.tax.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                </div>
              )}
              {result?.commission !== undefined && (
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Komisyon:</span>
                  <span className="text-gray-700 dark:text-gray-300">{result.commission.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                </div>
              )}
            </div>
            {/* Hizmet ve Kendin Yaparsan Bölümleri */}
            <div className="flex flex-col md:flex-row gap-4 mt-3 mb-3">
              {/* Alınan Hizmetler */}
              <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-200 dark:border-gray-700">
                <span className="font-bold text-gray-700 dark:text-gray-300 block mb-2 text-sm">Alınan Hizmetler</span>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 text-xs md:text-sm space-y-1">
                  {selectedServices?.map((service, i) => (
                    <li key={i} className="flex justify-between"><span>{service.name}</span> <span className="font-semibold">{service.price?.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span></li>
                  ))}
                </ul>
              </div>
              {/* Kendin Yaparsan */}
              <div className="flex-1 bg-blue-50 dark:bg-blue-900/30 rounded-xl shadow-sm p-3 border border-blue-200 dark:border-blue-700">
                <span className="font-bold text-blue-700 dark:text-blue-200 block mb-2 text-sm">Kendin Yaparsan</span>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs md:text-sm text-blue-700 dark:text-blue-200">Toplam Maliyet</span>
                  <span className="font-bold text-blue-700 dark:text-blue-200 text-base">{homemadeTotal?.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                </div>
                {result?.waterUsed !== undefined && (
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Su Tüketimi</span>
                    <span className="text-gray-700 dark:text-gray-300">{result.waterUsed} Litre</span>
                  </div>
                )}
                {result?.electricityUsed !== undefined && (
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Elektrik Tüketimi</span>
                    <span className="text-gray-700 dark:text-gray-300">{result.electricityUsed} kWh</span>
                  </div>
                )}
              </div>
            </div>
            {(paidAmount !== undefined && homemadeTotal !== undefined) && (
              <div className="mt-5">
                <div className="text-center font-bold text-gray-700 dark:text-gray-200 mb-2 text-base border-b border-gray-200 dark:border-gray-700 pb-1">Fiyat Karşılaştırması</div>
                <div className="flex items-center justify-center gap-6 mt-2 mb-1">
                  {/* Ödenen Tutar */}
                  <div className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-300
                    ${paidAmount < homemadeTotal
                      ? 'bg-green-50 dark:bg-green-900/50 ring-2 ring-green-500 dark:ring-green-400 border border-green-500 dark:border-green-400'
                      : 'bg-gray-50 dark:bg-gray-800'}`}>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Ödenen Tutar</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">{paidAmount.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                    {paidAmount < homemadeTotal && (
                      <span className="absolute -left-3 -bottom-3">
                        <svg className="rounded-full ring-2 ring-green-500 bg-white dark:bg-green-900 shadow" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                      </span>
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
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Kendin Yaparsan</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">{homemadeTotal.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                    {homemadeTotal < paidAmount && (
                      <span className="absolute -left-3 -bottom-3">
                        <svg className="rounded-full ring-2 ring-green-500 bg-white dark:bg-green-900 shadow" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Fark:</span>
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
          <div className="flex flex-col gap-2 w-full mt-4">
            <div className="flex gap-2 w-full">
              <button onClick={shareAsImage} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 shadow-lg border-2 border-white dark:border-blue-900">
                <Share2 size={18}/> Hızlı Paylaş
              </button>
              <button onClick={downloadAsImage} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 shadow-lg border-2 border-white dark:border-purple-900">
                <Download size={18}/> Resim Olarak İndir
              </button>
            </div>
            <div className="flex gap-3 justify-center w-full mt-2">
              <button onClick={shareToWhatsApp} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg flex items-center justify-center text-xl shadow-lg border-2 border-white dark:border-green-900" title="WhatsApp'ta paylaş">
                <FaWhatsapp/>
              </button>
              <button onClick={shareToFacebook} className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-lg flex items-center justify-center text-xl shadow-lg border-2 border-white dark:border-blue-900" title="Facebook'ta paylaş">
                <FaFacebook/>
              </button>
              <button onClick={shareToTwitter} className="bg-black hover:bg-gray-800 text-white p-2 rounded-lg flex items-center justify-center text-xl shadow-lg border-2 border-white dark:border-gray-900" title="X'te paylaş">
                <FaXTwitter/>
              </button>
              <button onClick={copyImageToClipboard} className="bg-gray-300 hover:bg-gray-400 text-gray-700 p-2 rounded-lg flex items-center justify-center text-xl shadow-lg border-2 border-white dark:border-gray-900" title="Kopyala">
                <Copy size={20}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarWashResultModal;
