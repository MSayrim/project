import React, { useRef } from 'react';
import { X, Share2, Copy, Users, Download, CheckCircle } from 'lucide-react';
import { FaWhatsapp, FaXTwitter, FaFacebook } from 'react-icons/fa6';
import html2canvas from 'html2canvas';

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
  
  // Geçici olarak slip kartının arka planını düz renge çevirelim
  const originalStyle = cardRef.current.getAttribute('style');
  cardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
  
  const canvas = await html2canvas(cardRef.current, {
    backgroundColor: isDark ? '#181c27' : '#f6f8ff',
    scale: 2,
    useCORS: true,
    allowTaint: true
  });
  
  // Orijinal stili geri yükle
  if (originalStyle) {
    cardRef.current.setAttribute('style', originalStyle);
  } else {
    cardRef.current.removeAttribute('style');
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
    alert('Resim indirildi. Lütfen indirilen resmi paylaşım uygulamasında paylaşın.');
  }
};

// Resmi panoya kopyalama fonksiyonu
const copyImageToClipboard = async (cardRef: React.RefObject<HTMLDivElement>, isDark = false) => {
  if (!cardRef.current) return;
  try {
    // Geçici olarak slip kartının arka planını düz renge çevirelim
    const originalStyle = cardRef.current.getAttribute('style');
    cardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
    
    const canvas = await html2canvas(cardRef.current, { 
      backgroundColor: isDark ? '#181c27' : '#f6f8ff', 
      scale: 2,
      useCORS: true,
      allowTaint: true
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
          link.download = 'ParamCebimde-Hesaplama.png';
          link.click();
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
  lines.push(slipTitle || 'Yemek Hesaplama Sonucu');
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
  
  console.log('Modal açılıyor', { result, slipTitle, isCalorieCalculation: slipTitle?.includes('Kalori') });
  
  const slipCardRef = useRef<HTMLDivElement>(null);
  
  // Slip metnini oluştur (sağlık hesaplaması mı yoksa yemek hesaplaması mı olduğunu kontrol et)
  const isHealthCalculation = slipTitle?.includes('BMI') || slipTitle?.includes('Vücut') || slipTitle?.includes('Kalori');
  
  // Kalori hesaplaması için özel kontrol
  const isCalorieCalculation = slipTitle?.includes('Kalori');
  
  const slipText = isHealthCalculation 
    ? formatHealthSlip(result, slipTitle)
    : formatFoodSlip(result, slipTitle, homemadeTotal, selectedRecipes, quantities, paidAmount);

  const downloadAsImage = async () => {
    if (slipCardRef.current) {
      try {
        // Geçici olarak slip kartının arka planını düz renge çevirelim
        const isDark = document.documentElement.classList.contains('dark');
        const originalStyle = slipCardRef.current.getAttribute('style');
        slipCardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
        
        const canvas = await html2canvas(slipCardRef.current, {
          backgroundColor: isDark ? '#181c27' : '#f6f8ff',
          scale: 2, // Daha yüksek çözünürlük
          logging: false,
          useCORS: true,
          allowTaint: true
        });
        
        // Orijinal stili geri yükle
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
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-fadeInUp border-2 border-violet-200 dark:border-violet-800">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><X size={22} /></button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-violet-500" size={22}/>
            <h3 className="text-lg font-extrabold text-violet-700 dark:text-violet-200">Arkadaşlarınla Paylaş!</h3>
          </div>
          <p className="text-gray-500 dark:text-gray-300 text-sm mb-3">Son hesaplama slipini kolayca paylaşabilirsin 👇</p>
          {/* Görsel Slip Kartı */}
          <div 
            ref={slipCardRef}
            className="w-full rounded-xl p-5 mb-4 border border-violet-200 dark:border-violet-800 shadow-lg"
            style={{ backgroundColor: document.documentElement.classList.contains('dark') ? '#181c27' : '#f6f8ff' }}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold text-xs">PC</div>
                <h3 className="ml-2 text-violet-800 dark:text-violet-200 font-bold">ParamCebimde</h3>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString('tr-TR')}</div>
            </div>
            
            {/* Başlık */}
            <h2 className="text-center text-violet-600 dark:text-violet-400 font-bold text-xl mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 bg-gray-50 dark:bg-gray-900 -mx-5 px-5 py-2">
              {slipTitle || 'Hesaplama Sonucu'}
            </h2>
            
            {/* Sağlık Hesaplama Sonuçları */}
            {isHealthCalculation && (
              <div className="space-y-3">
                {/* BMI Sonucu - Sadece BMI hesaplaması için göster */}
                {!isCalorieCalculation && result.bmi !== undefined && (
                  <div className="flex justify-between items-center mb-2 bg-gray-100 dark:bg-gray-800/80 p-2 rounded">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">BMI:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{result.bmi}</span>
                  </div>
                )}
                
                {/* BMI Kategorisi - Sadece BMI hesaplaması için göster */}
                {!isCalorieCalculation && result.bmiCategory && (
                  <div className="flex justify-between items-center mb-2 bg-gray-100 dark:bg-gray-800/80 p-2 rounded">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Kategori:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{result.bmiCategory}</span>
                  </div>
                )}
                
                {/* Vücut Yağ Oranı - Sadece vücut yağ oranı hesaplaması için göster */}
                {!isCalorieCalculation && result.bodyFatPercentage !== undefined && (
                  <div className="flex justify-between items-center mb-2 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Vücut Yağ Oranı:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">%{result.bodyFatPercentage}</span>
                  </div>
                )}
                
                {/* Vücut Yağ Kategorisi - Sadece vücut yağ oranı hesaplaması için göster */}
                {!isCalorieCalculation && result.bodyFatCategory && (
                  <div className="flex justify-between items-center mb-2 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Kategori:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{result.bodyFatCategory}</span>
                  </div>
                )}
                
                {/* Kalori İhtiyacı - Sadece kalori hesaplaması için göster */}
                {isCalorieCalculation && result.calories !== undefined && (
                  <div className="flex justify-between items-center mb-2 bg-green-50 dark:bg-green-900/30 p-2 rounded">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Günlük Kalori İhtiyacı:</span>
                    <span className="text-green-600 dark:text-green-400 font-bold">{result.calories} kcal</span>
                  </div>
                )}
                
                {/* Kilo Vermek İçin Kalori - Sadece kalori hesaplaması için göster */}
                {isCalorieCalculation && result.caloriesForLoss !== undefined && (
                  <div className="flex justify-between items-center mb-2 bg-green-50 dark:bg-green-900/30 p-2 rounded">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Kilo Vermek İçin:</span>
                    <span className="text-green-600 dark:text-green-400 font-bold">{result.caloriesForLoss} kcal</span>
                  </div>
                )}
                
                {/* Kilo Almak İçin Kalori - Sadece kalori hesaplaması için göster */}
                {isCalorieCalculation && result.caloriesForGain !== undefined && (
                  <div className="flex justify-between items-center mb-2 bg-green-50 dark:bg-green-900/30 p-2 rounded">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Kilo Almak İçin:</span>
                    <span className="text-green-600 dark:text-green-400 font-bold">{result.caloriesForGain} kcal</span>
                  </div>
                )}
                
                {/* Bilgilendirme Notu */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  Bu hesaplamalar yaklaşık değerlerdir ve sadece bilgi amaçlıdır. Sağlık durumunuzla ilgili kararlar için bir sağlık uzmanına danışın.
                </div>
              </div>
            )}
            
            {/* Yemek Hesaplama Sonuçları */}
            {!isHealthCalculation && (
              <>
                {/* Ödenen Tutar */}
                <div className="flex justify-between items-center mb-2 bg-gray-100 dark:bg-gray-800/80 p-2 rounded">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Ödenen Tutar:</span>
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
                        <span className="text-gray-600 dark:text-gray-400">KDV:</span>
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
                        <span className="text-gray-600 dark:text-gray-400">Komisyon:</span>
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
                        <span className="text-gray-600 dark:text-gray-400">İletişim Komisyonu:</span>
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
                        <span className="text-gray-600 dark:text-gray-400">İndirim:</span>
                        <span className="text-gray-700 dark:text-gray-300">-{result.discount.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                      </div>
                    )}
                    {result.isJoker && result.discountCommission !== undefined && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">İndirim Komisyonu:</span>
                        <span className="text-gray-700 dark:text-gray-300">{result.discountCommission.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                      </div>
                    )}
                    {result.profit !== undefined && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Restoran Kârı:</span>
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
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Evde Yapım Maliyeti:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{homemadeTotal.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                  </div>
                )}
                
                {/* Fiyat Karşılaştırması */}
                {typeof homemadeTotal === 'number' && typeof result?.netTotal === 'number' && (
                  <div className="my-4">
                    <h3 className="text-center text-gray-700 dark:text-gray-300 font-medium mb-2">Fiyat Karşılaştırması</h3>
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Ödenen Tutar</div>
                        <div className="font-bold text-red-500">{result.netTotal.toLocaleString('tr-TR')}₺</div>
                      </div>
                      <div className="text-2xl text-gray-400">VS</div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Evde Yapım</div>
                        <div className="font-bold text-green-500">{homemadeTotal.toLocaleString('tr-TR')}₺</div>
                        <CheckCircle className="inline-block text-green-500 ml-1" size={16} />
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-sm font-medium">Fark: </span>
                      <span className="text-sm font-bold text-green-500">-{(result.netTotal - homemadeTotal).toLocaleString('tr-TR')}₺</span>
                    </div>
                  </div>
                )}
                
                {/* Seçilen Ürünler */}
                {selectedRecipes && selectedRecipes.length > 0 && (
                  <div className="mt-4 border-t border-green-200 dark:border-green-800 pt-4">
                    <h3 className="font-bold text-green-700 dark:text-green-300 mb-3 text-base text-center">Seçilen Ürünler</h3>
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
                      Toplam: {homemadeTotal?.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺
                    </div>
                  </div>
                )}
              </>
            )}
            {/* Fiyat Karşılaştırması */}
            {!isHealthCalculation && (
              <div className="pt-4">
                <div className="flex flex-col items-center gap-3 mb-4">
                  <span className="font-bold text-xl text-gray-800 dark:text-white">Fiyat Karşılaştırması</span>
                  <div className="h-1 w-20 bg-green-500 rounded-full"></div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center max-w-md mx-auto">
                  {/* Ödenen Tutar Kutusu */}
                  <div className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-300
                    ${((paidAmount ?? 0) - (result?.discount ?? 0)) < (homemadeTotal ?? 0)
                      ? 'bg-green-50 dark:bg-green-900/50 ring-2 ring-green-500 dark:ring-green-400'
                      : 'bg-gray-50 dark:bg-gray-800'}`}>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Ödenen Tutar</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {typeof paidAmount === 'number' && result && typeof result.discount === 'number'
                        ? ((paidAmount - result.discount).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})) 
                        : (typeof paidAmount === 'number' ? paidAmount.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-')}₺
                    </span>
                    {((paidAmount ?? 0) - (result?.discount ?? 0)) < (homemadeTotal ?? 0) && (
                      <CheckCircle size={32}
                        className="absolute -left-3 -bottom-3 text-green-500 bg-white dark:bg-green-900 rounded-full shadow border-2 border-white dark:border-green-900"/>
                    )}
                  </div>
                  {/* VS ve çizgi */}
                  <div className="flex flex-col items-center z-20">
                    <span className="text-2xl font-extrabold text-gray-400 drop-shadow-sm tracking-wider select-none">VS</span>
                    <div className="h-8 w-0.5 bg-gradient-to-b from-green-300 via-gray-300 to-green-300 dark:from-green-700 dark:via-gray-700 dark:to-green-700 opacity-70"></div>
                  </div>
                  {/* Evde Yapsan Kutusu */}
                  <div className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-300
                    ${((paidAmount ?? 0) - (result?.discount ?? 0)) >= (homemadeTotal ?? 0)
                      ? 'bg-green-50 dark:bg-green-900/50 ring-2 ring-green-500 dark:ring-green-400'
                      : 'bg-gray-50 dark:bg-gray-800'}`}>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Evde Yapsan</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">{typeof homemadeTotal === 'number' ? homemadeTotal.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}₺</span>
                    {((paidAmount ?? 0) - (result?.discount ?? 0)) >= (homemadeTotal ?? 0) && (
                      <CheckCircle size={32}
                        className="absolute -left-3 -bottom-3 text-green-500 bg-white dark:bg-green-900 rounded-full shadow border-2 border-white dark:border-green-900"/>
                    )}
                  </div>
                </div>
                {/* Fark kutusu */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="text-sm font-medium">Fark:</span>
                  <div className="px-3 py-1 rounded-lg font-bold text-base bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    {typeof paidAmount === 'number' && typeof result?.discount === 'number' && typeof homemadeTotal === 'number'
                      ? Math.abs((paidAmount - result.discount) - homemadeTotal).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}₺
                  </div>
                </div>
              </div>
            )}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
              ParamCebimde ile hesaplandı • {new Date().toLocaleTimeString('tr-TR')}
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <button 
              onClick={() => shareAsImage(slipCardRef, document.documentElement.classList.contains('dark'))}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-base w-full"
            >
              <Share2 size={18}/> Hızlı Paylaş
            </button>
            <button 
              onClick={downloadAsImage}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold text-base w-full"
            >
              <Download size={18}/> Resim Olarak İndir
            </button>
            <div className="flex gap-3 justify-center w-full mt-2">
              <button 
                onClick={() => shareAsImage(slipCardRef, document.documentElement.classList.contains('dark'))}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full flex items-center justify-center text-xl"
                title="WhatsApp'ta paylaş"
              >
                <FaWhatsapp/>
              </button>
              <button 
                onClick={() => shareAsImage(slipCardRef, document.documentElement.classList.contains('dark'))}
                className="bg-black hover:bg-gray-800 text-white p-2 rounded-full flex items-center justify-center text-xl"
                title="X'te paylaş"
              >
                <FaXTwitter/>
              </button>
              <button 
                onClick={() => shareAsImage(slipCardRef, document.documentElement.classList.contains('dark'))}
                className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-full flex items-center justify-center text-xl"
                title="Facebook'ta paylaş"
              >
                <FaFacebook/>
              </button>
              <button
                onClick={() => {
                  copyImageToClipboard(slipCardRef, document.documentElement.classList.contains('dark'));
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 p-2 rounded-full flex items-center justify-center text-xl"
                title="Kopyala"
              >
                <Copy size={20}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationResultModal;
