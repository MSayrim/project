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
    id: 'home',
    name: 'calculator.types.home',
    icon: 'Home',
    available: false,
    description: 'Coming soon - Home maintenance calculations'
  },
  {
    id: 'medical',
    name: 'calculator.types.medical',
    icon: 'Medical',
    available: false,
    description: 'Coming soon - Health cost estimates'
  },
  {
    id: 'shopping',
    name: 'calculator.types.shopping',
    icon: 'ShoppingBag',
    available: false,
    description: 'Coming soon - Shopping budget calculator'
  }
];