import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 md:px-2 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-700 active:bg-gray-600 transition-colors w-full justify-start md:w-auto md:justify-center"
    >
      <Globe size={16} />
      <span>{i18n.language.toUpperCase()}</span>
    </button>
  );
};

export default LanguageSelector