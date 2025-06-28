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
  
  // Get the active index
  const activeIndex = calculationTypes.findIndex(c => c.id === selectedType);
  
  // Current position in the carousel rotation (purely visual, doesn't change the active card)
  const [rotationOffset, setRotationOffset] = useState(0);
  
  // Reset rotation when the selected type changes
  useEffect(() => {
    setRotationOffset(0);
  }, [selectedType]);

  const handleCardClick = (typeId: string) => {
    if (typeId !== selectedType) {
      onSelectType(typeId);
    }
  };

  // Simplified rotation logic for predictable movement
  const moveLeft = () => {
    setRotationOffset((prev) => (prev + 1) % totalTypes);
  };

  const moveRight = () => {
    setRotationOffset((prev) => (prev - 1 + totalTypes) % totalTypes);
  };
  
  // Completely revised slider algorithm with strict checks to ensure absolutely no duplicate cards appear, 
  // while keeping active card centered and rotation smooth.
  const getDisplayCards = () => {
    // Special case for 5 or fewer types
    if (totalTypes <= 5) {
      // Show all cards but ensure active is in the middle
      const result = [];
      const middlePosition = Math.floor(totalTypes / 2);
      
      for (let i = 0; i < totalTypes; i++) {
        let adjustedIndex = (activeIndex - middlePosition + i + totalTypes) % totalTypes;
        result.push({
          type: calculationTypes[adjustedIndex],
          isActive: adjustedIndex === activeIndex
        });
      }
      
      return result;
    }
    
    // For more than 5 cards, enforce a strict no-duplicate policy
    // Using a Set to track which indices we've already used
    const usedIndices = new Set<number>();
    const result = new Array(5);
    
    // Always put active card in the middle (position 2)
    result[2] = {
      type: calculationTypes[activeIndex],
      isActive: true
    };
    usedIndices.add(activeIndex);
    
    // A helper function to get the next available unique index
    const getUniqueIndex = (baseIndex: number, direction: 'left' | 'right'): number => {
      let index = baseIndex;
      let attempts = 0;
      
      // Keep trying until we find an unused index or we've checked all possibilities
      while (usedIndices.has(index) && attempts < totalTypes) {
        if (direction === 'left') {
          // Move left (decrease index, wrap around if needed)
          index = (index - 1 + totalTypes) % totalTypes;
        } else {
          // Move right (increase index, wrap around if needed)
          index = (index + 1) % totalTypes;
        }
        attempts++;
      }
      
      return index;
    };
    
    // Fill left positions (0 and 1) with unique cards
    for (let i = 1; i <= 2; i++) {
      // Calculate the base index for this position
      let baseIndex = (activeIndex - i - rotationOffset + totalTypes) % totalTypes;
      
      // Find a unique index for this position
      const uniqueIndex = getUniqueIndex(baseIndex, 'left');
      
      // Add to result and mark as used
      result[2 - i] = {
        type: calculationTypes[uniqueIndex],
        isActive: false
      };
      usedIndices.add(uniqueIndex);
    }
    
    // Fill right positions (3 and 4) with unique cards
    for (let i = 1; i <= 2; i++) {
      // Calculate the base index for this position
      let baseIndex = (activeIndex + i + rotationOffset) % totalTypes;
      
      // Find a unique index for this position
      const uniqueIndex = getUniqueIndex(baseIndex, 'right');
      
      // Add to result and mark as used
      result[2 + i] = {
        type: calculationTypes[uniqueIndex],
        isActive: false
      };
      usedIndices.add(uniqueIndex);
    }
    
    // Verify all positions have been filled
    for (let i = 0; i < 5; i++) {
      if (!result[i]) {
        // This is a fallback that shouldn't be needed, but just in case
        // Find any unused index
        for (let j = 0; j < totalTypes; j++) {
          if (!usedIndices.has(j)) {
            result[i] = {
              type: calculationTypes[j],
              isActive: false
            };
            break;
          }
        }
      }
    }
    
    return result;
  };

  const displayCards = getDisplayCards();

  return (
    <div className="w-full max-w-6xl mx-auto mb-6 relative px-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 text-center">
        {t('calculator.types.title', 'Hesaplama Türleri')}
      </h2>

      <div className="overflow-hidden py-4">
        <div className="flex items-center justify-center gap-4" style={{ height: '160px' }}>
          {displayCards.map((card, position) => (
            <div 
              className={`
                flex-[0_0_auto] flex items-center justify-center transition-all duration-300
                ${card.isActive ? 'z-10 scale-110' : 'opacity-70'}
              `}
              style={{ 
                height: '120px', 
                width: '190px',
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
        className="absolute top-[55%] -translate-y-1/2 -left-3 md:-left-5 p-1 rounded-full z-20 text-violet-600 dark:text-violet-400 hover:scale-110 hover:text-violet-800 dark:hover:text-violet-300 active:scale-95 transition-all duration-300"
        aria-label={t('common.previous')}
        style={{ 
          filter: "drop-shadow(0 0 6px rgba(0,0,0,0.6)) drop-shadow(0 0 4px rgba(139,92,246,0.8))"
        }}
      >
        <ChevronLeft className="w-10 h-10 stroke-[3.5]" />
      </button>
      <button 
        onClick={moveRight} 
        className="absolute top-[55%] -translate-y-1/2 -right-3 md:-right-5 p-1 rounded-full z-20 text-violet-600 dark:text-violet-400 hover:scale-110 hover:text-violet-800 dark:hover:text-violet-300 active:scale-95 transition-all duration-300"
        aria-label={t('common.next')}
        style={{ 
          filter: "drop-shadow(0 0 6px rgba(0,0,0,0.6)) drop-shadow(0 0 4px rgba(139,92,246,0.8))"
        }}
      >
        <ChevronRight className="w-10 h-10 stroke-[3.5]" />
      </button>
    </div>
  );
};

export default CalculationTypesSlider;
