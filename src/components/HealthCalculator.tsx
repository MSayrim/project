import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import CalculationResultModal from './CalculationResultModal';
import ShareButton from './ShareButton';

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
      alert('Lütfen geçerli boy ve kilo değerleri girin.');
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
      alert('Lütfen tüm değerleri doğru şekilde girin.');
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
        alert('Lütfen geçerli bir kalça ölçüsü girin.');
        return;
      }
      
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistInCm + hipInCm - neckInCm) + 0.22100 * Math.log10(heightInCm)) - 450;
    }
    
    // Sonucu 2 ondalık basamağa yuvarla
    bodyFat = parseFloat(bodyFat.toFixed(1));
    setBodyFatPercentage(bodyFat);
    
    // Vücut yağ oranı kategorisini belirle
    if (gender === 'male') {
      if (bodyFat < 6) setBodyFatCategory('Temel Yağ');
      else if (bodyFat < 14) setBodyFatCategory('Atletik');
      else if (bodyFat < 18) setBodyFatCategory('Fitness');
      else if (bodyFat < 25) setBodyFatCategory('Normal');
      else setBodyFatCategory('Fazla Yağlı');
    } else {
      if (bodyFat < 16) setBodyFatCategory('Temel Yağ');
      else if (bodyFat < 24) setBodyFatCategory('Atletik');
      else if (bodyFat < 31) setBodyFatCategory('Fitness');
      else if (bodyFat < 36) setBodyFatCategory('Normal');
      else setBodyFatCategory('Fazla Yağlı');
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
      alert('Lütfen tüm değerleri doğru şekilde girin.');
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
        <BarChart3 className="inline-block mr-2" /> Sağlık Hesaplayıcı
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
          <BarChart3 className="mr-2 h-5 w-5" /> Vücut Kitle İndeksi
        </button>
        <button
          className={`flex-1 py-2 rounded-lg flex items-center justify-center ${
            activeTab === 'calories' 
              ? 'bg-indigo-500 text-white font-medium shadow-md' 
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('calories')}
        >
          <BarChart3 className="mr-2 h-5 w-5" /> Kalori İhtiyacı
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
              {showAdvancedBmi ? 'Basit Hesaplama' : 'Gelişmiş Hesaplama'}
            </button>
          </div>

          {!showAdvancedBmi ? (
            // Basit BMI Hesaplama
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">Boy (cm)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Örn: 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">Kilo (kg)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Örn: 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
              
              <button
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-200"
                onClick={calculateBMI}
              >
                Vücut Kitle İndeksini Hesapla
              </button>
            </>
          ) : (
            // Gelişmiş BMI Hesaplama
            <>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mb-4">
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  Gelişmiş hesaplama, ABD Donanması formülü kullanarak vücut yağ oranınızı tahmin eder. 
                  Bu hesaplama, standart BMI'dan daha doğru sonuçlar verebilir.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">Boy (cm)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Örn: 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">Kilo (kg)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Örn: 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium">Cinsiyet</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className={`py-2 rounded-lg ${
                      gender === 'male' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => setGender('male')}
                  >
                    Erkek
                  </button>
                  <button
                    className={`py-2 rounded-lg ${
                      gender === 'female' 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => setGender('female')}
                  >
                    Kadın
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">Boyun Çevresi (cm)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Örn: 35"
                    value={neck}
                    onChange={(e) => setNeck(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">Bel Çevresi (cm)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Örn: 85"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                  />
                </div>
              </div>
              
              {gender === 'female' && (
                <div className="space-y-2 mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">Kalça Çevresi (cm)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Örn: 95"
                    value={hip}
                    onChange={(e) => setHip(e.target.value)}
                  />
                </div>
              )}
              
              <button
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition duration-200"
                onClick={calculateAdvancedBMI}
              >
                Vücut Yağ Oranını Hesapla
              </button>
            </>
          )}
          
          {bmi !== null && bmiCategory && !showAdvancedBmi && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              id="bmi-result"
            >
              <h3 className="text-xl font-bold text-center mb-4">Sonuç</h3>
              <div className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-2">{bmi}</div>
                <div className={`text-xl font-semibold ${bmiCategory.color}`}>
                  {bmiCategory.name}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-center mt-4">
                  {bmiCategory.description}
                </p>
                
                <div className="w-full mt-6">
                  <div className="relative h-8 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    {BMI_CATEGORIES.map((category, index) => {
                      const width = index === 0 
                        ? (Math.min(category.range[1], 50) / 50) * 100
                        : ((Math.min(category.range[1], 50) - category.range[0]) / 50) * 100;
                      
                      // Eğer bu kategori sonsuz ise, kalan alanı kapla
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
                <ShareButton
                  resultId="bmi-result"
                  title="ParamCebimde BMI Sonucu"
                  text={`BMI Değerim: ${bmi} - Kategori: ${bmiCategory.name}`}
                  className="mt-6 w-full"
                />
              </div>
            </motion.div>
          )}
          
          {bmi !== null && bmiCategory && showAdvancedBmi && bodyFatPercentage !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              id="advanced-bmi-result"
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
                
                <div className="w-full mt-6">
                  <div className="relative h-8 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    {BMI_CATEGORIES.map((category, index) => {
                      const width = index === 0 
                        ? (Math.min(category.range[1], 50) / 50) * 100
                        : ((Math.min(category.range[1], 50) - category.range[0]) / 50) * 100;
                      
                      // Eğer bu kategori sonsuz ise, kalan alanı kapla
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
                <ShareButton
                  resultId="advanced-bmi-result"
                  title="ParamCebimde Vücut Yağ Oranı Sonucu"
                  text={`Vücut Yağ Oranım: %${bodyFatPercentage} - Kategori: ${bodyFatCategory}\nBMI Değerim: ${bmi} - Kategori: ${bmiCategory.name}`}
                  className="mt-6 w-full"
                />
              </div>
            </motion.div>
          )}
          
          {/* Kalori Hesaplama */}
          {activeTab === 'calories' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">Yaş</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Örn: 30"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">Cinsiyet</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className={`py-2 rounded-lg ${
                        gender === 'male' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => setGender('male')}
                    >
                      Erkek
                    </button>
                    <button
                      className={`py-2 rounded-lg ${
                        gender === 'female' 
                          ? 'bg-pink-500 text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => setGender('female')}
                    >
                      Kadın
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">Boy (cm)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Örn: 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium">Kilo (kg)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Örn: 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-gray-700 dark:text-gray-300 font-medium">Aktivite Seviyesi</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                >
                  {ACTIVITY_LEVELS.map(level => (
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
                Günlük Kalori İhtiyacını Hesapla
              </button>
              
              {calories !== null && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  id="calories-result"
                >
                  <h3 className="text-xl font-bold text-center mb-4">Günlük Kalori İhtiyacınız</h3>
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">
                      {calories} kcal
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-center mt-4">
                      Bu değer, vücut ağırlığınızı korumak için gereken günlük kalori miktarıdır.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-6">
                      <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-center">
                        <div className="font-bold text-green-700 dark:text-green-300">Kilo Vermek</div>
                        <div className="text-xl font-bold text-green-800 dark:text-green-200">
                          {Math.round(calories * 0.8)} kcal
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">%20 kalori açığı</div>
                      </div>
                      
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-center">
                        <div className="font-bold text-blue-700 dark:text-blue-300">Kilo Korumak</div>
                        <div className="text-xl font-bold text-blue-800 dark:text-blue-200">
                          {calories} kcal
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">Mevcut kalori</div>
                      </div>
                      
                      <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg text-center">
                        <div className="font-bold text-purple-700 dark:text-purple-300">Kilo Almak</div>
                        <div className="text-xl font-bold text-purple-800 dark:text-purple-200">
                          {Math.round(calories * 1.15)} kcal
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-400">%15 kalori fazlası</div>
                      </div>
                    </div>
                    
                    {/* Sonucu Paylaş Butonu */}
                    <ShareButton
                      resultId="calories-result"
                      title="ParamCebimde Kalori İhtiyacı Sonucu"
                      text={`Günlük Kalori İhtiyacım: ${calories} kcal\nKilo vermek için: ${Math.round(calories * 0.8)} kcal\nKilo almak için: ${Math.round(calories * 1.15)} kcal`}
                      className="mt-6 w-full"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          )}
          
          {/* Paylaşım Modalı - Bileşenin en dışında, her iki sekme için de erişilebilir */}
          {showShareModal && (
            <CalculationResultModal
              open={showShareModal}
              onClose={() => setShowShareModal(false)}
              result={
                activeTab === 'calories' && calories !== null
                  ? {
                      calories,
                      caloriesForLoss: Math.round(calories * 0.8),
                      caloriesForGain: Math.round(calories * 1.15)
                    }
                  : activeTab === 'bmi' && showAdvancedBmi && bodyFatPercentage !== null
                    ? { bodyFatPercentage, bodyFatCategory }
                    : activeTab === 'bmi' && bmi !== null && bmiCategory
                      ? { bmi, bmiCategory: bmiCategory?.name }
                      : {}
              }
              slipTitle={
                activeTab === 'calories'
                  ? 'Günlük Kalori İhtiyacı Hesaplama'
                  : showAdvancedBmi
                    ? 'Vücut Yağ Oranı Hesaplama'
                    : 'BMI Hesaplama'
              }
            />
          )}
        </div>
      )}
      
      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
        <p>Bu hesaplamalar yaklaşık değerlerdir ve sadece bilgi amaçlıdır.</p>
        <p>Sağlık durumunuzla ilgili kararlar için lütfen bir sağlık uzmanına danışın.</p>
      </div>
      
      {/* Paylaşım Modalı - Bileşenin en dışında, her iki sekme için de erişilebilir */}
      {showShareModal && (
        <CalculationResultModal
          open={showShareModal}
          onClose={() => setShowShareModal(false)}
          result={
            activeTab === 'calories' && calories !== null
              ? {
                  calories,
                  caloriesForLoss: Math.round(calories * 0.8),
                  caloriesForGain: Math.round(calories * 1.15)
                }
              : activeTab === 'bmi' && showAdvancedBmi && bodyFatPercentage !== null
                ? { bodyFatPercentage, bodyFatCategory }
                : activeTab === 'bmi' && bmi !== null && bmiCategory
                  ? { bmi, bmiCategory: bmiCategory?.name }
                  : {}
          }
          slipTitle={
            activeTab === 'calories'
              ? 'Günlük Kalori İhtiyacı Hesaplama'
              : showAdvancedBmi
                ? 'Vücut Yağ Oranı Hesaplama'
                : 'BMI Hesaplama'
          }
        />
      )}
    </div>
  );
};

export default HealthCalculator;
