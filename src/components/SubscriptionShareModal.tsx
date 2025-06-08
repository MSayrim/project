import React, { forwardRef, useRef } from 'react';
import { X, Download, Share2, Copy } from 'lucide-react';
import { FaWhatsapp, FaXTwitter, FaFacebook } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

const shareUrl = window.location.href;

const SubscriptionShareModal = forwardRef(({
  subscriptions = [],
  totalMonthly = 0,
  totalYearly = 0,
  onClose,
  onDownloadImage
}, ref) => {
  const { t } = useTranslation();
  const cardRef = ref || useRef();
  const shareText = `${t('subscription.title')}\n${t('subscription.monthly')}: ${totalMonthly.toLocaleString('tr-TR', {minimumFractionDigits:2})}₺\n${t('subscription.yearly')}: ${totalYearly.toLocaleString('tr-TR', {minimumFractionDigits:2})}₺`;

  // Görsel oluşturma fonksiyonu
  const generateImage = async () => {
    if (!cardRef.current) return null;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: isDark ? '#111827' : '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const image = canvas.toDataURL('image/png');
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], 'abonelik-ozeti.png', { type: 'image/png' });
      return { image, file };
    } catch (err) {
      console.error(t('subscription.share.imageCreationError'), err);
      return null;
    }
  };

  // Web Share API ile görsel paylaşımı
  const handleWebShare = async () => {
    try {
      const imageData = await generateImage();
      if (!imageData) {
        alert(t('subscription.share.imageCreationError'));
        return;
      }
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [imageData.file] })) {
        await navigator.share({ 
          files: [imageData.file], 
          title: t('subscription.share.title')
        });
      } else {
        alert(t('subscription.share.deviceNotSupported'));
      }
    } catch (err) {
      alert(t('subscription.share.sharingError'));
    }
  };

  // WhatsApp ile görsel paylaşımı
  const handleWhatsAppShare = async () => {
    try {
      const imageData = await generateImage();
      if (!imageData) {
        alert(t('subscription.share.imageCreationError'));
        return;
      }
      
      // WhatsApp Web için doğrudan görsel paylaşımı mümkün değil, bu nedenle
      // Web Share API kullanarak WhatsApp'ı hedefleyeceğiz
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [imageData.file] })) {
        await navigator.share({ 
          files: [imageData.file], 
          title: t('subscription.share.title'),
          text: shareText
        });
      } else {
        // Fallback olarak normal WhatsApp paylaşımı
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank');
      }
    } catch (err) {
      // Hata durumunda normal WhatsApp paylaşımı
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank');
    }
  };

  // X (Twitter) ile görsel paylaşımı
  const handleTwitterShare = async () => {
    try {
      const imageData = await generateImage();
      if (!imageData) {
        alert(t('subscription.share.imageCreationError'));
        return;
      }
      
      // X (Twitter) için görsel paylaşımı - görseli yeni sekmede aç
      // Kullanıcı görseli kaydedip X'e yükleyebilir
      const win = window.open();
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>${t('subscription.share.twitterImageTitle')}</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; text-align: center; background-color: #f8f9fa; }
                img { max-width: 100%; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
                .instructions { margin: 20px auto; max-width: 500px; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
                h2 { color: #000; }
                ol { text-align: left; }
                .button { display: inline-block; background-color: #000; color: white; padding: 10px 20px; border-radius: 30px; text-decoration: none; font-weight: bold; margin-top: 10px; }
              </style>
            </head>
            <body>
              <h2>${t('subscription.share.twitterImageTitle')}</h2>
              <img src="${imageData.image}" alt="${t('subscription.share.title')}" />
              <div class="instructions">
                <h3>${t('subscription.share.howToShare')}:</h3>
                <ol>
                  <li>${t('subscription.share.twitterStep1')}</li>
                  <li>${t('subscription.share.twitterStep2')}</li>
                  <li>${t('subscription.share.twitterStep3')}</li>
                  <li>${t('subscription.share.twitterStep4')}</li>
                </ol>
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}" target="_blank" class="button">${t('subscription.share.openTwitter')}</a>
              </div>
            </body>
          </html>
        `);
        win.document.close();
      } else {
        // Popup engellenirse normal X paylaşımı
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank');
      }
    } catch (err) {
      // Hata durumunda normal X paylaşımı
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank');
    }
  };

  // Facebook ile görsel paylaşımı
  const handleFacebookShare = async () => {
    try {
      const imageData = await generateImage();
      if (!imageData) {
        alert(t('subscription.share.imageCreationError'));
        return;
      }
      
      // Facebook için Web Share API kullanarak paylaşım
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [imageData.file] })) {
        await navigator.share({ 
          files: [imageData.file], 
          title: t('subscription.share.title'),
          text: shareText
        });
      } else {
        // Fallback olarak normal Facebook paylaşımı
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      }
    } catch (err) {
      // Hata durumunda normal Facebook paylaşımı
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText + '\n' + shareUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-0 w-full max-w-md relative animate-fadeInUp border-2 border-violet-200 dark:border-violet-800">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"><X size={22} /></button>
        <div className="flex flex-col items-center pt-6 px-6 pb-2">
          {/* Kart */}
          <div
            ref={cardRef}
            className="w-full rounded-xl p-6 mb-4 bg-white dark:bg-gray-900"
          >
            {/* Başlık ve Tarih */}
            <div className="flex flex-col items-center mb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white font-extrabold text-lg shadow">PC</div>
                <h3 className="text-xl font-extrabold text-violet-700 dark:text-violet-300">ParamCebimde</h3>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString('tr-TR')}</div>
            </div>
            <h2 className="text-center text-violet-700 dark:text-violet-400 font-extrabold text-2xl mb-5 border-b border-gray-200 dark:border-gray-700 pb-2">
              {t('subscription.share.summary')}
            </h2>
            {/* Abonelikler */}
            <div className="mb-4">
              <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{t('subscription.subscriptions')}:</div>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {subscriptions.map((sub, i) => (
                  <li key={i} className="flex justify-between items-center py-2 text-base">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{sub.icon}</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{sub.name}</span>
                      <span className="text-xs text-gray-500">({sub.type})</span>
                    </div>
                    <span className="font-bold text-violet-700 text-lg">{sub.price.toLocaleString('tr-TR', {minimumFractionDigits:2})}₺</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Toplamlar */}
            <div className="p-5 text-center mb-2">
              <div className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{t('subscription.monthly')}</div>
              <div className="text-3xl font-extrabold text-violet-700 dark:text-violet-400 mb-1 tracking-tight drop-shadow">{totalMonthly.toLocaleString('tr-TR', {minimumFractionDigits:2})}₺</div>
              <div className="text-lg font-bold text-violet-600 dark:text-violet-500 mb-1">{t('subscription.yearly')}: {totalYearly.toLocaleString('tr-TR', {minimumFractionDigits:2})}₺</div>
            </div>
            <div className="text-center text-xs text-gray-400 mt-2">
              {t('subscription.calculatedWith')} • {new Date().toLocaleTimeString('tr-TR')}
            </div>
          </div>
          
          {/* Standardized social media sharing and download UI */}
          <div className="flex flex-col gap-3 w-full mt-2 mb-2">
            {/* Primary download button - full width */}
            <button 
              onClick={onDownloadImage}
              className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white text-base font-medium rounded-xl shadow-lg border-2 border-violet-200 dark:border-violet-800 transition flex items-center justify-center gap-2"
            >
              <Download size={20} />
              {t('common.buttons.downloadAsImage')}
            </button>
            
            {/* Social media share buttons in a row */}
            <div className="flex justify-center gap-3 mt-1">
              <button 
                onClick={handleWhatsAppShare}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-md border border-gray-200 dark:border-gray-700"
                title={t('common.buttons.shareWhatsApp')}
                aria-label={t('common.buttons.shareWhatsApp')}
              >
                <FaWhatsapp className="w-6 h-6 text-green-500" />
              </button>
              
              <button 
                onClick={handleTwitterShare}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-md border border-gray-200 dark:border-gray-700"
                title={t('common.buttons.shareTwitter')}
                aria-label={t('common.buttons.shareTwitter')}
              >
                <FaXTwitter className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              </button>
              
              <button 
                onClick={handleFacebookShare}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-md border border-gray-200 dark:border-gray-700"
                title={t('common.buttons.shareFacebook')}
                aria-label={t('common.buttons.shareFacebook')}
              >
                <FaFacebook className="w-6 h-6 text-blue-500" />
              </button>
              
              <button 
                onClick={handleCopy}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-md border border-gray-200 dark:border-gray-700"
                title={t('common.buttons.copyToClipboard')}
                aria-label={t('common.buttons.copyToClipboard')}
              >
                <Copy size={20} />
              </button>
            </div>
            
            <div className="text-xs text-center text-gray-400 mt-1">{t('subscription.share.socialMediaNote')}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SubscriptionShareModal;
