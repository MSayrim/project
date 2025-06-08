import React, { useRef, useState } from 'react';
import { X, Share2, Copy, Users, Download, CheckCircle } from 'lucide-react';
import { FaWhatsapp, FaXTwitter, FaFacebook } from 'react-icons/fa6';
import html2canvas from 'html2canvas';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { useTranslation } from 'react-i18next';

interface CalculationResultModalProps {
  open: boolean;
  onClose: () => void;
  result: any;
  slipTitle?: string;
  homemadeTotal?: number;
  selectedRecipes?: any[];
  quantities?: Record<string, number>;
  paidAmount?: number;
}

// Görsel olarak paylaşım fonksiyonu
const shareAsImage = async (cardRef: React.RefObject<HTMLDivElement>, isDark = false) => {
  if (!cardRef.current) return;
  
  try {
    // Geçici olarak slip kartının arka planını düz renge çevirelim
    const originalStyle = cardRef.current.getAttribute('style');
    cardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
    
    // Tick işaretlerinin görünürlüğünü düzelt
    const tickMarkers = cardRef.current.querySelectorAll('.tick-marker');
    tickMarkers.forEach(marker => {
      (marker as HTMLElement).style.position = 'absolute';
      (marker as HTMLElement).style.left = '-12px';
      (marker as HTMLElement).style.bottom = '-12px';
      (marker as HTMLElement).style.zIndex = '50';
    });
    
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: isDark ? '#181c27' : '#f6f8ff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
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
    
    // Orijinal stili geri yükle
    if (originalStyle) {
      cardRef.current.setAttribute('style', originalStyle);
    } else {
      cardRef.current.removeAttribute('style');
    }
    
    const image = canvas.toDataURL('image/png');
    const blob = await (await fetch(image)).blob();
    
    // Mobil uygulamada Capacitor Share ile paylaş
    if (Capacitor.isNativePlatform()) {
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          await Share.share({
            title: t('app.brand') + ' Hesaplama Sonucu',
            text: 'Hesaplama sonucunu sen de paylaş!',
            url: base64data,
            dialogTitle: 'Uygulamada paylaş'
          });
        };
        reader.readAsDataURL(blob);
        return;
      } catch (e) {
        console.error('Capacitor Share hatası:', e);
        // Fallback - indirme
      }
    }

    // Web'de navigator.share varsa kullan
    try {
      const file = new File([blob], t('app.brand') + '-Hesaplama.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: t('app.brand') + ' Hesaplama Sonucu' });
        return;
      }
    } catch (e) {
      console.error('Web Share API hatası:', e);
    }
    
    // Son çare: indir
    const link = document.createElement('a');
    link.href = image;
    link.download = t('app.brand') + '-Hesaplama.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('indirme işlemi başlatıldı (dataURL)');
  } catch (error) {
    console.error('Resim oluşturulurken bir hata oluştu:', error);
    alert('Resim oluşturulurken bir hata oluştu.');
  }
};

