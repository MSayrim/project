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
          comingSoonDesc: "This calculator will be available soon",
          backToFood: "Back to Food Calculator"
        }
      },
      food: {
        categories: {
          all: "All Items",
          main: "Main Dishes",
          side: "Side Dishes",
          drink: "Drinks",
          dessert: "Desserts"
        },
        calculation: {
          title: "Your Calculation",
          empty: "Your calculation is empty",
          addItems: "Add items from the menu to start calculating",
          subtotal: "Subtotal",
          tax: "Tax (8%)",
          total: "Total",
          save: "Save Calculation",
          compare: "Price Comparison",
          avgMealCost: "Average Meal Cost",
          typicalDinner: "Typical Dinner Cost",
          selectService: "Select a delivery service",
          selectServicePlaceholder: "Choose a delivery service",
          discount: "Discount",
          communicationCommission: "Communication Commission",
          discountCommission: "Discount Commission",
          profit: "Profit",
          commission: "Commission", // Added
          paidAmount: "Paid Amount", // Added
          difference: "Difference", // Added
          selectFirm: "Please select a delivery service before proceeding",
          calculationError: "An error occurred while calculating the price. Please try again.",
          noItemsSelected: "No items selected. Please add items to proceed."
        }
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
          comingSoonDesc: "Bu hesaplayıcı yakında kullanıma sunulacak",
          backToFood: "Yemek Hesaplayıcısına Dön"
        }
      },
      food: {
        categories: {
          all: "Tüm Ürünler",
          main: "Ana Yemekler",
          side: "Yan Yemekler",
          drink: "İçecekler",
          dessert: "Tatlılar"
        },
        calculation: {
          title: "Hesaplamanız",
          empty: "Hesaplamanız boş",
          addItems: "Hesaplamaya başlamak için menüden ürün ekleyin",
          subtotal: "Ara Toplam",
          tax: "KDV",
          total: "Toplam",
          save: "Hesaplamayı Kaydet",
          compare: "Fiyat Karşılaştırması",
          avgMealCost: "Ortalama Yemek Maliyeti",
          typicalDinner: "Tipik Akşam Yemeği Maliyeti",
          selectService: "Bir teslimat servisi seçin",
          selectServicePlaceholder: "Teslimat servisini seçin",
          discount: "İndirim",
          communicationCommission: "İletişim Komisyonu",
          discountCommission: "İndirim Komisyonu",
          profit: "Kar",
          commission: "Komisyon", // Added
          paidAmount: "Ödenen Tutar", // Added
          difference: "Fark", // Added
          selectFirm: "Devam etmeden önce bir teslimat servisi seçmelisiniz",
          calculationError: "Fiyat hesaplanırken bir hata oluştu. Lütfen tekrar deneyin.",
          noItemsSelected: "Hiç ürün seçili değil. Devam etmek için ürün ekleyin."
        }
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
      }
    }
  }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      }
    });

export default i18n;