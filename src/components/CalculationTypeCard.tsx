import React, { useEffect, useState } from 'react';
import { CalculationType } from '../types';
import { LockIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Seçili karta uygulanan keyframe animasyonu için CSS
const animatedCardStyle = `
@keyframes float {
  0% { transform: translateY(0px) scale(1.05); }
  50% { transform: translateY(-6px) scale(1.05); }
  100% { transform: translateY(0px) scale(1.05); }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(72, 187, 120, 0); }
  100% { box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
}
`;

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
  const [mounted, setMounted] = useState(false);

  // Animasyonu gecikmeyle başlatmak için
  useEffect(() => {
    if (isSelected) {
      const timer = setTimeout(() => {
        setMounted(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setMounted(false);
    }
  }, [isSelected]);

  return (
    <>
      {isSelected && <style dangerouslySetInnerHTML={{ __html: animatedCardStyle }} />}
      <div 
        onClick={calcType.available ? onClick : undefined}
        className={`
          group relative rounded-lg p-4 transition-all duration-300 cursor-pointer
          h-[120px] w-[202px] flex flex-col items-center justify-center
          ${calcType.available 
            ? (isSelected 
              ? `bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg`
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md')
            : 'bg-gray-300 dark:bg-gray-900 opacity-50 select-none'}
        `}
      >
        <div className={`
          transition-transform duration-300 flex flex-col items-center justify-center
          ${calcType.available && !isSelected ? 'group-hover:-translate-y-1' : ''}
          ${isSelected ? (mounted ? 'animate-[float_3s_ease-in-out_infinite] scale-105' : 'scale-105') : ''}
        `}>
          {IconComponent && (
            <div className={`${isSelected && mounted ? 'animate-bounce' : ''}`}>
              <IconComponent size={isSelected ? 28 : 24} className={isSelected ? 'text-white' : ''} />
            </div>
          )}
          <p className={`font-medium text-center mt-2 ${isSelected ? 'font-bold' : ''}`}>
            {typeof calcType.name === 'function' ? calcType.name(t) : t(calcType.name)}
          </p>
        </div>
        
        {/* Seçili kartta parıltı efekti */}
        {isSelected && (
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_linear_infinite] transform -rotate-15"></div>
          </div>
        )}
        
        {!calcType.available && (
          <div className="absolute inset-0 rounded-lg flex items-center justify-center backdrop-blur-sm bg-black/20">
            <div className="bg-gray-900/80 text-white px-3 py-1 rounded-full flex items-center">
              <LockIcon size={14} className="mr-1" />
              <span className="text-xs">{t('app.comingSoon')}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CalculationTypeCard;