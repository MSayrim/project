import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import CalculationResultModal from './CalculationResultModal';
import { useTranslation } from 'react-i18next';

// BMI kategorileri ve açıklamaları
const BMI_CATEGORIES = [
  { range: [0, 18.5], name: 'Zayıf', color: 'text-blue-500', description: 'İdeal kilonun altında. Sağlıklı beslenme ve uygun egzersizle kilo almanız önerilir.' },
  { range: [18.5, 24.9], name: 'Normal', color: 'text-green-500', description: 'İdeal kilo aralığındasınız. Bu kiloyu korumak için dengeli beslenmeye ve düzenli egzersize devam edin.' },
  { range: [25, 29.9], name: 'Fazla Kilolu', color: 'text-yellow-500', description: 'İdeal kilonun üzerindesiniz. Dengeli beslenme ve düzenli egzersizle kilo vermeniz önerilir.' },
  { range: [30, 34.9], name: 'Obez (Sınıf I)', color: 'text-orange-500', description: 'Sağlık riskleri artmaktadır. Bir sağlık uzmanı eşliğinde kilo vermeniz önerilir.' },
  { range: [35, 39.9], name: 'Obez (Sınıf II)', color: 'text-red-500', description: 'Ciddi sağlık riskleri bulunmaktadır. Bir sağlık uzmanına başvurmanız önemlidir.' },
  { range: [40, Infinity], name: 'Aşırı Obez (Sınıf III)', color: 'text-red-700', description: 'Çok yüksek sağlık riskleri. Acilen bir sağlık uzmanına başvurmanız gerekir.' }
];

// Aktivite seviyeleri
const ACTIVITY_LEVELS = [
  { id: 'sedentary', name: 'Hareketsiz', factor: 1.2, description: 'Masa başı iş, minimal fiziksel aktivite' },
  { id: 'light', name: 'Az Hareketli', factor: 1.375, description: 'Haftada 1-3 gün hafif egzersiz' },
  { id: 'moderate', name: 'Orta Hareketli', factor: 1.55, description: 'Haftada 3-5 gün orta yoğunlukta egzersiz' },
  { id: 'active', name: 'Çok Hareketli', factor: 1.725, description: 'Haftada 6-7 gün yoğun egzersiz' },
  { id: 'veryActive', name: 'Aşırı Hareketli', factor: 1.9, description: 'Günde iki kez antrenman veya fiziksel iş' }
];

