import React, { useState } from 'react';
import { Calculator, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 px-6 shadow-md sticky top-0 z-50">
      {/* Main header content row */}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center gap-2 min-w-0">
          <Calculator className="h-8 w-8 text-green-400 flex-shrink-0" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight truncate">
            ParamCebimde
          </h1>
        </div>

        {/* Desktop Navigation (visible on md screens and up) */}
        <nav className="hidden md:flex md:items-center md:gap-1 min-w-0 flex-shrink">
          <button className="text-white bg-transparent hover:bg-gray-700 active:bg-gray-600 px-2 md:px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-shrink">
            {t('nav.myCalculations')}
          </button>
          <button className="text-white bg-transparent hover:bg-gray-700 active:bg-gray-600 px-2 md:px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-shrink">
            {t('nav.history')}
          </button>
          <LanguageSelector />
          <ThemeToggle />
          <button className="text-green-400 hover:text-green-300 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 px-2 md:px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-shrink">
            {t('nav.signIn')}
          </button>
        </nav>

        {/* Mobile Menu Toggle Button (visible on screens smaller than md) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-200 hover:text-white focus:outline-none"
            aria-label={isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu (conditionally rendered) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-40 bg-gray-800 shadow-lg rounded-b-md">
          <nav className="flex flex-col gap-1 p-4">
            <button className="text-white bg-transparent hover:bg-gray-700 active:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left w-full">
              {t('nav.myCalculations')}
            </button>
            <button className="text-white bg-transparent hover:bg-gray-700 active:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left w-full">
              {t('nav.history')}
            </button>
            {/* For LanguageSelector and ThemeToggle, ensure they expand or align well in vertical mobile menu */}
            <div className="mt-1 mb-1 border-t border-gray-700"></div> {/* Optional separator */}
            <div className="w-full"><LanguageSelector /></div>
            <div className="w-full"><ThemeToggle /></div>
            <div className="mt-1 mb-1 border-t border-gray-700"></div> {/* Optional separator */}
            <button className="text-green-400 hover:text-green-300 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left w-full">
              {t('nav.signIn')}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;