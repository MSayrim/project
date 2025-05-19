import React from 'react';
import { calculationTypes } from '../data/calculationTypes';
import CalculationTypeCard from './CalculationTypeCard';

interface CalculationTypesGridProps {
  selectedType: string;
  onSelectType: (typeId: string) => void;
}

const CalculationTypesGrid: React.FC<CalculationTypesGridProps> = ({
  selectedType,
  onSelectType
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Calculation Types
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {calculationTypes.map(calcType => (
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