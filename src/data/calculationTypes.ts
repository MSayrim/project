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
    name: t => t('calculator.types.subscription'),
    icon: 'Wifi',
    available: true,
    description: t => t('subscription.description'),
  },
  {
    id: 'health-calculator',
    name: t => t('calculator.types.health'),
    icon: 'Heart',
    available: true,
    description: t => t('health.calculator'),
  },
  {
    id: 'vehicle-fuel-comparison',
    name: t => t('calculator.types.vehicle_fuel'),
    description: t => t('calculator.types.vehicle_fuelDesc'),
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
  {
    id: 'credit',
    name: 'Kredi Hesaplama',
    icon: 'CreditCard',
    available: true,
    description: 'Kredi tutarı, vade ve faiz oranına göre aylık taksit ve toplam geri ödeme hesaplama'
  },
];