import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Droplets, Zap, FlaskConical, User, Coins, Settings2, Loader2, Car } from 'lucide-react';
import CarWashResultModal from './CarWashResultModal';

const CarWashCalculator: React.FC = () => {
  const { t } = useTranslation();
  const [washType, setWashType] = useState<'automatic' | 'token'>('automatic');
  
  // Sabit birim fiyatları (kullanıcıdan gizlendi)
  const ELECTRICITY_PRICE = 3.5; // ₺/kWh
  const WATER_PRICE = 0.25; // ₺/Litre
  const FOAM_PRICE = 0.05; // ₺/ml
  const FOAM_PRICE_PER_L = FOAM_PRICE * 1000; // 1L köpük fiyatı
  
  // Kullanıcı girdileri
  const [electricity, setElectricity] = useState(5);
  const [water, setWater] = useState(100);
  const [foam, setFoam] = useState(200);
  const [tokenCount, setTokenCount] = useState(1);
  const [tokenPrice, setTokenPrice] = useState(30);
  const [tokenDuration, setTokenDuration] = useState(5);
  const [autoFixedPrice, setAutoFixedPrice] = useState(50);
  const [autoSalePrice, setAutoSalePrice] = useState(120);
  const [personnel, setPersonnel] = useState(20);

  // Edit modları (hangi değer düzenleniyor?)
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Hesaplamalar
  const tokenTotal = tokenCount * tokenPrice;
  
  const ownCost = () => {
    const el = electricity * ELECTRICITY_PRICE;
    const su = water * WATER_PRICE;
    // Köpük hesaplama: 1000 ml ve üzeri litre bazında
    let kopuk = 0;
    if (foam >= 1000) {
      kopuk = (foam / 1000) * FOAM_PRICE_PER_L;
    } else {
      kopuk = foam * FOAM_PRICE;
    }
    if (washType === 'automatic') {
      return el + su + kopuk + autoFixedPrice + personnel;
    } else {
      return el + su + kopuk;
    }
  };
  
  const fark = washType === 'token' ? tokenTotal - ownCost() : undefined;

  // Slider için yardımcı fonksiyonlar
  const getSliderBackground = (value: number, min: number, max: number, color: string) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
  };

  // Edit alanı açıldığında inputa odaklan
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (editField && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editField]);

  // Sayıya tıklayınca edit moduna geç
  const handleEditClick = (field: string, value: number) => {
    setEditField(field);
    setEditValue(value.toString());
  };

  // Edit tamamlanınca değeri güncelle
  const handleEditDone = () => {
    const num = Number(editValue.replace(',', '.'));
    if (!isNaN(num)) {
      switch (editField) {
        case 'electricity': setElectricity(Math.max(0, Math.min(20, num))); break;
        case 'water': setWater(Math.max(0, Math.min(1000, num))); break;
        case 'foam': setFoam(Math.max(0, Math.min(2000, num))); break;
        case 'personnel': setPersonnel(Math.max(0, Math.min(5000, num))); break;
        case 'autoFixedPrice': setAutoFixedPrice(Math.max(0, Math.min(3000, num))); break;
        case 'autoSalePrice': setAutoSalePrice(Math.max(0, Math.min(3000, num))); break;
        case 'tokenPrice': setTokenPrice(Math.max(10, Math.min(3000, num))); break;
        case 'tokenDuration': setTokenDuration(Math.max(1, Math.min(15, num))); break;
        case 'tokenCount': setTokenCount(Math.max(1, Math.min(999, Math.round(num)))); break;
      }
    }
    setEditField(null);
  };

  // Enter/Blur ile edit bitir
  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleEditDone();
    if (e.key === 'Escape') setEditField(null);
  };

  // Sayı kutusu (tıklanınca input olur)
  function EditableNumber({field, value, unit, min, max, step=1, className=''}: {field: string, value: number, unit?: string, min: number, max: number, step?: number, className?: string}) {
    return editField === field ? (
      <input
        ref={inputRef}
        type="number"
        min={min}
        max={max}
        step={step}
        value={editValue}
        onChange={e => setEditValue(e.target.value)}
        onBlur={handleEditDone}
        onKeyDown={handleEditKeyDown}
        className={`rounded border text-center text-base font-bold focus:ring-2 focus:ring-green-400 ${className}`}
        style={{width: 144, maxWidth: 144}}
      />
    ) : (
      <span
        className={`cursor-pointer select-none ${className}`}
        tabIndex={0}
        onClick={() => handleEditClick(field, value)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleEditClick(field, value); }}
        title="Tıklayarak düzenle"
        style={{width: 144, display: 'inline-block'}}
      >
        {value}{unit && <span className="ml-1">{unit}</span>}
      </span>
    );
  }

  // --- PAYLAŞIM MODAL STATE ---
  const [showShareModal, setShowShareModal] = useState(false);

  // --- PAYLAŞIM SONUCU ---
  const shareResult = {
    paidAmount: washType === 'token' ? tokenTotal : autoSalePrice,
    discount: 0, // Gerekirse eklenebilir
    tax: 0, // Gerekirse eklenebilir
    commission: 0, // Gerekirse eklenebilir
    selectedServices: [
      { name: washType === 'automatic' ? 'Otomatik Yıkama' : 'Jetonlu Yıkama', price: washType === 'token' ? tokenTotal : autoSalePrice }
    ],
    waterUsed: water,
    electricityUsed: electricity,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full mx-auto mt-8 animate-fadeInUp">
      <div className="flex items-center gap-3 mb-4">
        <Car className="text-green-500" size={28} />
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{t('carwash.title')}</h2>
      </div>
      
      {/* Wash Type Selection - Interactive Buttons */}
      <div className="flex gap-3 mb-5">
        <button
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-semibold border-2 transition-all duration-300 shadow-sm ${washType === 'automatic' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 scale-105' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-green-100 dark:hover:bg-green-900'}`}
          onClick={() => setWashType('automatic')}
        >
          <Loader2 className={`${washType === 'automatic' ? 'animate-spin' : ''}`} size={18} /> 
          <span className="font-bold">{t('carwash.automatic')}</span>
        </button>
        <button
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-semibold border-2 transition-all duration-300 shadow-sm ${washType === 'token' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600 scale-105' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-amber-100 dark:hover:bg-amber-900'}`}
          onClick={() => setWashType('token')}
        >
          <Coins className={`${washType === 'token' ? 'animate-bounce' : ''}`} size={18} /> 
          <span className="font-bold">{t('carwash.token')}</span>
        </button>
      </div>
      
      {/* Interactive Input Form */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Common Inputs - Interactive Sliders */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 p-2 rounded-full">
                  <Zap className="text-white" size={16} />
                </div>
                <label className="text-sm font-bold text-blue-700 dark:text-blue-300">{t('carwash.electricity')}</label>
              </div>
              <span className="text-xs font-medium bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">{ELECTRICITY_PRICE}₺/kWh</span>
            </div>
            
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="1" 
                value={electricity} 
                onChange={(e) => setElectricity(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: getSliderBackground(electricity, 0, 20, '#3b82f6') }}
              />
              <div className="bg-white dark:bg-gray-700 rounded-lg text-center font-bold text-blue-600 dark:text-blue-400 shadow-sm" style={{maxWidth: 144, width: 144}}>
                <EditableNumber field="electricity" value={electricity} unit="kWh" min={0} max={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/30 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-cyan-500 p-2 rounded-full">
                  <Droplets className="text-white" size={16} />
                </div>
                <label className="text-sm font-bold text-cyan-700 dark:text-cyan-300">{t('carwash.water')}</label>
              </div>
              <span className="text-xs font-medium bg-cyan-200 dark:bg-cyan-700 text-cyan-800 dark:text-cyan-200 px-2 py-1 rounded-full">{WATER_PRICE}₺/L</span>
            </div>
            
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="0" 
                max="1000" 
                step="10" 
                value={water} 
                onChange={(e) => setWater(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: getSliderBackground(water, 0, 1000, '#06b6d4') }}
              />
              <div className="bg-white dark:bg-gray-700 rounded-lg text-center font-bold text-cyan-600 dark:text-cyan-400 shadow-sm" style={{maxWidth: 144, width: 144}}>
                <EditableNumber field="water" value={water} unit="L" min={0} max={1000} step={10} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-purple-500 p-2 rounded-full">
                  <FlaskConical className="text-white" size={16} />
                </div>
                <label className="text-sm font-bold text-purple-700 dark:text-purple-300">{t('carwash.foam')}</label>
              </div>
              <span className="text-xs font-medium bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                {foam >= 1000 ? `${FOAM_PRICE_PER_L}₺/L` : `${FOAM_PRICE}₺/ml`}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="0" 
                max="2000" 
                step="10" 
                value={foam} 
                onChange={(e) => setFoam(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: getSliderBackground(foam, 0, 2000, '#9333ea') }}
              />
              <div className="bg-white dark:bg-gray-700 rounded-lg text-center font-bold text-purple-600 dark:text-purple-400 shadow-sm" style={{maxWidth: 144, width: 144}}>
                <EditableNumber field="foam" value={foam} unit={foam >= 1000 ? 'L' : 'ml'} min={0} max={2000} step={10} />
              </div>
            </div>
          </div>
          
          {/* Token Specific Inputs - Interactive */}
          {washType === 'token' && (
            <>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-4 rounded-lg shadow-sm col-span-1 sm:col-span-2 md:col-span-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-500 p-2 rounded-full">
                      <Coins className="text-white" size={16} />
                    </div>
                    <label className="text-sm font-bold text-amber-700 dark:text-amber-300">{t('carwash.tokenCount')}</label>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 justify-between">
                  <button 
                    className="bg-amber-200 dark:bg-amber-700 text-amber-800 dark:text-amber-200 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-sm hover:bg-amber-300 dark:hover:bg-amber-600 transition-colors"
                    onClick={() => setTokenCount(Math.max(1, tokenCount - 1))}
                  >
                    -
                  </button>
                  
                  <div className="bg-white dark:bg-gray-700 py-2 px-4 rounded-lg font-bold text-2xl text-amber-600 dark:text-amber-400 shadow-sm" style={{maxWidth: 144, width: 144}}>
                    <EditableNumber field="tokenCount" value={tokenCount} min={1} max={999} />
                  </div>
                  
                  <button 
                    className="bg-amber-200 dark:bg-amber-700 text-amber-800 dark:text-amber-200 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-sm hover:bg-amber-300 dark:hover:bg-amber-600 transition-colors"
                    onClick={() => setTokenCount(tokenCount + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-500 p-2 rounded-full">
                      <Coins className="text-white" size={16} />
                    </div>
                    <label className="text-sm font-bold text-amber-700 dark:text-amber-300">{t('carwash.tokenPrice')}</label>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="10" 
                    max="3000" 
                    step="5" 
                    value={tokenPrice} 
                    onChange={(e) => setTokenPrice(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ background: getSliderBackground(tokenPrice, 10, 3000, '#f59e0b') }}
                  />
                  <div className="bg-white dark:bg-gray-700 rounded-lg text-center font-bold text-amber-600 dark:text-amber-400 shadow-sm" style={{maxWidth: 144, width: 144}}>
                    <EditableNumber field="tokenPrice" value={tokenPrice} unit="₺" min={10} max={3000} step={5} />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-500 p-2 rounded-full">
                      <Coins className="text-white" size={16} />
                    </div>
                    <label className="text-sm font-bold text-amber-700 dark:text-amber-300">{t('carwash.tokenDuration')}</label>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="1" 
                    max="15" 
                    step="1" 
                    value={tokenDuration} 
                    onChange={(e) => setTokenDuration(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ background: getSliderBackground(tokenDuration, 1, 15, '#f59e0b') }}
                  />
                  <div className="bg-white dark:bg-gray-700 rounded-lg text-center font-bold text-amber-600 dark:text-amber-400 shadow-sm" style={{maxWidth: 144, width: 144}}>
                    <EditableNumber field="tokenDuration" value={tokenDuration} unit="dk" min={1} max={15} />
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Automatic Specific Inputs - Interactive */}
          {washType === 'automatic' && (
            <>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-500 p-2 rounded-full">
                      <Settings2 className="text-white" size={16} />
                    </div>
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('carwash.autoFixedPrice')}</label>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="0" 
                    max="3000" 
                    step="10" 
                    value={autoFixedPrice} 
                    onChange={(e) => setAutoFixedPrice(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ background: getSliderBackground(autoFixedPrice, 0, 3000, '#6b7280') }}
                  />
                  <div className="bg-white dark:bg-gray-700 rounded-lg text-center font-bold text-gray-600 dark:text-gray-400 shadow-sm" style={{maxWidth: 144, width: 144}}>
                    <EditableNumber field="autoFixedPrice" value={autoFixedPrice} unit="₺" min={0} max={3000} step={10} />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500 p-2 rounded-full">
                      <Settings2 className="text-white" size={16} />
                    </div>
                    <label className="text-sm font-bold text-green-700 dark:text-green-300">{t('carwash.autoSalePrice')}</label>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="50" 
                    max="3000" 
                    step="10" 
                    value={autoSalePrice} 
                    onChange={(e) => setAutoSalePrice(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ background: getSliderBackground(autoSalePrice, 50, 3000, '#10b981') }}
                  />
                  <div className="bg-white dark:bg-gray-700 rounded-lg text-center font-bold text-green-600 dark:text-green-400 shadow-sm" style={{maxWidth: 144, width: 144}}>
                    <EditableNumber field="autoSalePrice" value={autoSalePrice} unit="₺" min={50} max={3000} step={10} />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-500 p-2 rounded-full">
                      <User className="text-white" size={16} />
                    </div>
                    <label className="text-sm font-bold text-orange-700 dark:text-orange-300">{t('carwash.personnel')}</label>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="0" 
                    max="5000" 
                    step="100" 
                    value={personnel} 
                    onChange={(e) => setPersonnel(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ background: getSliderBackground(personnel, 0, 5000, '#f97316') }}
                  />
                  <div className="bg-white dark:bg-gray-700 rounded-lg text-center font-bold text-orange-600 dark:text-orange-400 shadow-sm" style={{maxWidth: 144, width: 144}}>
                    <EditableNumber field="personnel" value={personnel} unit="₺" min={0} max={5000} step={100} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Calculate Button - Interactive */}
      <div className="flex justify-end mt-4 gap-2 w-full">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-l-lg flex-1 flex items-center justify-center gap-2 text-base"
          style={{ minWidth: 0 }}
          onClick={() => console.log('Hesapla butonuna basıldı')}
        >
          {t('common.calculate')}
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-r-lg flex-1 flex items-center justify-center gap-2 text-base"
          style={{ minWidth: 0 }}
          onClick={() => setShowShareModal(true)}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
          {t('common.shareResult')}
        </button>
      </div>
      
      {/* Results Section - Interactive Cards */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-5 rounded-lg shadow-inner">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Coins size={18} className="text-yellow-500" />
          {t('carwash.results')}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Own Cost - Interactive Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-4 shadow-sm transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-500 p-2 rounded-full">
                <Settings2 className="text-white" size={16} />
              </div>
              <span className="text-sm font-bold text-green-700 dark:text-green-300">{t('carwash.ownCost')}</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-inner">
              <span className="block text-2xl font-bold text-green-600 dark:text-green-400 text-center animate-pulse-light">
                {ownCost().toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺
              </span>
            </div>
          </div>
          
          {/* Token Results - Interactive Cards */}
          {washType === 'token' && (
            <>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-4 shadow-sm transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-500 p-2 rounded-full">
                    <Coins className="text-white" size={16} />
                  </div>
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{t('carwash.tokenTotal')}</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-inner">
                  <span className="block text-2xl font-bold text-blue-600 dark:text-blue-400 text-center">
                    {tokenTotal.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺
                  </span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-lg p-4 shadow-sm transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-yellow-500 p-2 rounded-full">
                    <Coins className="text-white" size={16} />
                  </div>
                  <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">{t('carwash.fark')}</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-inner">
                  <span className={`block text-2xl font-bold ${fark > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'} text-center`}>
                    {fark.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺
                  </span>
                </div>
              </div>
            </>
          )}
          
          {/* Automatic Results - Interactive Cards */}
          {washType === 'automatic' && (
            <>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-4 shadow-sm transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-500 p-2 rounded-full">
                    <Settings2 className="text-white" size={16} />
                  </div>
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{t('carwash.autoSalePrice')}</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-inner">
                  <span className="block text-2xl font-bold text-blue-600 dark:text-blue-400 text-center">
                    {autoSalePrice.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺
                  </span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-lg p-4 shadow-sm transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-yellow-500 p-2 rounded-full">
                    <Coins className="text-white" size={16} />
                  </div>
                  <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">{t('carwash.fark')}</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-inner">
                  <span className={`block text-2xl font-bold ${(autoSalePrice-ownCost()) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} text-center`}>
                    {(autoSalePrice-ownCost()).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* SONUÇ PAYLAŞIM MODALI */}
      {showShareModal && (
        <CarWashResultModal
          open={showShareModal}
          onClose={() => setShowShareModal(false)}
          result={shareResult}
          slipTitle={washType === 'automatic' ? t('carwash.automatic') : t('carwash.token')}
          selectedServices={shareResult.selectedServices}
          paidAmount={shareResult.paidAmount}
          homemadeTotal={ownCost()}
        />
      )}
    </div>
  );
};

export default CarWashCalculator;
