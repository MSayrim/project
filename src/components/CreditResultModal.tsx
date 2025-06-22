import React, { useRef, useState } from 'react';
import { X, Share2, Copy, Users, Download, CheckCircle } from 'lucide-react';
import { FaWhatsapp, FaXTwitter, FaFacebook } from 'react-icons/fa6';
import html2canvas from 'html2canvas';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { useTranslation } from 'react-i18next';

interface CreditResultModalProps {
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

        // Paylaşım butonları bölümünü geçici olarak gizle
        const shareButtons = cardRef.current?.querySelectorAll('.social-share-buttons');
        const originalDisplayValues: string[] = [];
        shareButtons?.forEach((btn) => {
            originalDisplayValues.push((btn as HTMLElement).style.display);
            (btn as HTMLElement).style.display = 'none';
        });

        // Metin hizalama ve padding sorununu çözmek için tablo hücrelerine stil uygula
        const tableCells = cardRef.current.querySelectorAll('th, td');
        const originalStyles: { paddingTop: string; paddingBottom: string; verticalAlign: string }[] = [];
        tableCells.forEach(cell => {
            const htmlCell = cell as HTMLElement;
            originalStyles.push({
                paddingTop: htmlCell.style.paddingTop,
                paddingBottom: htmlCell.style.paddingBottom,
                verticalAlign: htmlCell.style.verticalAlign,
            });
            htmlCell.style.paddingTop = '8px';
            htmlCell.style.paddingBottom = '8px';
            htmlCell.style.verticalAlign = 'middle';
        });

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
            scale: 2.5,
            useCORS: true,
            allowTaint: true,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: cardRef.current.scrollWidth,
            windowHeight: cardRef.current.scrollHeight,
        });

        // Geçici stilleri geri al
        tableCells.forEach((cell, index) => {
            const htmlCell = cell as HTMLElement;
            htmlCell.style.paddingTop = originalStyles[index].paddingTop;
            htmlCell.style.paddingBottom = originalStyles[index].paddingBottom;
            htmlCell.style.verticalAlign = originalStyles[index].verticalAlign;
        });

        // Paylaşım butonlarını geri göster
        shareButtons?.forEach((btn, idx) => {
            (btn as HTMLElement).style.display = originalDisplayValues[idx] || '';
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

        // Paylaşım butonları bölümünü geçici olarak gizle
        const shareButtons = cardRef.current?.querySelectorAll('.social-share-buttons');
        const originalDisplayValues: string[] = [];
        shareButtons?.forEach((btn) => {
            originalDisplayValues.push((btn as HTMLElement).style.display);
            (btn as HTMLElement).style.display = 'none';
        });

        // Metin hizalama ve padding sorununu çözmek için tablo hücrelerine stil uygula
        const tableCells = cardRef.current.querySelectorAll('th, td');
        const originalStyles: { paddingTop: string; paddingBottom: string; verticalAlign: string }[] = [];
        tableCells.forEach(cell => {
            const htmlCell = cell as HTMLElement;
            originalStyles.push({
                paddingTop: htmlCell.style.paddingTop,
                paddingBottom: htmlCell.style.paddingBottom,
                verticalAlign: htmlCell.style.verticalAlign,
            });
            htmlCell.style.paddingTop = '8px';
            htmlCell.style.paddingBottom = '8px';
            htmlCell.style.verticalAlign = 'middle';
        });

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
            scale: 2.5,
            useCORS: true,
            allowTaint: true,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: cardRef.current.scrollWidth,
            windowHeight: cardRef.current.scrollHeight,
        });

        // Geçici stilleri geri al
        tableCells.forEach((cell, index) => {
            const htmlCell = cell as HTMLElement;
            htmlCell.style.paddingTop = originalStyles[index].paddingTop;
            htmlCell.style.paddingBottom = originalStyles[index].paddingBottom;
            htmlCell.style.verticalAlign = originalStyles[index].verticalAlign;
        });

        // Paylaşım butonlarını geri göster
        shareButtons?.forEach((btn, idx) => {
            (btn as HTMLElement).style.display = originalDisplayValues[idx] || '';
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

// Sadece indirme yapan fonksiyon (paylaşım yapmadan)
const downloadAsImageOnly = async (cardRef: React.RefObject<HTMLDivElement>, isDark = false, brandName = 'ParamCebimde') => {
    if (!cardRef.current) return;

    try {
        // Geçici olarak slip kartının arka planını düz renge çevirelim
        const originalStyle = cardRef.current.getAttribute('style');
        cardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';

        // Paylaşım butonları bölümünü geçici olarak gizle
        const shareButtons = cardRef.current?.querySelectorAll('.social-share-buttons');
        const originalDisplayValues: string[] = [];
        shareButtons?.forEach((btn) => {
            originalDisplayValues.push((btn as HTMLElement).style.display);
            (btn as HTMLElement).style.display = 'none';
        });

        // Metin hizalama ve padding sorununu çözmek için tablo hücrelerine stil uygula
        const tableCells = cardRef.current.querySelectorAll('th, td');
        const originalStyles: { paddingTop: string; paddingBottom: string; verticalAlign: string }[] = [];
        tableCells.forEach(cell => {
            const htmlCell = cell as HTMLElement;
            originalStyles.push({
                paddingTop: htmlCell.style.paddingTop,
                paddingBottom: htmlCell.style.paddingBottom,
                verticalAlign: htmlCell.style.verticalAlign,
            });
            htmlCell.style.paddingTop = '8px';
            htmlCell.style.paddingBottom = '8px';
            htmlCell.style.verticalAlign = 'middle';
        });

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
            scale: 2.5,
            useCORS: true,
            allowTaint: true,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: cardRef.current.scrollWidth,
            windowHeight: cardRef.current.scrollHeight,
        });

        // Geçici stilleri geri al
        tableCells.forEach((cell, index) => {
            const htmlCell = cell as HTMLElement;
            htmlCell.style.paddingTop = originalStyles[index].paddingTop;
            htmlCell.style.paddingBottom = originalStyles[index].paddingBottom;
            htmlCell.style.verticalAlign = originalStyles[index].verticalAlign;
        });

        // Paylaşım butonlarını geri göster
        shareButtons?.forEach((btn, idx) => {
            (btn as HTMLElement).style.display = originalDisplayValues[idx] || '';
        });

        // Orijinal stili geri yükle
        if (originalStyle) {
            cardRef.current.setAttribute('style', originalStyle);
        } else {
            cardRef.current.removeAttribute('style');
        }

        const image = canvas.toDataURL('image/png');

        // Doğrudan indirme
        const link = document.createElement('a');
        link.href = image;
        link.download = brandName + '-Hesaplama.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('indirme işlemi başlatıldı');
    } catch (error) {
        console.error('Resim oluşturulurken bir hata oluştu:', error);
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
        result.paymentSchedule.forEach((item: any) => {
            lines.push(`${item.no} | ${item.payment.toLocaleString('tr-TR')} | ${item.interest.toLocaleString('tr-TR')} | ${item.kkdf.toLocaleString('tr-TR')} | ${item.bsmv.toLocaleString('tr-TR')} | ${item.principal.toLocaleString('tr-TR')} | ${item.remainingPrincipal.toLocaleString('tr-TR')}`);
        });
    }
    lines.push('------------------------');
    lines.push(`Tarih: ${new Date().toLocaleString('tr-TR')}`);
    return lines.join('\n');
}

