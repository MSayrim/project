import React, { forwardRef, useRef } from 'react';
import { X, Download, Share2, CheckCircle } from 'lucide-react';
import { FaWhatsapp, FaXTwitter, FaFacebook } from 'react-icons/fa6';

const shareUrl = window.location.href;

const SubscriptionShareModal = forwardRef(({
  subscriptions = [],
  totalMonthly = 0,
  totalYearly = 0,
  onClose,
  onDownloadImage
}, ref) => {
  const cardRef = ref || useRef();
  const shareText = `Online Abonelik Hesaplama\nAylık: ${totalMonthly.toLocaleString('tr-TR', {minimumFractionDigits:2})}₺\nYıllık: ${totalYearly.toLocaleString('tr-TR', {minimumFractionDigits:2})}₺`;

  // Görsel oluşturma fonksiyonu
  const generateImage = async () => {
    if (!cardRef.current) return null;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const originalStyle = cardRef.current.getAttribute('style');
      cardRef.current.style.background = isDark ? '#181c27' : '#f6f8ff';
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: isDark ? '#181c27' : '#f6f8ff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      if (originalStyle) cardRef.current.setAttribute('style', originalStyle);
      else cardRef.current.removeAttribute('style');
      
      const image = canvas.toDataURL('image/png');
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], 'abonelik-ozeti.png', { type: 'image/png' });
      return { image, file };
    } catch (err) {
      console.error('Görsel oluşturulurken hata:', err);
      return null;
    }
  };

  // Web Share API ile görsel paylaşımı
  const handleWebShare = async () => {
    try {
      const imageData = await generateImage();
      if (!imageData) {
        alert('Görsel oluşturulamadı.');
        return;
      }
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [imageData.file] })) {
        await navigator.share({ 
          files: [imageData.file], 
          title: 'ParamCebimde Abonelik Özeti'
        });
      } else {
        alert('Cihazınız görsel paylaşımını desteklemiyor. Lütfen resmi indirip uygulama üzerinden paylaşın.');
      }
    } catch (err) {
      alert('Görsel paylaşılırken bir hata oluştu.');
    }
  };

  // WhatsApp ile görsel paylaşımı
  const handleWhatsAppShare = async () => {
    try {
      const imageData = await generateImage();
      if (!imageData) {
        alert('Görsel oluşturulamadı.');
        return;
      }
      
      // WhatsApp Web için doğrudan görsel paylaşımı mümkün değil, bu nedenle
      // Web Share API kullanarak WhatsApp'ı hedefleyeceğiz
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [imageData.file] })) {
        await navigator.share({ 
          files: [imageData.file], 
          title: 'ParamCebimde Abonelik Özeti',
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
        alert('Görsel oluşturulamadı.');
        return;
      }
      
      // X (Twitter) için görsel paylaşımı - görseli yeni sekmede aç
      // Kullanıcı görseli kaydedip X'e yükleyebilir
      const win = window.open();
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>X için Paylaşım Görseli</title>
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
              <h2>X için Paylaşım Görseli</h2>
              <img src="${imageData.image}" alt="ParamCebimde Abonelik Özeti" />
              <div class="instructions">
                <h3>Nasıl Paylaşılır:</h3>
                <ol>
                  <li>Yukarıdaki görsele sağ tıklayıp "Resmi Farklı Kaydet" seçeneğini seçin</li>
                  <li>X'e gidin ve yeni bir post oluşturun</li>
                  <li>Post oluşturma alanında resim ikonuna tıklayın</li>
                  <li>Kaydettiğiniz görseli seçin ve paylaşın</li>
                </ol>
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}" target="_blank" class="button">X'i Aç</a>
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
        alert('Görsel oluşturulamadı.');
        return;
      }
      
      // Facebook için Web Share API kullanarak paylaşım
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [imageData.file] })) {
        await navigator.share({ 
          files: [imageData.file], 
          title: 'ParamCebimde Abonelik Özeti',
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
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-0 w-full max-w-md relative animate-fadeInUp border-2 border-indigo-200 dark:border-indigo-800">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"><X size={22} /></button>
        <div className="flex flex-col items-center pt-6 px-6 pb-2">
          {/* Kart */}
          <div
            ref={cardRef}
            className="w-full rounded-xl p-6 mb-4 border border-indigo-200 dark:border-indigo-800 shadow-lg bg-gradient-to-br from-indigo-100 via-white to-indigo-50 dark:from-indigo-950 dark:via-gray-900 dark:to-indigo-900"
            style={{ backgroundColor: document.documentElement.classList.contains('dark') ? '#181c27' : '#f6f8ff' }}
          >
            {/* Başlık ve Tarih */}
            <div className="flex flex-col items-center mb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-extrabold text-lg shadow">PC</div>
                <h3 className="text-xl font-extrabold text-indigo-700 dark:text-indigo-200">ParamCebimde</h3>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString('tr-TR')}</div>
            </div>
            <h2 className="text-center text-indigo-700 dark:text-indigo-300 font-extrabold text-2xl mb-5 border-b border-gray-200 dark:border-gray-700 pb-2 bg-indigo-50 dark:bg-indigo-900 -mx-6 px-6 py-2 rounded-t-xl">
              Online Abonelik Hesaplama Özeti
            </h2>
            {/* Abonelikler */}
            <div className="mb-4">
              <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Abonelikler:</div>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {subscriptions.map((sub, i) => (
                  <li key={i} className="flex justify-between items-center py-2 text-base">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{sub.icon}</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{sub.name}</span>
                      <span className="text-xs text-gray-500">({sub.type})</span>
                    </div>
                    <span className="font-bold text-indigo-700 text-lg">{sub.price.toLocaleString('tr-TR', {minimumFractionDigits:2})}₺</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Toplamlar */}
            <div className="rounded-xl p-5 text-center mb-2 bg-indigo-50 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-800">
              <div className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Aylık</div>
              <div className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-1 tracking-tight drop-shadow">{totalMonthly.toLocaleString('tr-TR', {minimumFractionDigits:2})}₺</div>
              <div className="text-lg font-bold text-indigo-600 mb-1">Yıllık: {totalYearly.toLocaleString('tr-TR', {minimumFractionDigits:2})}₺</div>
            </div>
            <div className="text-center text-xs text-gray-400 mt-2">
              ParamCebimde ile hesaplandı • {new Date().toLocaleTimeString('tr-TR')}
            </div>
          </div>
          {/* Paylaşım ve indirme butonları */}
          <div className="flex flex-col gap-2 w-full">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 text-lg shadow"
              onClick={onDownloadImage}
              type="button"
            >
              <Download size={20}/> Resim Olarak İndir
            </button>
            <div className="flex flex-row gap-3 justify-center mt-1">
              <button onClick={handleWebShare} className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full flex items-center justify-center text-xl" title="Resim olarak paylaş"><Share2 size={20}/></button>
              <button onClick={handleWhatsAppShare} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full flex items-center justify-center text-xl" title="WhatsApp'ta paylaş"><FaWhatsapp/></button>
              <button onClick={handleTwitterShare} className="bg-black hover:bg-gray-800 text-white p-2 rounded-full flex items-center justify-center text-xl" title="X'te paylaş"><FaXTwitter/></button>
              <button onClick={handleFacebookShare} className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-full flex items-center justify-center text-xl" title="Facebook'ta paylaş"><FaFacebook/></button>
              <button onClick={handleCopy} className="bg-gray-300 hover:bg-gray-400 text-gray-700 p-2 rounded-full flex items-center justify-center text-xl" title="Kopyala"><CheckCircle size={20}/></button>
            </div>
            <div className="text-xs text-center text-gray-400 mt-2">Sosyal medya butonları, destekleyen cihazlarda resim olarak paylaşım yapar. Desteklenmiyorsa metin olarak paylaşılır.</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SubscriptionShareModal;
