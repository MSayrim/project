import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import html2canvas from 'html2canvas';

/**
 * Mobil ve web platformları için paylaşım servisi
 */
export class ShareService {
  /**
   * İçeriği metin olarak paylaşır
   * @param title Paylaşım başlığı
   * @param text Paylaşılacak metin
   * @param url Paylaşılacak URL (opsiyonel)
   */
  static async shareText(title: string, text: string, url?: string): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        // Mobil cihazlarda native paylaşım
        await Share.share({
          title,
          text,
          url,
          dialogTitle: 'Paylaş'
        });
      } else {
        // Web tarayıcılarında Web Share API
        if (navigator.share) {
          await navigator.share({
            title,
            text,
            url
          });
        } else {
          // Web Share API desteklenmiyor, kopyala-yapıştır seçeneği sun
          this.copyToClipboard(text + (url ? `\n${url}` : ''));
          alert('Metin panoya kopyalandı. İstediğiniz yerde paylaşabilirsiniz.');
        }
      }
    } catch (error) {
      console.error('Paylaşım sırasında hata oluştu:', error);
    }
  }

  /**
   * HTML elementini görsel olarak paylaşır
   * @param elementId Paylaşılacak HTML elementinin ID'si
   * @param fileName Dosya adı (opsiyonel)
   */
  static async shareElement(elementId: string, fileName = 'paramcebimde-hesaplama.png'): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element bulunamadı: ${elementId}`);
      }

      // HTML elementini görsel olarak yakala
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // Daha yüksek kalite için
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      // Canvas'ı veri URL'sine dönüştür
      const dataUrl = canvas.toDataURL('image/png');

      if (Capacitor.isNativePlatform()) {
        // Mobil cihazlarda görsel paylaşımı
        // Veri URL'sini Blob'a dönüştür
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        
        // Dosyayı geçici olarak kaydet ve paylaş
        const reader = new FileReader();
        reader.onloadend = async function() {
          if (reader.result) {
            await Share.share({
              title: 'ParamCebimde Hesaplama Sonucu',
              files: [dataUrl],
              dialogTitle: 'Hesaplama Sonucunu Paylaş'
            });
          }
        };
        reader.readAsDataURL(blob);
      } else {
        // Web tarayıcılarında görsel indirme
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Görsel paylaşımı sırasında hata oluştu:', error);
    }
  }

  /**
   * Metni panoya kopyalar
   * @param text Kopyalanacak metin
   */
  private static copyToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}
