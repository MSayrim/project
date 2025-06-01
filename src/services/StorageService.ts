import { Preferences } from '@capacitor/preferences';

/**
 * Mobil ve web platformları için depolama servisi
 */
export class StorageService {
  /**
   * Veriyi yerel depolamaya kaydeder
   * @param key Anahtar
   * @param value Değer (otomatik olarak JSON'a dönüştürülür)
   */
  static async set(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await Preferences.set({
        key,
        value: jsonValue
      });
    } catch (error) {
      console.error(`Veri kaydedilirken hata oluştu (${key}):`, error);
    }
  }

  /**
   * Veriyi yerel depolamadan okur
   * @param key Anahtar
   * @param defaultValue Varsayılan değer (veri bulunamazsa döndürülür)
   * @returns Okunan değer veya varsayılan değer
   */
  static async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const { value } = await Preferences.get({ key });
      if (value === null) {
        return defaultValue;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Veri okunurken hata oluştu (${key}):`, error);
      return defaultValue;
    }
  }

  /**
   * Belirtilen anahtarı yerel depolamadan siler
   * @param key Anahtar
   */
  static async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      console.error(`Veri silinirken hata oluştu (${key}):`, error);
    }
  }

  /**
   * Tüm anahtarları listeler
   * @returns Anahtar listesi
   */
  static async keys(): Promise<string[]> {
    try {
      const { keys } = await Preferences.keys();
      return keys;
    } catch (error) {
      console.error('Anahtarlar listelenirken hata oluştu:', error);
      return [];
    }
  }

  /**
   * Tüm verileri temizler
   */
  static async clear(): Promise<void> {
    try {
      await Preferences.clear();
    } catch (error) {
      console.error('Veriler temizlenirken hata oluştu:', error);
    }
  }
}