const HealthCalculator: React.FC = () => {
  const { t } = useTranslation();

  // BMI hesaplama state'leri
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<any>(null);

  // Gelişmiş BMI hesaplama state'leri
  const [waist, setWaist] = useState<string>('');
  const [neck, setNeck] = useState<string>('');
  const [hip, setHip] = useState<string>('');
  const [bodyFatPercentage, setBodyFatPercentage] = useState<number | null>(null);
  const [bodyFatCategory, setBodyFatCategory] = useState<string>('');
  const [showAdvancedBmi, setShowAdvancedBmi] = useState<boolean>(false);

  // Paylaşım modalı için state
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Kalori hesaplama state'leri
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('male');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [calories, setCalories] = useState<number | null>(null);

  // Aktif tab
  const [activeTab, setActiveTab] = useState<'bmi' | 'calories'>('bmi');

  // BMI hesaplama
  const calculateBMI = () => {
    if (!height || !weight) return;

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);

    if (isNaN(heightInMeters) || isNaN(weightInKg) || heightInMeters <= 0 || weightInKg <= 0) {
      alert(t('health.invalid_height_weight'));
      return;
    }

    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    setBmi(parseFloat(bmiValue.toFixed(1)));

    // BMI kategorisini bul
    const category = BMI_CATEGORIES.find(
        cat => bmiValue >= cat.range[0] && bmiValue < cat.range[1]
    );

    setBmiCategory(category);
  };

  // Gelişmiş BMI ve vücut yağ oranı hesaplama
  const calculateAdvancedBMI = () => {
    if (!height || !weight || !waist || !neck) return;

    const heightInCm = parseFloat(height);
    const waistInCm = parseFloat(waist);
    const neckInCm = parseFloat(neck);

    if (isNaN(heightInCm) || isNaN(waistInCm) || isNaN(neckInCm) ||
        heightInCm <= 0 || waistInCm <= 0 || neckInCm <= 0) {
      alert(t('health.invalid_measurements'));
      return;
    }

    // Önce normal BMI'yı hesapla
    calculateBMI();

    // ABD Donanması formülü ile vücut yağ oranı hesaplama
    let bodyFat = 0;

    if (gender === 'male') {
      // Erkekler için formül
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistInCm - neckInCm) + 0.15456 * Math.log10(heightInCm)) - 450;
    } else {
      // Kadınlar için formül - kalça ölçüsü gerekli
      const hipInCm = parseFloat(hip);

      if (isNaN(hipInCm) || hipInCm <= 0) {
        alert(t('health.invalid_hip_measurement'));
        return;
      }

      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistInCm + hipInCm - neckInCm) + 0.22100 * Math.log10(heightInCm)) - 450;
    }

    // Sonucu 2 ondalık basamağa yuvarla
    bodyFat = parseFloat(bodyFat.toFixed(1));
    setBodyFatPercentage(bodyFat);

    // Vücut yağ oranı kategorisini belirle
    if (gender === 'male') {
      if (bodyFat < 6) setBodyFatCategory(t('health.essential_fat'));
      else if (bodyFat < 14) setBodyFatCategory(t('health.athletic'));
      else if (bodyFat < 18) setBodyFatCategory(t('health.fitness'));
      else if (bodyFat < 25) setBodyFatCategory(t('health.normal'));
      else setBodyFatCategory(t('health.overweight'));
    } else {
      if (bodyFat < 16) setBodyFatCategory(t('health.essential_fat'));
      else if (bodyFat < 24) setBodyFatCategory(t('health.athletic'));
      else if (bodyFat < 31) setBodyFatCategory(t('health.fitness'));
      else if (bodyFat < 36) setBodyFatCategory(t('health.normal'));
      else setBodyFatCategory(t('health.overweight'));
    }
  };

  // Kalori ihtiyacı hesaplama
  const calculateCalories = () => {
    if (!age || !gender || !height || !weight || !activityLevel) return;

    const ageValue = parseFloat(age);
    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);

    if (isNaN(ageValue) || isNaN(heightValue) || isNaN(weightValue) ||
        ageValue <= 0 || heightValue <= 0 || weightValue <= 0) {
      alert(t('health.invalid_input'));
      return;
    }

    // Harris-Benedict denklemi
    let bmr = 0;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weightValue) + (4.799 * heightValue) - (5.677 * ageValue);
    } else {
      bmr = 447.593 + (9.247 * weightValue) + (3.098 * heightValue) - (4.330 * ageValue);
    }

    // Aktivite faktörü
    const activityFactor = ACTIVITY_LEVELS.find(level => level.id === activityLevel)?.factor || 1.55;
    const dailyCalories = bmr * activityFactor;

    setCalories(Math.round(dailyCalories));
  };

  return (
      <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
          <BarChart3 className="inline-block mr-2" /> {t('health.calculator')}
        </h2>

        {/* Tab Seçimi */}
        <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
              className={`flex-1 py-2 rounded-lg flex items-center justify-center ${
                  activeTab === 'bmi'
                      ? 'bg-indigo-500 text-white font-medium shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveTab('bmi')}
          >
            <BarChart3 className="mr-2 h-5 w-5" /> {t('health.bmi')}
          </button>
          <button
              className={`flex-1 py-2 rounded-lg flex items-center justify-center ${
                  activeTab === 'calories'
                      ? 'bg-indigo-500 text-white font-medium shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveTab('calories')}
          >
            <BarChart3 className="mr-2 h-5 w-5" /> {t('health.calorie_need')}
          </button>
        </div>

        {/* BMI Hesaplama */}
        {activeTab === 'bmi' && (
            <div className="space-y-6">
              <div className="flex justify-end mb-2">
                <button
                    className={`flex items-center text-sm px-3 py-1 rounded-lg ${
                        showAdvancedBmi
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => setShowAdvancedBmi(!showAdvancedBmi)}
                >
                  <BarChart3 className="mr-1 h-4 w-4" />
                  {showAdvancedBmi ? t('health.simple_calculation') : t('health.advanced_calculation')}
                </button>
              </div>

              {!showAdvancedBmi ? (
                  // Basit BMI Hesaplama
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-gray-700 dark:text-gray-300 font-medium">{t('health.height')}</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            placeholder={t('health.height_placeholder')}
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-gray-700 dark:text-gray-300 font-medium">{t('health.weight')}</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            placeholder={t('health.weight_placeholder')}
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-200"
                        onClick={calculateBMI}
                    >
                      {t('health.calculate_bmi')}
                    </button>
                  </>
              ) : (
                  // Gelişmiş BMI Hesaplama
                  <>
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mb-4">
                      <p className="text-sm text-indigo-700 dark:text-indigo-300">
                        {t('health.body_fat_description')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="block text-gray-700 dark:text-gray-300 font-medium">{t('health.height')}</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            placeholder={t('health.height_placeholder')}
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-gray-700 dark:text-gray-300 font-medium">{t('health.weight')}</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            placeholder={t('health.weight_placeholder')}
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="block text-gray-700 dark:text-gray-300 font-medium">{t('health.gender')}</label>
                        <div className="flex space-x-4">
                          <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-indigo-600"
                                name="gender"
                                value="male"
                                checked={gender === 'male'}
                                onChange={() => setGender('male')}
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">{t('health.male')}</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-indigo-600"
                                name="gender"
                                value="female"
                                checked={gender === 'female'}
                                onChange={() => setGender('female')}
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">{t('health.female')}</span>
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-gray-700 dark:text-gray-300 font-medium">{t('health.neck')}</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            placeholder={t('health.neck_placeholder')}
                            value={neck}
                            onChange={(e) => setNeck(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="block text-gray-700 dark:text-gray-300 font-medium">{t('health.waist')}</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            placeholder={t('health.waist_placeholder')}
                            value={waist}
                            onChange={(e) => setWaist(e.target.value)}
                        />
                      </div>
                      {gender === 'female' && (
                          <div className="space-y-2">
                            <label className="block text-gray-700 dark:text-gray-300 font-medium">{t('health.hip')}</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                placeholder={t('health.hip_placeholder')}
                                value={hip}
                                onChange={(e) => setHip(e.target.value)}
                            />
                          </div>
                      )}
                    </div>

                    <button
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-200"
                        onClick={calculateAdvancedBMI}
                    >
                      {t('health.calculate_body_fat')}
                    </button>
                  </>
              )}

              {/* BMI Sonucu */}
              {bmi !== null && bmiCategory && !showAdvancedBmi && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <h3 className="text-xl font-bold text-center mb-4">Sonuç</h3>
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold mb-2">{bmi}</div>
                    <div className={`text-xl font-semibold ${bmiCategory.color}`}>{bmiCategory.name}</div>
                    <p className="text-gray-600 dark:text-gray-300 text-center mt-4">{bmiCategory.description}</p>

                    {/* BMI Çizelgesi/Barı */}
                    <div className="w-full mt-6">
                      <div className="relative h-8 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        {BMI_CATEGORIES.map((category, index) => {
                          const width = index === 0 
                            ? (Math.min(category.range[1], 50) / 50) * 100
                            : ((Math.min(category.range[1], 50) - category.range[0]) / 50) * 100;
                          const categoryWidth = category.range[1] === Infinity 
                            ? 100 - ((category.range[0] / 50) * 100)
                            : width;
                          return (
                            <div
                              key={index}
                              className={`absolute h-full transition-all duration-300`}
                              style={{
                                left: `${(category.range[0] / 50) * 100}%`,
                                width: `${categoryWidth}%`,
                                backgroundColor: category.color.replace('text-', 'bg-')
                              }}
                            />
                          );
                        })}
                        {/* BMI göstergesi */}
                        {bmi && (
                          <div 
                            className="absolute w-4 h-8 bg-white border-2 border-gray-800 rounded-full"
                            style={{ 
                              left: `${Math.min((bmi / 50) * 100, 100)}%`, 
                              transform: 'translateX(-50%)' 
                            }}
                          />
                        )}
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>0</span>
                        <span>10</span>
                        <span>20</span>
                        <span>30</span>
                        <span>40</span>
                        <span>50+</span>
                      </div>
                    </div>

                    {/* Sonucu Paylaş Butonu */}
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="mt-6 w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <span className="mr-2">Sonucumu Paylaş</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                    </button>
                  </div>
                </motion.div>
              )}
              {bmi !== null && bmiCategory && showAdvancedBmi && bodyFatPercentage !== null && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <h3 className="text-xl font-bold text-center mb-4">Sonuç</h3>
                  <div className="flex flex-col items-center">
                    <div className="mt-2 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg w-full">
                      <h4 className="text-lg font-semibold text-center mb-2">Vücut Yağ Oranı</h4>
                      <div className="flex flex-col items-center">
                        <div className="text-5xl font-bold mb-1 text-indigo-600 dark:text-indigo-400">
                          %{bodyFatPercentage}
                        </div>
                        <div className="text-xl font-medium text-indigo-700 dark:text-indigo-300">
                          {bodyFatCategory}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
                          Bu değer, ABD Donanması formülü kullanılarak hesaplanmıştır ve yaklaşık bir tahmindir.
                        </p>
                      </div>
                    </div>

                    {/* BMI Çizelgesi/Barı */}
                    <div className="w-full mt-6">
                      <div className="relative h-8 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        {BMI_CATEGORIES.map((category, index) => {
                          const width = index === 0 
                            ? (Math.min(category.range[1], 50) / 50) * 100
                            : ((Math.min(category.range[1], 50) - category.range[0]) / 50) * 100;
                          const categoryWidth = category.range[1] === Infinity 
                            ? 100 - ((category.range[0] / 50) * 100)
                            : width;
                          return (
                            <div
                              key={index}
                              className={`absolute h-full transition-all duration-300`}
                              style={{
                                left: `${(category.range[0] / 50) * 100}%`,
                                width: `${categoryWidth}%`,
                                backgroundColor: category.color.replace('text-', 'bg-')
                              }}
                            />
                          );
                        })}
                        {/* BMI göstergesi */}
                        {bmi && (
                          <div 
                            className="absolute w-4 h-8 bg-white border-2 border-gray-800 rounded-full"
                            style={{ 
                              left: `${Math.min((bmi / 50) * 100, 100)}%`, 
                              transform: 'translateX(-50%)' 
                            }}
                          />
                        )}
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>0</span>
                        <span>10</span>
                        <span>20</span>
                        <span>30</span>
                        <span>40</span>
                        <span>50+</span>
                      </div>
                    </div>

                    {/* Sonucu Paylaş Butonu */}
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="mt-6 w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <span className="mr-2">Sonucumu Paylaş</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
        )}

        {/* Kalori Hesaplama */}
        {activeTab === 'calories' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">{t('health.age')}</label>
                  <input
                      type="number"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder={t('health.age_placeholder')}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">{t('health.gender')}</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                          type="radio"
                          className="form-radio text-indigo-600"
                          name="gender-calorie"
                          value="male"
                          checked={gender === 'male'}
                          onChange={() => setGender('male')}
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{t('health.male')}</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                          type="radio"
                          className="form-radio text-indigo-600"
                          name="gender-calorie"
                          value="female"
                          checked={gender === 'female'}
                          onChange={() => setGender('female')}
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{t('health.female')}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">{t('health.height')}</label>
                  <input
                      type="number"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder={t('health.height_placeholder')}
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">{t('health.weight')}</label>
                  <input
                      type="number"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder={t('health.weight_placeholder')}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 dark:text-gray-300 font-medium">{t('health.activity_level')}</label>
                <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                >
                  {ACTIVITY_LEVELS.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name} - {level.description}
                      </option>
                  ))}
                </select>
              </div>

              <button
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-200"
                  onClick={calculateCalories}
              >
                {t('health.calculate_calories')}
              </button>

              {/* Kalori Sonucu */}
              {calories !== null && (
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{t('health.daily_calorie_need')}</h3>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                          {calories} kcal
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                          {t('health.calorie_need_description')}
                        </p>

                        <div className="mt-4 grid grid-cols-3 gap-2">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded text-center">
                            <p className="text-sm font-medium text-green-800 dark:text-green-300">{t('health.lose_weight')}</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">{Math.round(calories * 0.8)} kcal</p>
                          </div>
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-center">
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">{t('health.maintain_weight')}</p>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{calories} kcal</p>
                          </div>
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-center">
                            <p className="text-sm font-medium text-purple-800 dark:text-purple-300">{t('health.gain_weight')}</p>
                            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{Math.round(calories * 1.2)} kcal</p>
                          </div>
                        </div>
                      </div>
                      <button
                          className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center"
                          onClick={() => setShowShareModal(true)}
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        {t('health.share_result')}
                      </button>
                    </div>
                    <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                      <p>{t('health.disclaimer')}</p>
                      <p>{t('health.consult_doctor')}</p>
                    </div>
                  </motion.div>
              )}
            </div>
        )}

        {/* Paylaşım Modalı */}
        <CalculationResultModal
            open={showShareModal}
            onClose={() => setShowShareModal(false)}
            result={activeTab === 'bmi' ? { bmi, category: bmiCategory?.name, bodyFatPercentage, bodyFatCategory } : { calories }}
            slipTitle={activeTab === 'bmi' ? (bodyFatPercentage ? 'Vücut Yağ Oranı Hesaplama' : 'BMI Hesaplama') : 'Kalori İhtiyacı Hesaplama'}
        />
      </div>
  );
};

export default HealthCalculator;
