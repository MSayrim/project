import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  max?: number;
  theme?: 'light' | 'dark' | 'food' | 'primary' | 'green';
  size?: 'sm' | 'md' | 'lg';
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  quantity, 
  onIncrease, 
  onDecrease,
  max = 99,
  theme = 'light',
  size = 'md'
}) => {
  // Tema renkleri - ParamCebimde'nin genel renk şemasına uygun
  const themeStyles = {
    light: {
      decrease: quantity > 0 
        ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
        : 'bg-gray-100 text-gray-400 cursor-not-allowed',
      increase: quantity < max 
        ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
        : 'bg-gray-100 text-gray-400 cursor-not-allowed',
      counter: 'bg-white border-t border-b border-gray-200 text-gray-800'
    },
    dark: {
      decrease: quantity > 0 
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
        : 'bg-gray-800 text-gray-500 cursor-not-allowed',
      increase: quantity < max 
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
        : 'bg-gray-800 text-gray-500 cursor-not-allowed',
      counter: 'bg-gray-800 border-t border-b border-gray-700 text-gray-200'
    },
    food: {
      decrease: quantity > 0 
        ? 'bg-red-500 hover:bg-red-600 text-white' 
        : 'bg-red-300 text-white cursor-not-allowed',
      increase: quantity < max 
        ? 'bg-green-500 hover:bg-green-600 text-white' 
        : 'bg-green-300 text-white cursor-not-allowed',
      counter: 'bg-white border-t border-b border-gray-200 text-gray-800 font-medium'
    },
    primary: {
      decrease: quantity > 0 
        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
        : 'bg-blue-300 text-white cursor-not-allowed',
      increase: quantity < max 
        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
        : 'bg-blue-300 text-white cursor-not-allowed',
      counter: 'bg-white text-gray-800 font-semibold'
    },
    green: {
      decrease: quantity > 0 
        ? 'bg-green-500 hover:bg-green-600 text-white' 
        : 'bg-green-300 text-white cursor-not-allowed',
      increase: quantity < max 
        ? 'bg-green-500 hover:bg-green-600 text-white' 
        : 'bg-green-300 text-white cursor-not-allowed',
      counter: 'bg-white text-gray-800 font-semibold'
    }
  };

  // Boyut stilleri
  const sizeStyles = {
    sm: {
      button: 'w-7 h-7',
      counter: 'w-8 h-7',
      icon: 16
    },
    md: {
      button: 'w-9 h-9',
      counter: 'w-12 h-9',
      icon: 18
    },
    lg: {
      button: 'w-11 h-11',
      counter: 'w-14 h-11',
      icon: 20
    }
  };

  const styles = themeStyles[theme];
  const sizeStyle = sizeStyles[size];

  return (
    <div className="inline-flex items-center rounded-full overflow-hidden shadow-md">
      <button
        onClick={onDecrease}
        disabled={quantity <= 0}
        className={`
          ${sizeStyle.button} flex items-center justify-center 
          ${styles.decrease}
          transition-all duration-200 rounded-l-full
        `}
        aria-label="Azalt"
      >
        <Minus size={sizeStyle.icon} strokeWidth={2.5} />
      </button>
      
      <div className={`${sizeStyle.counter} flex items-center justify-center ${styles.counter}`}>
        {quantity}
      </div>
      
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className={`
          ${sizeStyle.button} flex items-center justify-center
          ${styles.increase}
          transition-all duration-200 rounded-r-full
        `}
        aria-label="Arttır"
      >
        <Plus size={sizeStyle.icon} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default QuantitySelector;