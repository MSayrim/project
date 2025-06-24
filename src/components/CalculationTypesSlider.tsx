import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { calculationTypes } from '../data/calculationTypes';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CalculationTypeCard from './CalculationTypeCard';

interface CalculationTypesSliderProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

const CalculationTypesSlider: React.FC<CalculationTypesSliderProps> = ({
  selectedType,
  onSelectType,
}) => {
  const { t } = useTranslation();
  const totalTypes = calculationTypes.length;
  
  // Current position in the carousel rotation
  const [rotationIndex, setRotationIndex] = useState(0);
  
  // Get the active index
  const activeIndex = calculationTypes.findIndex(c => c.id === selectedType);
  
  // Reset rotation when the selected type changes
  useEffect(() => {
    setRotationIndex(0);
  }, [selectedType]);
  
  // Generate the 5 positions array with active always in the middle
  const getDisplayCards = () => {
    // Handle edge case where there are fewer than 5 calculation types
    if (totalTypes <= 5) {
      return calculationTypes.map((type, index) => ({
        type,
        isActive: type.id === selectedType
      }));
    }
    
    // Calculate the indices for the 5 visible cards with active in the middle
    const result = [];
    
    // Always place the active card in the middle (position 2)
    result[2] = {
      type: calculationTypes[activeIndex],
      isActive: true
    };
    
    // Calculate the left side cards (positions 0 and 1)
    for (let i = 0; i < 2; i++) {
      const offset = (i + 1 + rotationIndex);
      const index = (activeIndex - offset + totalTypes) % totalTypes;
      result[i] = {
        type: calculationTypes[index],
        isActive: false
      };
    }
    
    // Calculate the right side cards (positions 3 and 4)
    for (let i = 0; i < 2; i++) {
      const offset = (i + 1 + rotationIndex);
      const index = (activeIndex + offset) % totalTypes;
      result[i + 3] = {
        type: calculationTypes[index],
        isActive: false
      };
    }
    
    return result;
  };

  const handleCardClick = (typeId: string) => {
    if (typeId !== selectedType) {
      onSelectType(typeId);
    }
  };

  const moveLeft = () => {
    setRotationIndex((prev) => (prev + 1) % (totalTypes - 1));
  };

  const moveRight = () => {
    setRotationIndex((prev) => (prev - 1 + totalTypes - 1) % (totalTypes - 1));
  };

  const displayCards = getDisplayCards();

  return (
    <div className="w-full max-w-5xl mx-auto mb-6 relative">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 text-center">
        {t('calculator.types.title', 'Hesaplama Türleri')}
      </h2>

      <div className="overflow-hidden py-4">
        <div className="flex items-center justify-center gap-8" style={{ height: '160px' }}>
          {displayCards.map((card, position) => (
            <div 
              className={`
                flex-[0_0_auto] flex items-center justify-center transition-all duration-300
                ${card.isActive ? 'z-10 scale-110' : 'opacity-70'}
              `}
              style={{ 
                height: '120px', 
                width: '202px',
                transform: card.isActive ? 'translateY(-5px)' : 'none'
              }}
              key={`${card.type.id}-${position}`}
            >
              <CalculationTypeCard
                calcType={card.type}
                isSelected={card.isActive}
                onClick={() => handleCardClick(card.type.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={moveLeft} 
        className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-4 bg-gray-800/50 hover:bg-gray-900/70 p-2 rounded-full z-10 text-white transition-all duration-300"
        aria-label={t('common.previous')}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={moveRight} 
        className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-4 bg-gray-800/50 hover:bg-gray-900/70 p-2 rounded-full z-10 text-white transition-all duration-300"
        aria-label={t('common.next')}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default CalculationTypesSlider;
