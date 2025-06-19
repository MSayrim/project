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
const shareAsImage = async (cardRef: React.RefObject<HTMLDivElement>, isDark = false, brandName = 'ParamCebimde') => {
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
            title: brandName + ' Hesaplama Sonucu',
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
      const file = new File([blob], brandName + '-Hesaplama.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: brandName + ' Hesaplama Sonucu' });
        return;
      }
    } catch (e) {
      console.error('Web Share API hatası:', e);
    }
    
    // Son çare: indir
    const link = document.createElement('a');
    link.href = image;
    link.download = brandName + '-Hesaplama.png';
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
const copyImageToClipboard = async (cardRef: React.RefObject<HTMLDivElement>, isDark = false, brandName = 'ParamCebimde') => {
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
          link.download = brandName + '-Hesaplama.png';
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

// Kredi hesaplama slip metni oluşturucu
function formatCreditSlip(result: any, slipTitle?: string) {
  if (!result) return '';
  const lines = [];
  lines.push(slipTitle || 'Kredi Hesaplama Sonucu');
  lines.push('------------------------');
  lines.push(`Kredi Türü: ${result.loanType || '-'}\nKredi Tutarı: ${result.loanAmount?.toLocaleString('tr-TR')} TL`);
  lines.push(`Vade: ${result.loanTerm} Ay`);
  lines.push(`Faiz Oranı: %${result.interestRate}`);
  lines.push(`Yıllık Maliyet Oranı: %${result.annualEffectiveRate?.toLocaleString('tr-TR')}`);
  lines.push(`Aylık Taksit: ${result.installment?.toLocaleString('tr-TR')} TL`);
  lines.push(`Toplam Geri Ödeme: ${result.totalPayment?.toLocaleString('tr-TR')} TL`);
  lines.push('------------------------');
  lines.push('Ödeme Planı:');
  if (Array.isArray(result.paymentSchedule)) {
    lines.push('Taksit | Taksit Tutarı | Faiz | KKDF | BSMV | Anapara | Kalan Anapara');
    result.paymentSchedule.slice(0, 6).forEach((item: any) => {
      lines.push(`${item.no} | ${item.payment.toLocaleString('tr-TR')} | ${item.interest.toLocaleString('tr-TR')} | ${item.kkdf.toLocaleString('tr-TR')} | ${item.bsmv.toLocaleString('tr-TR')} | ${item.principal.toLocaleString('tr-TR')} | ${item.remainingPrincipal.toLocaleString('tr-TR')}`);
    });
    if (result.paymentSchedule.length > 6) lines.push(`... (${result.paymentSchedule.length} taksit)`);
  }
  lines.push('------------------------');
  lines.push(`Tarih: ${new Date().toLocaleString('tr-TR')}`);
  return lines.join('\n');
}

const CalculationResultModal: React.FC<CalculationResultModalProps> = ({ open, onClose, result, slipTitle, homemadeTotal, selectedRecipes, quantities, paidAmount }) => {
  if (!open) return null;
  
  const { t } = useTranslation('translation');
  const slipCardRef = useRef<HTMLDivElement>(null);
  const isHealthCalculation = result?.type === 'health' || result?.type === 'bmi' || result?.type === 'calorie';
  const isCreditCalculation = result?.type === 'credit';
  const [isCopied, setIsCopied] = useState(false);

  // Slip metni oluşturucu
  const slipText = isHealthCalculation
    ? formatHealthSlip(result, slipTitle)
    : isCreditCalculation
      ? formatCreditSlip(result, slipTitle)
      : formatFoodSlip(result, slipTitle, homemadeTotal, selectedRecipes, quantities, paidAmount);

  // Görsel indirme fonksiyonu
  const downloadAsImage = () => {
    shareAsImage(slipCardRef, document.documentElement.classList.contains('dark'), t('app.brand'));
  };

  // WhatsApp ile paylaşım
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(slipText);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Facebook ile paylaşım
  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  // Twitter ile paylaşım
  const shareToTwitter = () => {
    const text = encodeURIComponent(slipText.substring(0, 280));
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 sm:p-0">
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl mx-auto border border-violet-200 dark:border-violet-800 overflow-y-auto max-h-[90vh]`}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onClose}
          aria-label="Kapat"
        >
          <X size={22} />
        </button>
        {isCreditCalculation ? (
          <div className="px-6 py-7 flex flex-col items-center" ref={slipCardRef}>
            <div className="flex flex-col items-center mb-4">
              <div className="font-bold text-lg text-violet-700 dark:text-violet-400 mb-1">ParamCebimde</div>
              <div className="text-xs text-gray-400 mb-1">{new Date().toLocaleDateString('tr-TR')}</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{result?.loanType || slipTitle || 'Kredi Hesaplama'}</div>
            </div>
            <div className="w-full flex flex-col gap-2 text-sm mb-4">
              <div className="flex justify-between"><span>Kredi Tutarı:</span><span className="font-semibold">{result?.loanAmount != null ? result.loanAmount.toLocaleString('tr-TR') : '-'} TL</span></div>
              <div className="flex justify-between"><span>Vade:</span><span className="font-semibold">{result?.loanTerm != null ? result.loanTerm : '-'} Ay</span></div>
              <div className="flex justify-between"><span>Faiz Oranı:</span><span className="font-semibold">{result?.interestRate != null ? `%${result.interestRate}` : '-'}</span></div>
              <div className="flex justify-between"><span>Yıllık Maliyet Oranı:</span><span className="font-semibold">{result?.annualEffectiveRate != null ? `%${result.annualEffectiveRate.toLocaleString('tr-TR')}` : '-'}</span></div>
              <div className="flex justify-between"><span>Aylık Taksit:</span><span className="font-semibold">{result?.installment != null ? result.installment.toLocaleString('tr-TR') : '-'} TL</span></div>
              <div className="flex justify-between"><span>Toplam Geri Ödeme:</span><span className="font-semibold">{result?.totalPayment != null ? result.totalPayment.toLocaleString('tr-TR') : '-'} TL</span></div>
            </div>
            <div className="w-full mt-2 mb-3">
              <div className="font-semibold mb-2 text-center text-base text-gray-800 dark:text-white">Ödeme Planı (İlk 6 Taksit)</div>
              {Array.isArray(result?.paymentSchedule) && result.paymentSchedule.length > 0 ? (
                <table className="w-full text-xs border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="py-1 px-2 border">Taksit</th>
                      <th className="py-1 px-2 border">Taksit Tutarı</th>
                      <th className="py-1 px-2 border">Faiz</th>
                      <th className="py-1 px-2 border">KKDF</th>
                      <th className="py-1 px-2 border">BSMV</th>
                      <th className="py-1 px-2 border">Anapara</th>
                      <th className="py-1 px-2 border">Kalan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.paymentSchedule.slice(0, 6).map((item: any, idx: number) => (
                      <tr key={item?.no ?? idx} className={item?.no % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}>
                        <td className="py-1 px-2 border text-center">{item?.no ?? '-'}</td>
                        <td className="py-1 px-2 border text-right">{item?.payment != null ? item.payment.toLocaleString('tr-TR') : '-'}</td>
                        <td className="py-1 px-2 border text-right">{item?.interest != null ? item.interest.toLocaleString('tr-TR') : '-'}</td>
                        <td className="py-1 px-2 border text-right">{item?.kkdf != null ? item.kkdf.toLocaleString('tr-TR') : '-'}</td>
                        <td className="py-1 px-2 border text-right">{item?.bsmv != null ? item.bsmv.toLocaleString('tr-TR') : '-'}</td>
                        <td className="py-1 px-2 border text-right">{item?.principal != null ? item.principal.toLocaleString('tr-TR') : '-'}</td>
                        <td className="py-1 px-2 border text-right">{item?.remainingPrincipal != null ? item.remainingPrincipal.toLocaleString('tr-TR') : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-xs text-gray-500 mt-1">Ödeme planı bulunamadı.</div>
              )}
              {Array.isArray(result?.paymentSchedule) && result.paymentSchedule.length > 6 && (
                <div className="text-center text-xs text-gray-500 mt-1">... {result.paymentSchedule.length} taksit toplam</div>
              )}
            </div>
            <div className="w-full flex flex-col items-center mt-4">
              <button
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-lg shadow border border-violet-200 dark:border-violet-800 mb-3"
                onClick={downloadAsImage}
              >
                <Download size={18} className="inline mr-1" /> Görsel Olarak İndir
              </button>
              <div className="flex gap-3 justify-center mb-2">
                <button onClick={shareToWhatsApp} className="rounded-full bg-green-500 hover:bg-green-600 p-2 shadow text-white"><FaWhatsapp size={20} /></button>
                <button onClick={shareToFacebook} className="rounded-full bg-blue-600 hover:bg-blue-700 p-2 shadow text-white"><FaFacebook size={20} /></button>
                <button onClick={shareToTwitter} className="rounded-full bg-black hover:bg-gray-800 p-2 shadow text-white"><FaXTwitter size={20} /></button>
                <button onClick={() => copyImageToClipboard(slipCardRef, document.documentElement.classList.contains('dark'), t('app.brand'))} className="rounded-full bg-gray-200 dark:bg-gray-800 p-2 shadow"><Copy size={18} className="text-violet-600" /></button>
              </div>
              <div className="text-xs text-gray-400 text-center">Bazı platformlar doğrudan resim paylaşımını desteklemeyebilir. Bu durumda, resmi indirip manuel olarak paylaşabilirsiniz.</div>
            </div>
          </div>
        ) : (
          // Diğer hesaplama türleri için mevcut içerik
          <div>{/* ...orijinal içerik... */}</div>
        )}
      </div>
    </div>
  );
};

export default CalculationResultModal;
