import React, { useState, lazy, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import CalculationTypesGrid from './components/CalculationTypesGrid';
import FoodCalculator from './components/FoodCalculator';
import PriceCalculator from './components/PriceCalculator';
import Footer from './components/Footer';
import Advertisement from './components/Advertisement';
import SEO from './components/SEO';
import FeedbackButton from './components/FeedbackButton';
import advertisementImage from './assets/24820303c62033ebaaf0d0dc6748ca7db4a315b5.jpeg';
import advertisementImage2 from './assets/images.jpg';
import CarWashCalculator from './components/CarWashCalculator';
import ClothingComparator from './components/ClothingComparator';
import HealthCalculator from './components/HealthCalculator';
import VehicleFuelComparison from './components/VehicleFuelComparison';
import { Capacitor } from '@capacitor/core';
const OnlineSubscriptionCalculator = React.lazy(() => import('./components/OnlineSubscriptionCalculator'));
const AdminPage = React.lazy(() => import('./components/admin/AdminPage'));

function App() {
  const [selectedCalculationType, setSelectedCalculationType] = useState('food');
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  // Check if current path is admin route
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path === '/admin');
    };
    
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    
    return () => {
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  // Check if running on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || Capacitor.isNativePlatform());
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // SEO configuration based on selected calculator type
  const getSeoConfig = () => {
    switch (selectedCalculationType) {
      case 'food':
        return {
          title: t('seo.food.title'),
          description: t('seo.food.description'),
          path: t('seo.food.path'),
          structuredData: {
            '@context': t('seo.context'),
            '@type': t('seo.softwareApplication'),
            'name': t('seo.food.name'),
            'applicationCategory': t('seo.financeApplication'),
            'operatingSystem': t('seo.web'),
            'offers': {
              '@type': t('seo.offer'),
              'price': '0',
              'priceCurrency': t('seo.try')
            }
          }
        };
      case 'finance':
        return {
          title: t('seo.finance.title'),
          description: t('seo.finance.description'),
          path: t('seo.finance.path'),
          structuredData: {
            '@context': t('seo.context'),
            '@type': t('seo.softwareApplication'),
            'name': t('seo.finance.name'),
            'applicationCategory': t('seo.financeApplication'),
            'operatingSystem': t('seo.web'),
            'offers': {
              '@type': t('seo.offer'),
              'price': '0',
              'priceCurrency': t('seo.try')
            }
          }
        };
      case 'online-subscription':
        return {
          title: t('seo.subscription.title'),
          description: t('seo.subscription.description'),
          path: t('seo.subscription.path'),
          structuredData: {
            '@context': t('seo.context'),
            '@type': t('seo.softwareApplication'),
            'name': t('seo.subscription.name'),
            'applicationCategory': t('seo.financeApplication'),
            'offers': {
              '@type': t('seo.offer'),
              'price': '0',
              'priceCurrency': t('seo.try')
            }
          }
        };
      case 'health-calculator':
        return {
          title: t('seo.health.title'),
          description: t('seo.health.description'),
          path: t('seo.health.path'),
          structuredData: {
            '@context': t('seo.context'),
            '@type': t('seo.softwareApplication'),
            'name': t('seo.health.name'),
            'applicationCategory': t('seo.healthApplication'),
            'offers': {
              '@type': t('seo.offer'),
              'price': '0',
              'priceCurrency': t('seo.try')
            }
          }
        };
      case 'vehicle-fuel-comparison':
        return {
          title: t('seo.vehicleFuel.title'),
          description: t('seo.vehicleFuel.description'),
          path: t('seo.vehicleFuel.path'),
          structuredData: {
            '@context': t('seo.context'),
            '@type': t('seo.softwareApplication'),
            'name': t('seo.vehicleFuel.name'),
            'applicationCategory': t('seo.financeApplication'),
            'offers': {
              '@type': t('seo.offer'),
              'price': '0',
              'priceCurrency': t('seo.try')
            }
          }
        };
      default:
        return {
          title: t('seo.default.title'),
          description: t('seo.default.description'),
          path: t('seo.default.path'),
        };
    }
  };

  const seoConfig = getSeoConfig();

  // If we're on the admin route, render the admin page
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <Suspense fallback={
          <div className="flex justify-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-violet-500 rounded-full border-t-transparent"></div>
          </div>
        }>
          <AdminPage />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <SEO 
        title={seoConfig.title}
        description={seoConfig.description}
        path={seoConfig.path}
        structuredData={seoConfig.structuredData}
      />
      <Header/>
      <main className={`max-w-full mx-auto py-4 md:py-8 flex flex-row justify-center items-start relative ${isMobile ? 'mobile-full-width' : ''}`}>
        {/* Sol reklam - sadece masaüstünde göster */}
        {!isMobile && (
          <div className="hidden 2xl:block absolute left-0 top-20 w-[320px] ad-w-2000 ad-w-2xl overflow-hidden transition-all duration-300 2xl:ml-8">
            <Advertisement imageUrl={advertisementImage} width={320} height={1080} />
          </div>
        )}
        
        {/* Orta içerik */}
        <div className={`flex-1 min-w-0 ${isMobile ? 'px-2' : 'px-2 sm:px-4 lg:px-8'} relative max-w-[1320px] mx-auto ${isMobile ? '' : 'xl:mx-[220px] 2xl:mx-[340px]'}`}>
          <div className="text-center mb-4 md:mb-8">
            <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-600`}>
              {t('app.title')}
            </h1>
            <p className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-600 dark:text-gray-400 max-w-3xl mx-auto`}>
              {t('app.subtitle')}
            </p>
            
            {/* Reklam - mobilde daha küçük */}
            <div className="flex justify-center my-4 md:my-6 overflow-hidden">
              {isMobile ? (
                <Advertisement width={320} height={50} imageUrl={advertisementImage2}/>
              ) : (
                <Advertisement width={728} height={90} imageUrl={advertisementImage2}/>
              )}
            </div>
          </div>
          
          <CalculationTypesGrid
            selectedType={selectedCalculationType}
            onSelectType={setSelectedCalculationType}
          />
          
          {selectedCalculationType === 'food' && <FoodCalculator/>}
          {selectedCalculationType === 'finance' && <PriceCalculator/>}
          {selectedCalculationType === 'carwash' && <CarWashCalculator/>}
          {selectedCalculationType === 'clothing' && <ClothingComparator/>}
          {selectedCalculationType === 'online-subscription' && (
            <Suspense fallback={<div className="flex justify-center p-4">
              <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
            </div>}>
              <OnlineSubscriptionCalculator />
            </Suspense>
          )}
          {selectedCalculationType === 'health-calculator' && (
            <HealthCalculator />
          )}
          {selectedCalculationType === 'vehicle-fuel-comparison' && (
            <VehicleFuelComparison />
          )}
          {!['food', 'finance', 'carwash', 'clothing', 'online-subscription', 'health-calculator', 'vehicle-fuel-comparison'].includes(selectedCalculationType) && (
            <div className={`bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md ${isMobile ? 'p-4' : 'p-8'} mt-6 text-center`}>
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-4`}>{t('app.comingSoon')}</h2>
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
          
          {/* Alt reklam - mobilde daha küçük */}
          <div className="flex justify-center my-4 md:my-6 overflow-hidden">
            {isMobile ? (
              <Advertisement width={320} height={50} imageUrl={advertisementImage}/>
            ) : (
              <Advertisement width={728} height={90} imageUrl={advertisementImage}/>
            )}
          </div>
        </div>
        
        {/* Sağ reklam - sadece masaüstünde göster */}
        {!isMobile && (
          <div className="hidden 2xl:block absolute right-0 top-20 w-[320px] ad-w-2000 ad-w-2xl overflow-hidden transition-all duration-300 2xl:mr-8">
            <Advertisement imageUrl={advertisementImage2} width={320} height={1080} />
          </div>
        )}
      </main>
      <Footer />
      
      {/* Geri bildirim butonu */}
      <FeedbackButton />
    </div>
  );
}

export default App;