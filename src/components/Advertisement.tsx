import React from 'react';
import { useTranslation } from 'react-i18next';

interface AdvertisementProps {
    width: number;
    height: number;
    imageUrl: string; // New prop for image URL
    className?: string;
}

const Advertisement: React.FC<AdvertisementProps> = ({ width, height, imageUrl, className = '' }) => {
    const { t } = useTranslation();
    
    return (
        <div
            className={`bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden ${className}`}
            style={{ width, height }}
        >
            {/* Adding image */}
            <img
                src={imageUrl}
                alt={t('common.advertisement')}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default Advertisement;