const CreditResultModal: React.FC<CreditResultModalProps> = ({ open, onClose, result, slipTitle, homemadeTotal, selectedRecipes, quantities, paidAmount }) => {
    if (!open) return null;

    const { t } = useTranslation('translation');
    const slipCardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
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
        downloadAsImageOnly(slipCardRef, document.documentElement.classList.contains('dark'), t('app.brand'));
    };

    // Görsel paylaşım fonksiyonu
    const shareAsImageFunction = () => {
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
                            <div className="font-semibold mb-2 text-center text-base text-gray-800 dark:text-white">Ödeme Planı</div>
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
                                    {result.paymentSchedule.map((item: any) => (
                                        <tr key={item?.no ?? item.id} className={item?.no % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}>
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
                        </div>
                        <div className="w-full flex flex-col items-center mt-4 buttons-container">
                            <button
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-lg shadow border border-violet-200 dark:border-violet-800 mb-3 social-share-buttons"
                                onClick={downloadAsImage}
                            >
                                <Download size={18} className="inline mr-1" /> Görsel Olarak İndir
                            </button>
                            <div className="flex gap-3 justify-center mb-2 social-share-buttons">
                                <button onClick={shareToWhatsApp} className="rounded-full bg-green-500 hover:bg-green-600 p-2 shadow text-white"><FaWhatsapp size={20} /></button>
                                <button onClick={shareToFacebook} className="rounded-full bg-blue-600 hover:bg-blue-700 p-2 shadow text-white"><FaFacebook size={20} /></button>
                                <button onClick={shareToTwitter} className="rounded-full bg-black hover:bg-gray-800 p-2 shadow text-white"><FaXTwitter size={20} /></button>
                                <button onClick={shareAsImageFunction} className="rounded-full bg-violet-600 hover:bg-violet-700 p-2 shadow text-white"><Share2 size={18} className="text-white" /></button>
                                <button onClick={() => copyImageToClipboard(slipCardRef, document.documentElement.classList.contains('dark'), t('app.brand'))} className="rounded-full bg-gray-200 dark:bg-gray-800 p-2 shadow"><Copy size={18} className="text-violet-600" /></button>
                            </div>
                            <div className="text-xs text-gray-400 text-center social-share-buttons">Bazı platformlar doğrudan resim paylaşımını desteklemeyebilir. Bu durumda, resmi indirip manuel olarak paylaşabilirsiniz.</div>
                        </div>
                    </div>
                ) : (
                    <div className="px-6 py-7 flex flex-col items-center" ref={slipCardRef}>
                        {/* Health calculation content */}
                        {isHealthCalculation && (
                            <div className="flex flex-col items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{slipTitle || 'Sağlık Hesaplama Sonucu'}</h3>

                                <div className="text-sm text-gray-600 dark:text-gray-300 w-full whitespace-pre-wrap mt-4">
                                    {slipText.split('\n').map((line, idx) => (
                                        <React.Fragment key={idx}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Food calculation content */}
                        {!isHealthCalculation && !isCreditCalculation && (
                            <>
                                <div className="flex flex-col items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{slipTitle || 'Hesaplama Sonucu'}</h3>

                                    {homemadeTotal !== undefined && selectedRecipes?.length && (
                                        <div className="flex flex-col w-full mt-4 mb-2">
                                            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Fiyat Karşılaştırması</h4>

                                            <div className="flex flex-col gap-2">
                                                {/* Market */}
                                                <div className={`relative border p-3 rounded-lg ${result?.marketTotal <= homemadeTotal ? 'border-green-500 dark:border-green-600' : 'border-gray-200 dark:border-gray-700'}`}>
                                                    <div className="font-medium flex justify-between items-center">
                                                        <div className="flex items-center">
                                                            <span>Marketten Hazır Alma</span>
                                                            {result?.marketTotal <= homemadeTotal && (
                                                                <span className="tick-marker">
                                  <CheckCircle size={24} className="text-green-500 ml-2" />
                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-lg font-bold">{result?.marketTotal?.toLocaleString('tr-TR')} TL</span>
                                                    </div>
                                                    {paidAmount !== undefined && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            Ödenen: {paidAmount?.toLocaleString('tr-TR')} TL
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Homemade */}
                                                <div className={`relative border p-3 rounded-lg ${homemadeTotal <= (result?.marketTotal || Infinity) ? 'border-green-500 dark:border-green-600' : 'border-gray-200 dark:border-gray-700'}`}>
                                                    <div className="font-medium flex justify-between items-center">
                                                        <div className="flex items-center">
                                                            <span>Evde Hazırlama</span>
                                                            {homemadeTotal <= (result?.marketTotal || Infinity) && (
                                                                <span className="tick-marker">
                                  <CheckCircle size={24} className="text-green-500 ml-2" />
                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-lg font-bold">{homemadeTotal?.toLocaleString('tr-TR')} TL</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {selectedRecipes?.length} tarif seçildi -
                                                        {Object.values(quantities || {}).reduce((sum, q) => sum + q, 0)} porsiyon
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-sm text-gray-600 dark:text-gray-300 w-full whitespace-pre-wrap mt-4">
                                        {slipText.split('\n').map((line, idx) => (
                                            <React.Fragment key={idx}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                {selectedRecipes?.length > 0 && (
                                    <div className="w-full mt-3">
                                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                            <Users size={20} className="inline mr-2" /> Seçilen Tarifler
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {selectedRecipes.map((recipe: any) => (
                                                <div key={recipe.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                                                    <div className="font-medium text-gray-800 dark:text-gray-200">{recipe.name}</div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 flex justify-between">
                                                        <span>{(quantities && quantities[recipe.id]) || 1} adet</span>
                                                        <span>{recipe.price?.toLocaleString('tr-TR')} TL</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Paylaşım butonları - tüm modallar için standardize edilmiş */}
                        <div className="w-full flex flex-col items-center mt-4 buttons-container">
                            <button
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-lg shadow border border-violet-200 dark:border-violet-800 mb-3 social-share-buttons"
                                onClick={downloadAsImage}
                            >
                                <Download size={18} className="inline mr-1" /> Görsel Olarak İndir
                            </button>
                            <div className="flex gap-3 justify-center mb-2 social-share-buttons">
                                <button onClick={shareToWhatsApp} className="rounded-full bg-green-500 hover:bg-green-600 p-2 shadow text-white"><FaWhatsapp size={20} /></button>
                                <button onClick={shareToFacebook} className="rounded-full bg-blue-600 hover:bg-blue-700 p-2 shadow text-white"><FaFacebook size={20} /></button>
                                <button onClick={shareToTwitter} className="rounded-full bg-black hover:bg-gray-800 p-2 shadow text-white"><FaXTwitter size={20} /></button>
                                <button onClick={shareAsImageFunction} className="rounded-full bg-violet-600 hover:bg-violet-700 p-2 shadow text-white"><Share2 size={18} className="text-white" /></button>
                                <button onClick={() => copyImageToClipboard(slipCardRef, document.documentElement.classList.contains('dark'), t('app.brand'))} className="rounded-full bg-gray-200 dark:bg-gray-800 p-2 shadow"><Copy size={18} className="text-violet-600" /></button>
                            </div>
                            <div className="text-xs text-gray-400 text-center social-share-buttons">Bazı platformlar doğrudan resim paylaşımını desteklemeyebilir. Bu durumda, resmi indirip manuel olarak paylaşabilirsiniz.</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreditResultModal;
