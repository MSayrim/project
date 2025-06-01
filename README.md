# ParamCebimde - Akıllı Hesaplama Platformu

ParamCebimde, kullanıcıların çeşitli hesaplamalar yapabilmesini sağlayan kapsamlı bir mobil ve web uygulamasıdır. Gıda maliyeti, finans, araç yakıt karşılaştırması, sağlık hesaplamaları ve daha fazlasını içerir.

## Özellikler

- **Gıda Maliyeti Hesaplama**: Ev yapımı ve dışarıda yemek maliyetlerini karşılaştırın
- **Finans Hesaplamaları**: Finansal hesaplamalar yapın ve bütçenizi planlayın
- **Araç Yakıt Karşılaştırması**: Farklı araçların yakıt maliyetlerini karşılaştırın
- **Sağlık Hesaplayıcı**: BMI, vücut yağ oranı ve günlük kalori ihtiyacınızı hesaplayın
- **Online Abonelik Takibi**: Tüm aboneliklerinizin toplam maliyetini hesaplayın
- **Araba Yıkama Hesaplayıcı**: Araba yıkama maliyetlerini hesaplayın
- **Kıyafet Karşılalaştırıcı**: Kıyafet maliyetlerini karşılaştırın

## Mobil Uygulama

ParamCebimde artık Android ve iOS cihazlarda da kullanılabilir! Mobil uygulama aşağıdaki özelliklere sahiptir:

- Çevrimdışı çalışabilme
- Hesaplama sonuçlarını paylaşma
- Kullanıcı tercihlerini kaydetme
- Doğal mobil deneyim
- Karanlık mod desteği

## Kurulum

### Web Uygulaması

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Üretim için build alın
npm run build
```

### Mobil Uygulama

```bash
# Web uygulamasını build edin
npm run build

# Android ve iOS platformlarına kopyalayın
npx cap copy

# Android Studio'da açın
npx cap open android

# Xcode'da açın (macOS gerektirir)
npx cap open ios
```

## Android Marketine Yükleme

1. Android Studio'da projeyi açın
2. `build.gradle` dosyasında uygulama sürümünü ve kimliğini kontrol edin
3. İmzalama anahtarı oluşturun veya mevcut anahtarı kullanın
4. Üretim APK veya App Bundle oluşturun
5. Google Play Console'a yükleyin

## iOS App Store'a Yükleme

1. Xcode'da projeyi açın
2. Uygulama kimliği ve sürümünü kontrol edin
3. Apple Developer hesabınızı yapılandırın
4. Gerekli sertifikaları ve profilleri ekleyin
5. Uygulamayı archive edin ve App Store Connect'e yükleyin

## Teknolojiler

- React
- TypeScript
- Tailwind CSS
- Capacitor
- Vite
- Redux Toolkit
- Framer Motion
- i18next

## Lisans

Bu proje özel lisans altında dağıtılmaktadır.

## İletişim

ParamCebimde ekibiyle iletişime geçmek için [info@paramcebimde.com](mailto:info@paramcebimde.com) adresine e-posta gönderebilirsiniz.
