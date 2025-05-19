import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import CalculationTypesGrid from './components/CalculationTypesGrid';
import FoodCalculator from './components/FoodCalculator';
import PriceCalculator from './components/PriceCalculator';
import Footer from './components/Footer';

function App() {
  const [selectedCalculationType, setSelectedCalculationType] = useState('food');
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-600">
            {t('app.title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('app.subtitle')}
          </p>
        </div>
        
        <CalculationTypesGrid 
          selectedType={selectedCalculationType}
          onSelectType={setSelectedCalculationType}
        />
        
        {selectedCalculationType === 'food' && <FoodCalculator />}
        {selectedCalculationType === 'finance' && <PriceCalculator />}
        
        {!['food', 'finance'].includes(selectedCalculationType) && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md p-8 mt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">{t('app.comingSoon')}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('calculator.types.comingSoonDesc')}
            </p>
            <button 
              onClick={() => setSelectedCalculationType('food')}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {t('calculator.types.backToFood')}
            </button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App