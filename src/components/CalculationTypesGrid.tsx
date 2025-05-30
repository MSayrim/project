import React from 'react';
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

  // Açık olanlar başa, çok yakında olanlar sona gelsin
  const sortedTypes = [...calculationTypes].sort((a, b) => {
    if (a.available === b.available) return 0;
    return a.available ? -1 : 1;
  });

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {t('calculator.types.title')}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sortedTypes.map(calcType => (
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