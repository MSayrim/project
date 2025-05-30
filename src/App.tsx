import React, { useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import CalculationTypesGrid from './components/CalculationTypesGrid';
import FoodCalculator from './components/FoodCalculator';
import PriceCalculator from './components/PriceCalculator';
import Footer from './components/Footer';
import Advertisement from './components/Advertisement';
import SEO from './components/SEO';
import advertisementImage from './assets/24820303c62033ebaaf0d0dc6748ca7db4a315b5.jpeg';
import advertisementImage2 from './assets/images.jpg';
import CarWashCalculator from './components/CarWashCalculator';
import ClothingComparator from './components/ClothingComparator';
import HealthCalculator from './components/HealthCalculator';
import VehicleFuelComparison from './components/VehicleFuelComparison';
const OnlineSubscriptionCalculator = React.lazy(() => import('./components/OnlineSubscriptionCalculator'));

function App() {
  const [selectedCalculationType, setSelectedCalculationType] = useState('food');
  const { t } = useTranslation();

  // SEO configuration based on selected calculator type
  const getSeoConfig = () => {
    switch (selectedCalculationType) {
      case 'food':
        return {
          title: 'ParamCebimde - Gıda Maliyeti Hesaplama | Akıllı Hesaplama Platformu',
          description: 'Gıda maliyetlerinizi kolayca hesaplayın ve bütçenizi kontrol altında tutun. ParamCebimde ile yemek maliyetlerinizi optimize edin.',
          path: '/food-calculator',
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            'name': 'ParamCebimde Gıda Hesaplama',
            'applicationCategory': 'FinanceApplication',
            'operatingSystem': 'Web',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'TRY'
            }
          }
        };
      case 'finance':
        return {
          title: 'ParamCebimde - Finans Hesaplama | Akıllı Hesaplama Platformu',
          description: 'Finansal hesaplamalarınızı kolayca yapın ve bütçenizi planlayın. ParamCebimde ile finansal geleceğinizi kontrol altına alın.',
          path: '/finance-calculator',
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            'name': 'ParamCebimde Finans Hesaplama',
            'applicationCategory': 'FinanceApplication',
            'operatingSystem': 'Web',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'TRY'
            }
          }
        };
      case 'online-subscription':
        return {
          title: 'ParamCebimde - Online Abonelik Hesaplama | Abonelik Takip Aracı',
          description: 'Tüm online aboneliklerinizin toplam maliyetini hesaplayın ve bütçenizi kontrol altında tutun.',
          path: '/online-subscription-calculator',
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            'name': 'ParamCebimde Online Abonelik Hesaplama',
            'applicationCategory': 'FinanceApplication',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'TRY'
            }
          }
        };
      case 'health-calculator':
        return {
          title: 'ParamCebimde - Sağlık Hesaplayıcı | BMI ve Kalori İhtiyacı',
          description: 'Vücut kitle indeksinizi (BMI) ve günlük kalori ihtiyacınızı hesaplayın. Sağlıklı yaşam için kişisel değerlerinizi takip edin.',
          path: '/health-calculator',
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            'name': 'ParamCebimde Sağlık Hesaplayıcı',
            'applicationCategory': 'HealthApplication',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'TRY'
            }
          }
        };
      case 'vehicle-fuel-comparison':
        return {
          title: 'ParamCebimde - Araç Yakıt Karşılaştırma | Araç Maliyeti Hesaplama',
          description: 'Araç yakıt maliyetlerinizi karşılaştırın ve bütçenizi kontrol altında tutun.',
          path: '/arac-yakit-karsilastirma',
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            'name': 'ParamCebimde Araç Yakıt Karşılaştırma',
            'applicationCategory': 'FinanceApplication',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'TRY'
            }
          }
        };
      default:
        return {
          title: 'ParamCebimde - Akıllı Hesaplama Platformu | Gıda, Finans ve Daha Fazlası',
          description: 'ParamCebimde ile gıda, finans ve seyahat maliyetlerinizi kolayca hesaplayın. Kullanıcı dostu arayüzümüzle bütçenizi kontrol altında tutun.',
          path: '/',
        };
    }
  };

  const seoConfig = getSeoConfig();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <SEO 
        title={seoConfig.title}
        description={seoConfig.description}
        path={seoConfig.path}
        structuredData={seoConfig.structuredData}
      />
      <Header/>
      <main className="max-w-full mx-auto py-8 flex flex-row justify-center items-start relative">
        {/* Sol reklam */}
        <div className="hidden 2xl:block absolute left-0 top-20 w-[320px] ad-w-2000 ad-w-2xl overflow-hidden transition-all duration-300 2xl:ml-8">
          <Advertisement imageUrl={advertisementImage} width={320} height={1080} />
        </div>
        {/* Orta içerik */}
        <div className="flex-1 min-w-0 px-2 sm:px-4 lg:px-8 relative max-w-[1320px] mx-auto xl:mx-[220px] 2xl:mx-[340px]">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-600">
              {t('app.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('app.subtitle')}
            </p>
            <div className="flex justify-center my-6">
              <Advertisement width={728} height={90} imageUrl={advertisementImage2}/>
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
            <Suspense fallback={<div>Yükleniyor...</div>}>
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
          <div className="flex justify-center my-6">
            <Advertisement width={728} height={90} imageUrl={advertisementImage}/>
          </div>
        </div>
        {/* Sağ reklam */}
        <div className="hidden 2xl:block absolute right-0 top-20 w-[320px] ad-w-2000 ad-w-2xl overflow-hidden transition-all duration-300 2xl:mr-8">
          <Advertisement imageUrl={advertisementImage2} width={320} height={1080} />
        </div>
      </main>
      <Footer/>
    </div>
  );
}

export default App;