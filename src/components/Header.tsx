import React, { useState } from 'react';
import { Calculator, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calculator className="h-8 w-8 text-green-400" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">CalcMaster</h1>
        </div>
        
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-200 hover:text-white focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        <nav className={`absolute md:relative top-16 left-0 right-0 z-50 bg-gray-800 md:bg-transparent 
                        ${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-1 md:gap-4 p-4 md:p-0 
                        shadow-lg md:shadow-none`}>
          <button className="text-white bg-transparent hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
            {t('nav.myCalculations')}
          </button>
          <button className="text-white bg-transparent hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
            {t('nav.history')}
          </button>
          <LanguageSelector />
          <ThemeToggle />
          <button className="text-green-400 hover:text-green-300 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
            {t('nav.signIn')}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header