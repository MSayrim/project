import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-green-400" />
            <span className="text-lg font-bold text-white">CalcMaster</span>
          </div>
          
          <div className="text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} CalcMaster. {t('footer.rights')}</p>
            <p className="text-sm mt-1">{t('footer.description')}</p>
          </div>
          
          <div className="flex items-center gap-1 text-sm">
            <span>{t('footer.madeWith')}</span>
            <Heart size={14} className="text-red-500" />
            <span>{t('footer.forUsers')}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          <div>
            <h3 className="text-white font-medium mb-2">{t('footer.product')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.features')}</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.pricing')}</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.roadmap')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-2">{t('footer.support')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.helpCenter')}</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.contact')}</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.faqs')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-2">{t('footer.company')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.about')}</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.blog')}</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.careers')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-2">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.privacy')}</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.terms')}</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.cookies')}</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;