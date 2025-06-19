import React, { useState, useEffect } from 'react';
import { calculationTypes } from '../data/calculationTypes';
import CalculationTypeCard from './CalculationTypeCard';
import { useTranslation } from 'react-i18next';

interface CalculationTypesSliderProps {
  selectedType: string;
  onSelectType: (typeId: string) => void;
}

const CalculationTypesSlider: React.FC<CalculationTypesSliderProps> = ({
  selectedType,
  onSelectType
}) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Ekran boyutu değişikliğini izle
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Görüntülenecek kart sayısı
  const visibleCount = isMobile ? 1 : 5;
  
  // Önceki kartlara git
  const goToPrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  
  // Sonraki kartlara git
  const goToNext = () => {
    setCurrentIndex(prev => Math.min(calculationTypes.length - visibleCount, prev + 1));
  };
  
  // Görünür kartları al
  const visibleTypes = calculationTypes.slice(currentIndex, currentIndex + visibleCount);
  
  const dotCount = Math.ceil(calculationTypes.length / visibleCount);
  
  return (
    <div className="mt-8 w-full">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {t('calculator.types.title', 'Hesaplama Türleri')}
      </h2>
      
      <div className="flex items-center justify-center w-full">
        <button 
          onClick={goToPrev} 
          disabled={currentIndex <= 0}
          className={`p-2 mr-1 rounded-full ${currentIndex <= 0 ? 'invisible' : 'visible'}`}
          aria-label="Önceki"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div 
          className="flex flex-row gap-2 justify-center"
          style={{
            maxWidth: isMobile ? '300px' : '1000px',
            margin: '0 auto'
          }}
        >
          {visibleTypes.map(calcType => (
            <div 
              key={calcType.id}
              style={{ 
                flex: `0 0 ${100/visibleCount}%`,
                maxWidth: `${100/visibleCount}%`,
                padding: '0 4px' 
              }}
            >
              <CalculationTypeCard
                calcType={calcType}
                isSelected={selectedType === calcType.id}
                onClick={() => onSelectType(calcType.id)}
              />
            </div>
          ))}
        </div>
        
        <button 
          onClick={goToNext} 
          disabled={currentIndex >= calculationTypes.length - visibleCount}
          className={`p-2 ml-1 rounded-full ${currentIndex >= calculationTypes.length - visibleCount ? 'invisible' : 'visible'}`}
          aria-label="Sonraki"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* İlerleme göstergesi */}
      <div className="flex justify-center mt-2 gap-1">
        {Array.from({ length: dotCount }).map((_, idx) => (
          <button 
            key={idx}
            className={`w-2 h-2 rounded-full ${Math.floor(currentIndex / visibleCount) === idx ? 'bg-blue-600' : 'bg-gray-300'}`}
            onClick={() => setCurrentIndex(idx * visibleCount)}
            aria-label={`Sayfa ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CalculationTypesSlider;
