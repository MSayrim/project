import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 md:px-2 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-700 active:bg-gray-600 transition-colors w-full justify-start md:w-auto md:justify-center"
      aria-label={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export default ThemeToggle