import { CalculationType } from '../types';

export const calculationTypes: CalculationType[] = [
  {
    id: 'food',
    name: 'calculator.types.food',
    icon: 'Utensils',
    available: true,
    description: 'Calculate food costs for meals, parties, or events'
  },
  {
    id: 'carwash',
    name: 'calculator.types.carwash',
    icon: 'Car',
    available: true,
    description: 'Calculate car wash costs for automatic and token-based systems'
  },
  {
    id: 'clothing',
    name: t => t('clothing.title'),
    icon: 'Shirt',
    available: true,
    description: t => t('clothing.compareDesc'),
  },
  {
    id: 'online-subscription',
    name: 'Online Abonelik Hesaplama',
    icon: 'Wifi',
    available: true,
    description: 'Tüm online aboneliklerinin toplam aylık ve yıllık maliyetini kolayca hesapla.',
  },
  {
    id: 'health-calculator',
    name: 'Sağlık Hesaplayıcı',
    icon: 'Heart',
    available: true,
    description: 'Vücut kitle indeksi (BMI) ve günlük kalori ihtiyacını hesapla.',
  },
  {
    id: 'vehicle-fuel-comparison',
    name: 'Araç Yakıt Karşılaştırma',
    description: 'Elektrikli, benzinli ve dizel araçların kilometre başı yakıt maliyetini karşılaştırın.',
    icon: 'Car',
    category: 'Araç',
    route: '/arac-yakit-karsilastirma',
    keywords: ['araç', 'yakıt', 'elektrikli', 'benzin', 'dizel', 'karşılaştırma', 'maliyet'],
    isActive: true,
    available: true
  },
  {
    id: 'finance',
    name: 'calculator.types.finance',
    icon: 'Calculator',
    available: false,
    description: 'Coming soon - Price and commission calculations'
  },
  {
    id: 'travel',
    name: 'calculator.types.travel',
    icon: 'Plane',
    available: false,
    description: 'Coming soon - Travel cost estimations'
  },
];