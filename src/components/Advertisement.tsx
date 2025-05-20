import React from 'react';

interface AdvertisementProps {
    width: number;
    height: number;
    imageUrl: string; // Resim URL'si için yeni prop
    className?: string;
}

const Advertisement: React.FC<AdvertisementProps> = ({ width, height, imageUrl, className = '' }) => {
    return (
        <div
            className={`bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden ${className}`}
            style={{ width, height }}
        >
            {/* Resim ekleniyor */}
            <img
                src={imageUrl}
                alt="Advertisement"
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default Advertisement;