// Resmi panoya kopyalama fonksiyonu
const copyImageToClipboard = async (cardRef: React.RefObject<HTMLDivElement>, isDark = false) => {
  if (!cardRef.current) return;
  try {
    // Geçici olarak slip kartının arka planını düz renge çevirelim
    const originalStyle = cardRef.current.getAttribute('style');
    cardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
    
    // Tick işaretlerinin görünürlüğünü düzelt
    const tickMarkers = cardRef.current.querySelectorAll('.tick-marker');
    tickMarkers.forEach(marker => {
      (marker as HTMLElement).style.position = 'absolute';
      (marker as HTMLElement).style.left = '-12px';
      (marker as HTMLElement).style.bottom = '-12px';
      (marker as HTMLElement).style.zIndex = '50';
    });
    
    const canvas = await html2canvas(cardRef.current, { 
      backgroundColor: isDark ? '#181c27' : '#f6f8ff', 
      scale: 2,
      useCORS: true,
      allowTaint: true,
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
    
    // Orijinal stili geri yükle
    if (originalStyle) {
      cardRef.current.setAttribute('style', originalStyle);
    } else {
      cardRef.current.removeAttribute('style');
    }
    
    canvas.toBlob(async (blob) => {
      if (blob) {
        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          alert('Resim panoya kopyalandı!');
        } catch (err) {
          console.error('Resim panoya kopyalanamadı:', err);
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = t('app.brand') + '-Hesaplama.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          alert('Resim panoya kopyalanamadı, bunun yerine indirildi.');
        }
      }
    });
  } catch (error) {
    console.error('Resim oluşturulamadı:', error);
    alert('Resim oluşturulurken bir hata oluştu.');
  }
};

// Slip metni oluşturucu
function formatFoodSlip(result: any, slipTitle?: string, homemadeTotal?: number, selectedRecipes?: any[], quantities?: Record<string, number> = {}, paidAmount?: number) {
  if (!result) return '';
  const lines = [];
  lines.push('------------------------');
  if (result && typeof result.netTotal === 'number') lines.push(`Ödenen Tutar: ${result.netTotal.toLocaleString('tr-TR')}₺`);
  else if (typeof paidAmount === 'number') lines.push(`Ödenen Tutar: ${paidAmount.toLocaleString('tr-TR')}₺`);
  if (typeof homemadeTotal === 'number') lines.push(`Evde Yapım Maliyeti: ${homemadeTotal.toLocaleString('tr-TR')}₺`);
  if (selectedRecipes && selectedRecipes.length > 0) {
    lines.push('Seçilen Ürünler:');
    selectedRecipes.forEach(item => {
      const q = quantities[item.nameTR || item.nameEN] || 0;
      lines.push(`- ${item.nameTR || item.nameEN} x${q} = ${(item.priceTL * q).toLocaleString('tr-TR')}₺`);
    });
  }
  lines.push('------------------------');
  if (result.discount !== undefined && result.discount > 0) lines.push(`İndirim: -${result.discount.toLocaleString('tr-TR')}₺`);
  if (result.tax !== undefined) lines.push(`Vergi: ${result.tax.toLocaleString('tr-TR')}₺`);
  if (result.communicationCommission !== undefined) lines.push(`Komisyon: ${result.communicationCommission.toLocaleString('tr-TR')}₺`);
  if (result.profit !== undefined) lines.push(`Restoran Kârı: ${result.profit.toLocaleString('tr-TR')}₺`);
  if (result.firm && typeof result.firm === 'object' && result.firm.name) lines.push(`Firma: ${result.firm.name}`);
  if (result.joker) lines.push('Joker kullanıldı');
  lines.push('------------------------');
  lines.push(`Tarih: ${new Date().toLocaleString('tr-TR')}`);
  return lines.join('\n');
}

// Sağlık hesaplama slip metni oluşturucu
function formatHealthSlip(result: any, slipTitle?: string) {
  if (!result) return '';
  const lines = [];
  lines.push(slipTitle || 'Sağlık Hesaplama Sonucu');
  lines.push('------------------------');
  
  // BMI sonucu
  if (result.bmi !== undefined) {
    lines.push(`Vücut Kitle İndeksi (BMI): ${result.bmi}`);
    if (result.bmiCategory) lines.push(`Kategori: ${result.bmiCategory}`);
  }
  
  // Vücut yağ oranı sonucu
  if (result.bodyFatPercentage !== undefined) {
    lines.push(`Vücut Yağ Oranı: %${result.bodyFatPercentage}`);
    if (result.bodyFatCategory) lines.push(`Kategori: ${result.bodyFatCategory}`);
    lines.push('(ABD Donanması formülü kullanılarak hesaplanmıştır)');
  }
  
  // Kalori hesaplama sonucu
  if (result.calories !== undefined) {
    lines.push(`Günlük Kalori İhtiyacı: ${result.calories} kcal`);
    if (result.caloriesForLoss) lines.push(`Kilo Vermek İçin: ${result.caloriesForLoss} kcal`);
    if (result.caloriesForGain) lines.push(`Kilo Almak İçin: ${result.caloriesForGain} kcal`);
  }
  
  lines.push('------------------------');
  lines.push('Bu hesaplamalar yaklaşık değerlerdir ve sadece bilgi amaçlıdır.');
  lines.push('Sağlık durumunuzla ilgili kararlar için bir sağlık uzmanına danışın.');
  lines.push('------------------------');
  lines.push(`Tarih: ${new Date().toLocaleString('tr-TR')}`);
  return lines.join('\n');
}

const CalculationResultModal: React.FC<CalculationResultModalProps> = ({ open, onClose, result, slipTitle, homemadeTotal, selectedRecipes, quantities, paidAmount }) => {
  if (!open) return null;
  
  const { t } = useTranslation('translation'); // Explicitly use 'translation' namespace
  const slipCardRef = useRef<HTMLDivElement>(null);
  const isHealthCalculation = result?.type === 'health' || result?.type === 'bmi' || result?.type === 'calorie';
  const isCalorieCalculation = result?.type === 'calorie'; // Assuming this is present
  const translationPrefix = isHealthCalculation ? 'health' : 'food';
  const [isCopied, setIsCopied] = useState(false);

  // Slip metnini oluştur (sağlık hesaplaması mı yoksa yemek hesaplaması mı olduğunu kontrol et)
  const slipText = isHealthCalculation 
    ? formatHealthSlip(result, slipTitle)
    : formatFoodSlip(result, slipTitle, homemadeTotal, selectedRecipes, quantities, paidAmount);

  // Resmi indirme fonksiyonu
  const downloadAsImage = async () => {
    console.log('downloadAsImage çağrıldı');
    if (slipCardRef.current) {
      console.log('slipCardRef.current:', slipCardRef.current);
      try {
        const isDark = document.documentElement.classList.contains('dark');
        const originalStyle = slipCardRef.current.getAttribute('style');
        slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
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
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          onclone: (clonedDoc, clonedElement) => {
            const clonedTicks = clonedElement.querySelectorAll('.tick-marker');
            clonedTicks.forEach(marker => {
              (marker as HTMLElement).style.position = 'absolute';
              (marker as HTMLElement).style.left = '-12px';
              (marker as HTMLElement).style.bottom = '-12px';
              (marker as HTMLElement).style.zIndex = '50';
            });
          }
        });
        console.log('canvas:', canvas);
        if (originalStyle) {
          slipCardRef.current.setAttribute('style', originalStyle);
        } else {
          slipCardRef.current.removeAttribute('style');
        }
        // Canvas'ı blob'a dönüştür
        if (canvas.toBlob) {
          canvas.toBlob((blob) => {
            if (!blob) {
              alert(t('health.image_error', 'Resim oluşturulurken bir hata oluştu.'));
              return;
            }
            console.log('blob:', blob);
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = t('app.brand') + '-Hesaplama.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          }, 'image/png', 1.0);
        } else {
          // Fallback for browsers that do not support toBlob
          const image = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = image;
          link.download = t('app.brand') + '-Hesaplama.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        alert('İndirme fonksiyonu sonuna ulaşıldı');
      } catch (error) {
        console.error('Resim oluşturma hatası:', error);
        alert(t('health.image_error', 'Resim oluşturulurken bir hata oluştu.'));
      }
    } else {
      console.log('slipCardRef.current null!');
    }
  };

  const shareToWhatsApp = async () => {
    if (slipCardRef.current) {
      try {
        // Geçici olarak slip kartının arka planını düz renge çevirelim
        const isDark = document.documentElement.classList.contains('dark');
        const originalStyle = slipCardRef.current.getAttribute('style');
        slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
        
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
          scale: 2, // Daha yüksek çözünürlük
          logging: false,
          useCORS: true,
          allowTaint: true,
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
        
        // Orijinal stili geri yükle
        if (originalStyle) {
          slipCardRef.current.setAttribute('style', originalStyle);
        } else {
          slipCardRef.current.removeAttribute('style');
        }
        
        const image = canvas.toDataURL('image/png');
        const blob = await (await fetch(image)).blob();
        // --- Mobil uygulama için doğrudan paylaş ---
        if (Capacitor.isNativePlatform()) {
          try {
            const reader = new FileReader();
            reader.onloadend = async () => {
              const base64data = reader.result as string;
              await Share.share({
                title: t('app.brand') + ' Hesaplama Sonucu',
                text: 'Hesaplama sonucunu sen de paylaş!',
                url: base64data,
                dialogTitle: 'Uygulamada paylaş'
              });
            };
            reader.readAsDataURL(blob);
            return;
          } catch (e) {}
        }
        // --- Web için mevcut davranış ---
        const file = new File([blob], t('app.brand') + '-Hesaplama.png', { type: 'image/png' });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: t('app.brand') + ' Hesaplama Sonucu' });
        } else {
          const link = document.createElement('a');
          link.href = image;
          link.download = t('app.brand') + '-Hesaplama.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          alert(t('health.download_image', 'Resim indirildi. Lütfen indirilen resmi paylaşım uygulamasında paylaşın.'));
        }
      } catch (error) {
        console.error('Resim oluşturulamadı:', error);
        alert(t('health.image_error', 'Resim oluşturulurken bir hata oluştu.'));
      }
    }
  };

  const shareToFacebook = async () => {
    if (slipCardRef.current) {
      try {
        // Geçici olarak slip kartının arka planını düz renge çevirelim
        const isDark = document.documentElement.classList.contains('dark');
        const originalStyle = slipCardRef.current.getAttribute('style');
        slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
        
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
          scale: 2, // Daha yüksek çözünürlük
          logging: false,
          useCORS: true,
          allowTaint: true,
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
        
        // Orijinal stili geri yükle
        if (originalStyle) {
          slipCardRef.current.setAttribute('style', originalStyle);
        } else {
          slipCardRef.current.removeAttribute('style');
        }
        
        const image = canvas.toDataURL('image/png');
        const blob = await (await fetch(image)).blob();
        // --- Mobil uygulama için doğrudan paylaş ---
        if (Capacitor.isNativePlatform()) {
          try {
            const reader = new FileReader();
            reader.onloadend = async () => {
              const base64data = reader.result as string;
              await Share.share({
                title: t('app.brand') + ' Hesaplama Sonucu',
                text: 'Hesaplama sonucunu sen de paylaş!',
                url: base64data,
                dialogTitle: 'Uygulamada paylaş'
              });
            };
            reader.readAsDataURL(blob);
            return;
          } catch (e) {}
        }
        // --- Web için mevcut davranış ---
        const file = new File([blob], t('app.brand') + '-Hesaplama.png', { type: 'image/png' });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: t('app.brand') + ' Hesaplama Sonucu' });
        } else {
          const link = document.createElement('a');
          link.href = image;
          link.download = t('app.brand') + '-Hesaplama.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          alert(t('health.download_image', 'Resim indirildi. Lütfen indirilen resmi paylaşım uygulamasında paylaşın.'));
        }
      } catch (error) {
        console.error('Resim oluşturulamadı:', error);
        alert(t('health.image_error', 'Resim oluşturulurken bir hata oluştu.'));
      }
    }
  };

  const shareToTwitter = async () => {
    if (slipCardRef.current) {
      try {
        // Geçici olarak slip kartının arka planını düz renge çevirelim
        const isDark = document.documentElement.classList.contains('dark');
        const originalStyle = slipCardRef.current.getAttribute('style');
        slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
        
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
          scale: 2, // Daha yüksek çözünürlük
          logging: false,
          useCORS: true,
          allowTaint: true,
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
        
        // Orijinal stili geri yükle
        if (originalStyle) {
          slipCardRef.current.setAttribute('style', originalStyle);
        } else {
          slipCardRef.current.removeAttribute('style');
        }
        
        const image = canvas.toDataURL('image/png');
        const blob = await (await fetch(image)).blob();
        // --- Mobil uygulama için doğrudan paylaş ---
        if (Capacitor.isNativePlatform()) {
          try {
            const reader = new FileReader();
            reader.onloadend = async () => {
              const base64data = reader.result as string;
              await Share.share({
                title: t('app.brand') + ' Hesaplama Sonucu',
                text: 'Hesaplama sonucunu sen de paylaş!',
                url: base64data,
                dialogTitle: 'Uygulamada paylaş'
              });
            };
            reader.readAsDataURL(blob);
            return;
          } catch (e) {}
        }
        // --- Web için mevcut davranış ---
        const file = new File([blob], t('app.brand') + '-Hesaplama.png', { type: 'image/png' });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: t('app.brand') + ' Hesaplama Sonucu' });
        } else {
          const link = document.createElement('a');
          link.href = image;
          link.download = t('app.brand') + '-Hesaplama.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          alert(t('health.download_image', 'Resim indirildi. Lütfen indirilen resmi paylaşım uygulamasında paylaşın.'));
        }
      } catch (error) {
        console.error('Resim oluşturulamadı:', error);
        alert(t('health.image_error', 'Resim oluşturulurken bir hata oluştu.'));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 sm:p-0" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-[calc(100%-2rem)] sm:w-full max-w-lg relative border-2 border-violet-300 dark:border-violet-700 overflow-y-auto max-h-[85vh] flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <button 
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition-colors z-10"
          onClick={onClose}
          aria-label={t('common.buttons.close')}
        >
          <X size={24} />
        </button>

        <div ref={slipCardRef} className="bg-inherit dark:bg-inherit p-1 rounded-lg"> {/* Added bg-inherit to ensure parent's bg is used by html2canvas if needed, p-1 for slight padding */}
          {/* New Header: Logo, App Name, Date */}
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white font-extrabold text-lg shadow">PC</div>
              <h3 className="text-xl font-extrabold text-violet-700 dark:text-violet-300">{t('app.brand')}</h3>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString('tr-TR')}</div>
          </div>

          {/* New Content Title */}
          <h2 className="text-center text-violet-700 dark:text-violet-400 font-extrabold text-2xl mb-5 border-b border-gray-200 dark:border-gray-700 pb-3 pt-2">
            {slipTitle}
          </h2>

          {/* Existing content starts here */}
          {/* Sağlık Hesaplama Sonuçları */}
          {isHealthCalculation && (
            <div className="space-y-3">
              {/* BMI Sonucu - Sadece BMI hesaplaması için göster */}
              {!isCalorieCalculation && result.bmi !== undefined && (
                <div className="flex justify-between items-center mb-2 bg-gray-100 dark:bg-gray-800/80 p-2 rounded">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t(`${translationPrefix}.bmi`)}:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{result.bmi}</span>
                </div>
              )}
              
              {/* BMI Kategorisi - Sadece BMI hesaplaması için göster */}
              {!isCalorieCalculation && result.bmiCategory && (
                <div className="flex justify-between items-center mb-2 bg-violet-50 dark:bg-violet-900/30 p-2 rounded">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t(`${translationPrefix}.category`)}:</span>
                  <span className="text-violet-600 dark:text-violet-400 font-bold">{result.bmiCategory}</span>
                </div>
              )}
              
              {/* Vücut Yağ Oranı - Sadece vücut yağ oranı hesaplaması için göster */}
              {!isCalorieCalculation && result.bodyFatPercentage !== undefined && (
                <div className="flex justify-between items-center mb-2 bg-violet-50 dark:bg-violet-900/30 p-2 rounded">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t(`${translationPrefix}.body_fat_percentage`)}:</span>
                  <span className="text-violet-600 dark:text-violet-400 font-bold">%{result.bodyFatPercentage}</span>
                </div>
              )}
              
              {/* Vücut Yağ Kategorisi - Sadece vücut yağ oranı hesaplaması için göster */}
              {!isCalorieCalculation && result.bodyFatCategory && (
                <div className="flex justify-between items-center mb-2 bg-violet-50 dark:bg-violet-900/30 p-2 rounded">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t(`${translationPrefix}.category`)}:</span>
                  <span className="text-violet-600 dark:text-violet-400 font-bold">{result.bodyFatCategory}</span>
                </div>
              )}
              
              {/* Kalori İhtiyacı - Sadece kalori hesaplaması için göster */}
              {isCalorieCalculation && result.calories !== undefined && (
                <div className="flex justify-between items-center mb-2 bg-green-50 dark:bg-green-900/30 p-2 rounded">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t(`${translationPrefix}.daily_calorie_need`)}:</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">{result.calories} kcal</span>
                </div>
              )}
              
              {/* Kilo Vermek İçin Kalori - Sadece kalori hesaplaması için göster */}
              {isCalorieCalculation && result.caloriesForLoss !== undefined && (
                <div className="flex justify-between items-center mb-2 bg-green-50 dark:bg-green-900/30 p-2 rounded">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t(`${translationPrefix}.lose_weight`)}:</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">{result.caloriesForLoss} kcal</span>
                </div>
              )}
              
              {/* Kilo Almak İçin Kalori - Sadece kalori hesaplaması için göster */}
              {isCalorieCalculation && result.caloriesForGain !== undefined && (
                <div className="flex justify-between items-center mb-2 bg-green-50 dark:bg-green-900/30 p-2 rounded">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t(`${translationPrefix}.gain_weight`)}:</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">{result.caloriesForGain} kcal</span>
                </div>
              )}
              
              {/* Bilgilendirme Notu */}
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                {t(`${translationPrefix}.health_calculation_note`)}
              </div>
            </div>
          )}
          
          {/* Yemek Hesaplama Sonuçları */}
          {!isHealthCalculation && (
            <>
              {/* Ödenen Tutar */}
              <div className="flex justify-between items-center mb-2 bg-gray-100 dark:bg-gray-800/80 p-2 rounded">
                <span className="text-gray-700 dark:text-gray-300 font-medium">{t(`${translationPrefix}.paid_amount`)}:</span>
                <span className="text-green-600 dark:text-green-400 font-bold">
                  {typeof paidAmount === 'number' && result && typeof result.discount === 'number' 
                    ? (paidAmount - result.discount).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    : typeof result?.netTotal === 'number' 
                      ? result.netTotal.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                      : '0.00'
                  }₺
                </span>
              </div>
              
              {/* Komisyon ve diğer bilgiler */}
              {result && (
                <div className="mb-3 space-y-1.5">
                  {result.tax !== undefined && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t(`${translationPrefix}.tax`)}:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {result.isJoker 
                          ? result.tax.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                          : (typeof paidAmount === 'number' && typeof result.discount === 'number' 
                            ? ((paidAmount - result.discount) * 0.08).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                            : result.tax.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                            )}₺
                      </span>
                    </div>
                  )}
                  {result.commission !== undefined && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t(`${translationPrefix}.commission`)}:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {result.isJoker 
                          ? result.commission.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                          : (typeof paidAmount === 'number' && typeof result.discount === 'number' 
                            ? ((paidAmount - result.discount) * (result.firm?.commission / 100 || 0)).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                            : result.commission.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                            )}₺
                      </span>
                    </div>
                  )}
                  {result.communicationCommission !== undefined && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t(`${translationPrefix}.communication_commission`)}:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {result.isJoker 
                          ? result.communicationCommission.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                          : (typeof paidAmount === 'number' && typeof result.discount === 'number' 
                            ? ((paidAmount - result.discount) * (result.firm?.communicationCommission / 100 || 0)).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                            : result.communicationCommission.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                            )}₺
                      </span>
                    </div>
                  )}
                  {result.discount !== undefined && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t(`${translationPrefix}.discount`)}:</span>
                      <span className="text-gray-700 dark:text-gray-300">-{result.discount.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                    </div>
                  )}
                  {result.isJoker && result.discountCommission !== undefined && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t(`${translationPrefix}.discount_commission`)}:</span>
                      <span className="text-gray-700 dark:text-gray-300">{result.discountCommission.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                    </div>
                  )}
                  {result.profit !== undefined && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t(`${translationPrefix}.restaurant_profit`)}:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {(() => {
                          // Kâr = (Ödenen Tutar) - KDV - Komisyon - İletişim Komisyonu - (varsa indirim komisyonu)
                          const netAmount = typeof paidAmount === 'number' && typeof result.discount === 'number'
                            ? paidAmount - result.discount
                            : typeof result?.netTotal === 'number'
                              ? result.netTotal
                              : 0;
                          const tax = result.tax || 0;
                          const commission = result.commission || 0;
                          const communicationCommission = result.communicationCommission || 0;
                          const discountCommission = result.isJoker && result.discountCommission ? result.discountCommission : 0;
                          // Sonuç doğrudan gösterilen değerlerden hesaplanacak
                          const restaurantProfit = netAmount - tax - commission - communicationCommission - discountCommission;
                          return restaurantProfit.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                        })()}₺
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Ayırıcı çizgi */}
              <div className="my-3 border-t border-gray-200 dark:border-gray-700"></div>
              
              {/* Evde Yapım Maliyeti */}
              {typeof homemadeTotal === 'number' && (
                <div className="flex justify-between items-center mb-2 bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t(`${translationPrefix}.homemade_cost`)}:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">{homemadeTotal.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                </div>
              )}
              
              {/* Fiyat Karşılaştırması */}
              {typeof homemadeTotal === 'number' && typeof result?.netTotal === 'number' && (
                <div className="my-4">
                  <h3 className="text-center text-gray-700 dark:text-gray-300 font-medium mb-2">{t(`${translationPrefix}.price_comparison`)}</h3>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t(`${translationPrefix}.paid_amount`)}</div>
                      <div className="font-bold text-red-500">{result.netTotal.toLocaleString('tr-TR')}₺</div>
                    </div>
                    <div className="text-2xl text-gray-400">VS</div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t(`${translationPrefix}.homemade`)}</div>
                      <div className="font-bold text-green-500">{homemadeTotal.toLocaleString('tr-TR')}₺</div>
                      <CheckCircle className="inline-block text-green-500 ml-1" size={16} />
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm font-medium">{t(`${translationPrefix}.difference`)}:</span>
                    <span className="text-sm font-bold text-green-500">-{(result.netTotal - homemadeTotal).toLocaleString('tr-TR')}₺</span>
                  </div>
                </div>
              )}
              
              {/* Seçilen Ürünler */}
              {selectedRecipes && selectedRecipes.length > 0 && (
                <div className="mt-4 border-t border-green-200 dark:border-green-800 pt-4">
                  <h3 className="font-bold text-green-700 dark:text-green-300 mb-3 text-base text-center">{t(`${translationPrefix}.selected_products`)}</h3>
                  <ul className="space-y-2 mb-4">
                    {selectedRecipes.map(item => (
                      <li key={item.nameTR || item.nameEN} className="flex justify-between items-center text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-sm font-semibold px-2.5 py-1 rounded-md">
                            <span>{quantities?.[item.nameTR || item.nameEN]}</span>
                            <span className="ml-0.5">×</span>
                          </div>
                          <span className="font-medium">{item.nameTR || item.nameEN}</span>
                        </div>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {typeof (item.priceTL * (quantities?.[item.nameTR || item.nameEN] || 0)) === 'number' 
                            ? (item.priceTL * (quantities[item.nameTR || item.nameEN] || 0)).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '₺'
                            : '-'}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-right font-bold text-green-600 dark:text-green-400 pr-2">
                    {t(`${translationPrefix}.total`)}: {homemadeTotal?.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺
                  </div>
                </div>
              )}
            </>
          )}
          {/* Fiyat Karşılaştırması */}
          {!isHealthCalculation && (
            <div className="pt-4">
              <div className="flex flex-col items-center gap-3 mb-4">
                <span className="font-bold text-xl text-gray-800 dark:text-white">{t(`${translationPrefix}.price_comparison`)}</span>
                <div className="h-1 w-20 bg-green-500 rounded-full"></div>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center max-w-md mx-auto">
                {/* Ödenen Tutar Kutusu */}
                <div className={`relative flex flex-col items-center p-3 rounded-lg transition-all duration-300
                  ${((paidAmount ?? 0) - (result?.discount ?? 0)) < (homemadeTotal ?? 0)
                    ? 'bg-green-50 dark:bg-green-900/50 ring-2 ring-green-500 dark:ring-green-400'
                    : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t(`${translationPrefix}.paid_amount`)}</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {typeof paidAmount === 'number' && result && typeof result.discount === 'number'
                      ? ((paidAmount - result.discount).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})) 
                      : (typeof paidAmount === 'number' ? paidAmount.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-')}₺
                  </span>
                  {((paidAmount ?? 0) - (result?.discount ?? 0)) < (homemadeTotal ?? 0) && (
                    <div className="tick-marker absolute -left-3 -bottom-3 z-50">
                      <CheckCircle size={32} className="text-green-500 bg-white dark:bg-green-900 rounded-full shadow border-2 border-white dark:border-green-900" />
                    </div>
                  )}
                </div>
                {/* VS ve çizgi */}
                <div className="flex flex-col items-center z-20">
                  <span className="text-2xl font-extrabold text-gray-400 drop-shadow-sm tracking-wider select-none">VS</span>
                  <div className="h-8 w-0.5 bg-gradient-to-b from-green-300 via-gray-300 to-green-300 dark:from-green-700 dark:via-gray-700 dark:to-green-700 opacity-70"></div>
                </div>
                {/* Evde Yapsan Kutusu */}
                <div className={`relative flex flex-col items-center p-3 rounded-lg transition-all duration-300
                  ${((paidAmount ?? 0) - (result?.discount ?? 0)) >= (homemadeTotal ?? 0)
                    ? 'bg-green-50 dark:bg-green-900/50 ring-2 ring-green-500 dark:ring-green-400'
                    : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t(`${translationPrefix}.homemade`)}</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">{typeof homemadeTotal === 'number' ? homemadeTotal.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}₺</span>
                  {((paidAmount ?? 0) - (result?.discount ?? 0)) >= (homemadeTotal ?? 0) && (
                    <div className="tick-marker absolute -left-3 -bottom-3 z-50">
                      <CheckCircle size={32} className="text-green-500 bg-white dark:bg-green-900 rounded-full shadow border-2 border-white dark:border-green-900" />
                    </div>
                  )}
                </div>
              </div>
              {/* Fark kutusu */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-sm font-medium">{t(`${translationPrefix}.difference`)}:</span>
                <div className="px-3 py-1 rounded-lg font-bold text-base bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  {typeof paidAmount === 'number' && typeof result?.discount === 'number' && typeof homemadeTotal === 'number'
                    ? Math.abs((paidAmount - result.discount) - homemadeTotal).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}₺
                </div>
              </div>
            </div>
          )}
          {/* New Footer: Calculated At Time */}
          <div className="text-center text-xs text-gray-400 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            {t('app.brand')} {t('subscription.calculatedWithSuffix')} • {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Download and Share Buttons Section */}
        <div className="px-4 pb-4">
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
              onClick={() => copyImageToClipboard(slipCardRef, document.documentElement.classList.contains('dark'))}
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

export default CalculationResultModal;
