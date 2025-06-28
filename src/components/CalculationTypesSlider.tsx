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
  let activeIndex = calculationTypes.findIndex(c => c.id === selectedType);

  // If the selectedType isn't found, default to the first item to prevent a crash.
  if (activeIndex === -1 && totalTypes > 0) {
    activeIndex = 0;
  }
  
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
    if (activeIndex === -1 || totalTypes === 0) {
      return [];
    }

    const displaySize = Math.min(totalTypes, 5);
    const display = new Array(displaySize);
    const usedIndices = new Set();

    if (totalTypes <= 5) {
      const middleIndexInDisplay = Math.floor(totalTypes / 2);
      for (let i = 0; i < totalTypes; i++) {
        const dataIndex = (activeIndex - middleIndexInDisplay + i + totalTypes) % totalTypes;
        display[i] = {
          type: calculationTypes[dataIndex],
          isActive: dataIndex === activeIndex,
        };
      }
      return display;
    }

    // For more than 5 items, ensure active is centered
    display[2] = { type: calculationTypes[activeIndex], isActive: true };
    usedIndices.add(activeIndex);

    // Fill left
    for (let i = 1; i <= 2; i++) {
      let currentIndex = activeIndex - i + rotationOffset;
      currentIndex = ((currentIndex % totalTypes) + totalTypes) % totalTypes;
      while (usedIndices.has(currentIndex)) {
        currentIndex = (currentIndex - 1 + totalTypes) % totalTypes;
      }
      usedIndices.add(currentIndex);
      display[2 - i] = { type: calculationTypes[currentIndex], isActive: false };
    }

    // Fill right
    for (let i = 1; i <= 2; i++) {
      let currentIndex = activeIndex + i + rotationOffset;
      currentIndex = ((currentIndex % totalTypes) + totalTypes) % totalTypes;
      while (usedIndices.has(currentIndex)) {
        currentIndex = (currentIndex + 1) % totalTypes;
      }
      usedIndices.add(currentIndex);
      display[2 + i] = { type: calculationTypes[currentIndex], isActive: false };
    }

    return display;
  };

  const displayCards = getDisplayCards();

  return (
    <div className="w-full max-w-6xl mx-auto mb-6 relative px-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 text-center">
        {t('calculator.types.title', 'Hesaplama Türleri')}
      </h2>

      <div className="overflow-hidden py-4">
        <div className="flex items-center justify-center gap-4" style={{ height: '160px' }}>
          {displayCards.filter(card => card && card.type).map((card, position) => (
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
              key={card.type ? `${card.type.id}-${position}` : `fallback-${position}`}
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
