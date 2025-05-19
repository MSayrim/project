import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  max?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  quantity, 
  onIncrease, 
  onDecrease,
  max = 99
}) => {
  return (
    <div className="flex items-center">
      <button
        onClick={onDecrease}
        disabled={quantity <= 0}
        className={`
          w-8 h-8 flex items-center justify-center rounded-l-md 
          ${quantity > 0 
            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
          transition-colors
        `}
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      
      <div className="w-10 h-8 flex items-center justify-center bg-white border-t border-b border-gray-200 text-gray-800">
        {quantity}
      </div>
      
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className={`
          w-8 h-8 flex items-center justify-center rounded-r-md
          ${quantity < max 
            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
          transition-colors
        `}
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantitySelector;