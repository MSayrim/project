import React from 'react';
import { CalculationType } from '../types';
import { LockIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CalculationTypeCardProps {
  calcType: CalculationType;
  isSelected: boolean;
  onClick: () => void;
}

const CalculationTypeCard: React.FC<CalculationTypeCardProps> = ({ 
  calcType, 
  isSelected,
  onClick 
}) => {
  const { t } = useTranslation();
  const IconComponent = (LucideIcons as any)[calcType.icon];

  return (
    <div 
      onClick={calcType.available ? onClick : undefined}
      className={`
        relative rounded-lg p-4 transition-all duration-300 cursor-pointer
        ${calcType.available 
          ? (isSelected 
            ? 'bg-green-500 text-white shadow-lg scale-105' 
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700')
          : 'bg-gray-200 dark:bg-gray-800 opacity-75 cursor-not-allowed'
        }
        flex flex-col items-center justify-center gap-2 min-h-[120px]
      `}
    >
      <div className={`
        rounded-full p-3
        ${isSelected 
          ? 'bg-green-400 text-white' 
          : 'bg-white dark:bg-gray-700 text-green-500'
        }
      `}>
        {IconComponent && <IconComponent size={24} />}
      </div>
      
      <p className="font-medium text-center">{t(calcType.name)}</p>
      
      {!calcType.available && (
        <div className="absolute inset-0 rounded-lg flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="bg-gray-900/80 text-white px-3 py-1 rounded-full flex items-center">
            <LockIcon size={14} className="mr-1" />
            <span className="text-xs">{t('app.comingSoon')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculationTypeCard;