import React, { useState } from 'react';
import { calculationTypes } from '../data/calculationTypes';
import CalculationTypeCard from './CalculationTypeCard';
import { useTranslation } from 'react-i18next';

interface CalculationTypesGridProps {
  selectedType: string;
  onSelectType: (typeId: string) => void;
}

const CalculationTypesGrid: React.FC<CalculationTypesGridProps> = ({
  selectedType,
  onSelectType
}) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);

  // Seçili kartı başa al
  const sortedTypes = [
    ...calculationTypes.filter(c => c.id === selectedType),
    ...calculationTypes.filter(c => c.id !== selectedType)
  ];

  // Mobilde sadece seçili kart veya tümünü göster
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const visibleTypes = isMobile && !showAll ? [sortedTypes[0]] : sortedTypes;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {t('calculator.types.title')}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Mobilde butonu grid'e kart gibi ekle */}
        {isMobile && (
          <button
            className="rounded-lg p-4 transition-all duration-300 font-bold text-base bg-green-500 text-white shadow-lg col-span-1 flex items-center justify-center"
            style={{ minHeight: 88 }}
            onClick={() => setShowAll(v => !v)}
          >
            {showAll ? t('common.collapse') : t('common.showAll')}
          </button>
        )}
        {visibleTypes.map(calcType => (
          <CalculationTypeCard
            key={calcType.id}
            calcType={calcType}
            isSelected={selectedType === calcType.id}
            onClick={() => onSelectType(calcType.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CalculationTypesGrid;