import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      app: {
        title: "ParamCebimde - Smart Calculation Platform",
        subtitle: "Calculate costs for food and more with our intuitive platform",
        comingSoon: "Coming Soon!"
      },
      nav: {
        myCalculations: "My Calculations",
        history: "History",
        signIn: "Sign In",
        darkMode: "Dark Mode"
      },
      calculator: {
        types: {
          title: "Calculation Types",
          food: "Food Price Calculator",
          finance: "Finance",
          travel: "Travel",
          home: "Home",
          medical: "Medical",
          shopping: "Shopping",
          carwash: "Car Wash Calculator",
          comingSoonDesc: "This calculator will be available soon",
          backToFood: "Back to Food Calculator"
        },
        price: {
          fullPrice: "Full Price",
          discount: "Discount",
          calculating: "Calculating...",
          calculateAndSave: "Calculate and Save"
        }
      },
      carwash: {
        title: "Car Wash Calculator",
        automatic: "Automatic Wash",
        token: "Token Wash",
        electricity: "Electricity (kWh)",
        electricityPrice: "Electricity Unit Price (₺/kWh)",
        water: "Water (Litre)",
        waterPrice: "Water Unit Price (₺/Litre)",
        foam: "Foam (ml)",
        foamPrice: "Foam Unit Price (₺/ml)",
        tokenCount: "Token Count",
        tokenPrice: "Token Price (₺)",
        tokenDuration: "Token Duration (min)",
        autoFixedPrice: "Fixed Cost (₺)",
        autoSalePrice: "Sale Price (₺)",
        personnel: "Personnel Cost (₺)",
        calculate: "Calculate",
        ownCost: "Your Own Cost",
        tokenTotal: "Total Token Price",
        fark: "Difference",
        results: "Results"
      },
      food: {
        title: "Food Prices and Calculator",
        types: {
          all: "All",
          main: "Main Dishes",
          side: "Side Dishes",
          drink: "Drinks",
          dessert: "Desserts"
        },
        categories: {
          all: "All Items",
          main: "Main Dishes",
          side: "Side Dishes",
          drink: "Drinks",
          dessert: "Desserts",
          selected: "Selected Items",
          search: "Search items..."
        },
        calculation: {
          title: "Your Calculation",
          empty: "Your calculation is empty",
          addItems: "Add items from the menu to start calculating",
          subtotal: "Subtotal",
          service: "Services",
          tax: "Tax (8%)",
          total: "Total",
          priceDifference: "Price Difference",
          commissions: "Commissions",
          save: "Save Calculation",
          compare: "Price Comparison",
          avgMealCost: "Average Meal Cost",
          typicalDinner: "Typical Dinner Cost",
          selectService: "Select a delivery service",
          selectServicePlaceholder: "Choose a delivery service",
          discount: "Discount",
          communicationCommission: "Communication Commission",
          discountCommission: "Discount Commission",
          profit: "Restaurant Profit",
          commission: "Commission",
          paidAmount: "Paid Amount",
          difference: "Difference",
          selectFirm: "Please select a delivery service before proceeding",
          calculationError: "An error occurred while calculating the price. Please try again.",
          noItemsSelected: "No items selected. Please add items to proceed.",
          calculate: "Calculate",
          optional: "Optional: Add items to see detailed calculation",
          paymentInfo: "Payment Information"
        },
        comparison: {
          title: "Price Comparison",
          paid: "Paid Amount",
          homemade: "Homemade Cost",
          difference: "Difference",
          vs: "VS",
          info: "Comparison between what you paid and what it would cost if you made it at home.",
          better: "Better Deal"
        },
        selectedItems: "Selected Items",
        searchPlaceholder: "Search food...",
        hideImages: "Hide Images",
        showImages: "Show Images"
      },
      footer: {
        rights: "All rights reserved.",
        description: "Smart calculation platform for everyday needs",
        madeWith: "Made with",
        forUsers: "for our users",
        product: "Product",
        features: "Features",
        pricing: "Pricing",
        roadmap: "Roadmap",
        support: "Support",
        helpCenter: "Help Center",
        contact: "Contact",
        faqs: "FAQs",
        company: "Company",
        about: "About",
        blog: "Blog",
        careers: "Careers",
        legal: "Legal",
        privacy: "Privacy",
        terms: "Terms",
        cookies: "Cookies"
      },
      theme: {
        switchToLight: "Switch to light mode",
        switchToDark: "Switch to dark mode"
      },
      common: {
        close: "Close",
        previous: "Previous",
        next: "Next",
        product: "product",
        total: "Total",
        selectedProducts: "products selected",
        clear: "Clear"
      },
      clothing: {
        title: "Clothing Comparator",
        compareDesc: "Compare clothes in detail by brand, type and color.",
        brand: "Brand",
        type: "Product Type",
        color: "Color",
        model: "Model",
        link: "Product Link",
        domestic: "Domestic Price",
        foreign: "Foreign Price",
        rate: "Exchange Rate",
        ratePlaceholder: "e.g. 32.50",
        enterAll: "Fill in all fields.",
        buy: "Buy",
        domesticExpensive: "Domestic price is more expensive! Diff: {{diff}}₺ (%{{percent}})",
        foreignExpensive: "Foreign price is more expensive! Diff: {{diff}}₺ (%{{percent}})",
        samePrice: "Prices are equal.",
      }
    }
  },
  tr: {
    translation: {
      app: {
        title: "ParamCebimde - Akıllı Hesaplama Platformu",
        subtitle: "Yemek ve daha fazlası için maliyetleri sezgisel platformumuzla hesaplayın",
        comingSoon: "Çok Yakında!"
      },
      nav: {
        myCalculations: "Hesaplamalarım",
        history: "Geçmiş",
        signIn: "Giriş Yap",
        darkMode: "Karanlık Mod"
      },
      calculator: {
        types: {
          title: "Hesaplama Türleri",
          food: "Yemek Fiyat Hesaplayıcı",
          finance: "Finans",
          travel: "Seyahat",
          home: "Ev",
          medical: "Sağlık",
          shopping: "Alışveriş",
          carwash: "Araba Yıkama Hesaplayıcı",
          comingSoonDesc: "Bu hesaplayıcı yakında kullanıma sunulacak",
          backToFood: "Yemek Hesaplayıcısına Dön"
        },
        price: {
          fullPrice: "Tam Fiyat",
          discount: "İndirim",
          calculating: "Hesaplanıyor...",
          calculateAndSave: "Hesapla ve Kaydet"
        }
      },
      carwash: {
        title: "Araba Yıkama Hesaplama",
        automatic: "Otomatik Yıkama",
        token: "Jetonlu Yıkama",
        electricity: "Elektrik (kWh)",
        electricityPrice: "Elektrik Birim Fiyatı (₺/kWh)",
        water: "Su (Litre)",
        waterPrice: "Su Birim Fiyatı (₺/Litre)",
        foam: "Köpük (ml)",
        foamPrice: "Köpük Birim Fiyatı (₺/ml)",
        tokenCount: "Jeton Adedi",
        tokenPrice: "Jeton Fiyatı (₺)",
        tokenDuration: "Jeton Süresi (dk)",
        autoFixedPrice: "Sabit Gider (₺)",
        autoSalePrice: "Satış Fiyatı (₺)",
        personnel: "Personel Gideri (₺)",
        calculate: "Hesapla",
        ownCost: "Kendi Maliyetiniz",
        tokenTotal: "Toplam Jeton Fiyatı",
        fark: "Fark",
        results: "Sonuçlar"
      },
      food: {
        title: "Yemek Fiyatları ve Hesaplama",
        types: {
          all: "Tümü",
          main: "Ana Yemekler",
          side: "Yan Yemekler",
          drink: "İçecekler",
          dessert: "Tatlılar"
        },
        categories: {
          all: "Tüm Ürünler",
          main: "Ana Yemekler",
          side: "Yan Yemekler",
          drink: "İçecekler",
          dessert: "Tatlılar",
          selected: "Seçilenler",
          search: "Ürün ara..."
        },
        calculation: {
          title: "Hesaplamanız",
          empty: "Hesaplamanız boş",
          addItems: "Hesaplamaya başlamak için menüden ürün ekleyin",
          subtotal: "Ara Toplam",
          tax: "KDV",
          total: "Toplam",
          priceDifference: "Fiyat Farkı",
          commissions: "Komisyonlar",
          save: "Hesaplamayı Kaydet",
          compare: "Fiyat Karşılaştırması",
          avgMealCost: "Ortalama Yemek Maliyeti",
          typicalDinner: "Tipik Akşam Yemeği Maliyeti",
          selectService: "Bir teslimat servisi seçin",
          selectServicePlaceholder: "Teslimat servisini seçin",
          discount: "İndirim",
          communicationCommission: "İletişim Komisyonu",
          discountCommission: "İndirim Komisyonu",
          service: "Servis",
          profit: "Restoran Kârı",
          commission: "Komisyon",
          paidAmount: "Ödenen Tutar",
          difference: "Fark",
          selectFirm: "Devam etmeden önce bir teslimat servisi seçmelisiniz",
          calculationError: "Fiyat hesaplanırken bir hata oluştu. Lütfen tekrar deneyin.",
          noItemsSelected: "Hiç ürün seçili değil. Devam etmek için ürün ekleyin.",
          calculate: "Hesapla",
          optional: "İsteğe bağlı: Detaylı hesaplama için ürün ekleyin",
          paymentInfo: "Ödeme Bilgileri",
          selectedMeals: "Seçilen Yemekler",
          homemadeTotal: "Ev yapımı maliyeti toplamı:",
          emptyMenu: "Henüz menüye yemek eklenmedi.",
          joker: "Joker",
          info: "Tarifi Gör",
          restaurantProfit: "Restoran Kârı",
          slipTitle: "Yemek Hesaplama Sonucu"
        },
        recipe: {
          info: "Tarifi Gör"
        },
        comparison: {
          title: "Fiyat Karşılaştırması",
          paid: "Ödenen Tutar",
          homemade: "Evde Yapsan",
          difference: "Fark",
          vs: "VS",
          info: "Ödediğiniz tutar ile evde yapsaydınız ne kadar olurdu karşılaştırması.",
          better: "Daha Avantajlı"
        },
        selectedItems: "Seçilen Ürünler",
        searchPlaceholder: "Yemek ara...",
        hideImages: "Resimleri Gizle",
        showImages: "Resimleri Göster"
      },
      footer: {
        rights: "Tüm hakları saklıdır.",
        description: "Günlük ihtiyaçlar için akıllı hesaplama platformu",
        madeWith: "Sevgiyle",
        forUsers: "kullanıcılarımız için yapıldı",
        product: "Ürün",
        features: "Özellikler",
        pricing: "Fiyatlandırma",
        roadmap: "Yol Haritası",
        support: "Destek",
        helpCenter: "Yardım Merkezi",
        contact: "İletişim",
        faqs: "SSS",
        company: "Şirket",
        about: "Hakkımızda",
        blog: "Blog",
        careers: "Kariyer",
        legal: "Yasal",
        privacy: "Gizlilik",
        terms: "Kullanım Koşulları",
        cookies: "Çerezler"
      },
      theme: {
        switchToLight: "Açık temaya geç",
        switchToDark: "Koyu temaya geç"
      },
      common: {
        close: "Kapat",
        previous: "Önceki",
        next: "Sonraki",
        product: "ürün",
        total: "Toplam",
        selectedProducts: "ürün seçildi",
        clear: "Temizle"
      },
      clothing: {
        title: "Kıyafet Karşılaştırıcı",
        compareDesc: "Marka, ürün tipi ve renk ile detaylı kıyafet karşılaştır.",
        brand: "Marka",
        type: "Ürün Tipi",
        color: "Renk",
        model: "Model",
        link: "Ürün Linki",
        domestic: "Yurt İçi Fiyat",
        foreign: "Yurt Dışı Fiyat",
        rate: "Döviz Kuru",
        ratePlaceholder: "Örn. 32.50",
        enterAll: "Tüm alanları doldurun.",
        buy: "Satın Al",
        domesticExpensive: "Yurt içi fiyatı daha pahalı! Fark: {{diff}}₺ (%{{percent}})",
        foreignExpensive: "Yurt dışı fiyatı daha pahalı! Fark: {{diff}}₺ (%{{percent}})",
        samePrice: "Fiyatlar eşit.",
      }
    }
  }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'tr',
      interpolation: {
        escapeValue: false
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      }
    });

export default i18n;