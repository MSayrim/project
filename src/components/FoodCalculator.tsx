import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import QuantitySelector from './QuantitySelector';
import { ShoppingCart, ChevronDown, ChevronUp, Info, CreditCard, DollarSign, Tag, CheckCircle, Utensils } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { setSelectedFirm, setFirms, calculatePrices, fetchFirms } from '../store/priceSlice';
import Advertisement from "./Advertisement.tsx";
import advertisementImage2 from '../assets/images.png';
import { API_ROOT, API_URLS } from '../api/config';
import CalculationResultModal from './CalculationResultModal';

const PAGE_SIZE = 10;

const FoodCalculator: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { firms, selectedFirm } = useSelector((state: RootState) => state.price);

  console.log('Redux firms state:', firms);
  if (!firms || !Array.isArray(firms)) {
    console.warn('firms array yok veya yanlış:', firms);
  } else {
    console.log('Comboboxa giden firmalar:', firms.map(f => ({id: f.id, name: f.name})));
  }

  // Sabit değişkenleri useTranslation hook'u kullanıldıktan sonra tanımlıyoruz
  const FOOD_TYPE_OPTIONS = [
    { value: 'all', label: t('food.types.all') },
    { value: 'MAIN', label: t('food.types.main') },
    { value: 'SIDE', label: t('food.types.side') },
    { value: 'DESSERT', label: t('food.types.dessert') }
  ];

  // Türkçe foodType eşlemesi
  const foodTypeLabels: Record<string, string> = {
    MAIN: t('food.types.main'),
    SIDE: t('food.types.side'),
    DESSERT: t('food.types.dessert'),
    DRINK: t('food.types.drink'),
    ALL: t('food.types.all'),
  };

  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [discountInput, setDiscountInput] = useState<string>('');
  const [paidAmountInput, setPaidAmountInput] = useState<string>('');
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [calculatedResult, setCalculatedResult] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [joker, setJoker] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [foodType, setFoodType] = useState<string>('');
  const [quantities, setQuantities] = useState<{ [name: string]: number }>({});
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(9);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hideImages, setHideImages] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const mountedRecipes = useRef(false);
  const mountedFirms = useRef(false);

  useEffect(() => {
    setLoading(true);
    const params = [];
    if (searchQuery) params.push(`keyword=${encodeURIComponent(searchQuery)}`);
    if (foodType) params.push(`foodType=${encodeURIComponent(foodType)}`);
    params.push(`page=${page}`);
    params.push(`size=${size}`);
    const url = `${API_ROOT}${API_URLS.foodSearch}?${params.join('&')}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const responseData = data.responseData || {};
        if (page === 0) {
          setRecipes(responseData.content || []);
        } else {
          setRecipes(prev => [...prev, ...(responseData.content || [])]);
        }
        setTotalPages(responseData.totalPages || 0);
        setTotalElements(responseData.totalElements || 0);
      })
      .finally(() => setLoading(false));
    // Sadece bir kez firmaları getir (StrictMode olsa bile)
    if (!mountedFirms.current) {
      dispatch(fetchFirms());
      mountedFirms.current = true;
    }
  }, [dispatch, searchQuery, foodType, page, size]);

  useEffect(() => {
    console.log('Redux firms state:', firms);
  }, [firms]);

  // Arama veya foodType değişince ilk sayfaya dön ve yemekleri sıfırla
  useEffect(() => {
    setPage(0);
    setRecipes([]);
  }, [searchQuery, foodType]);

  // Currency symbol based on language
  const currencySymbol = i18n.language === 'tr' ? '\u20ba' : '$';

  const categories = [
    { id: 'all', name: t('food.categories.all') },
    { id: 'main', name: t('food.categories.main') },
    { id: 'side', name: t('food.categories.side') },
    { id: 'drink', name: t('food.categories.drink') },
    { id: 'dessert', name: t('food.categories.dessert') }
  ];

  type RecipeItem = {
    recipe: { name: string; description: string; foodType: string; imageUrl?: string | null };
    totalCost: number;
    porsionCost: number;
  };

  const selectedItems = recipes.filter(item => (quantities[item.nameTR || item.nameEN] || 0) > 0);
  const totalAmount = selectedItems.reduce((sum, item) => sum + (item.porsionCost * (quantities[item.nameTR || item.nameEN] || 0)), 0);

  const handleIncreaseQuantity = (name: string) => {
    setQuantities(prev => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
  };

  const handleDecreaseQuantity = (name: string) => {
    setQuantities(prev => ({ ...prev, [name]: Math.max((prev[name] || 0) - 1, 0) }));
  };

  const handleDiscountChange = (value: string) => {
    setDiscountInput(value);
    
    if (value === '') {
      setDiscount(0);
      return;
    }
    
    const numValue = parseFloat(value.replace(',', '.'));
    if (!isNaN(numValue)) {
      setDiscount(Math.min(numValue, paidAmount));
    }
  };

  const handlePaidAmountChange = (value: string) => {
    setPaidAmountInput(value);
    
    if (value === '') {
      setPaidAmount(0);
      return;
    }
    
    const numValue = parseFloat(value.replace(',', '.'));
    if (!isNaN(numValue)) {
      setPaidAmount(numValue);
      if (discount > numValue) {
        setDiscount(numValue);
        // İndirim değeri de güncellendiyse input değerini de güncelle
        if (numValue === 0) {
          setDiscountInput('');
        } else {
          setDiscountInput(numValue.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
        }
      }
    }
  };

  const handleCalculatePrice = async () => {
    if (!selectedFirm) {
      alert(t('food.calculation.selectFirm'));
      return;
    }

    try {
      setCalculating(true);
      const formattedDiscount = parseFloat(discount.toFixed(2));
      const formattedPaidAmount = parseFloat(paidAmount.toFixed(2));
      const response = await dispatch(calculatePrices({ fullPrice: formattedPaidAmount, discount, joker }));
      setCalculatedResult(response.payload);
      setCalculationError(null);
    } catch (error) {
      console.error('Error calculating price:', error);
      setCalculationError(t('food.calculation.calculationError'));
    } finally {
      setCalculating(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (newSearchQuery: string) => {
    setSearchQuery(newSearchQuery);
    setPage(0);
  };

  const handleFoodTypeChange = (newFoodType: string) => {
    setFoodType(newFoodType);
    setPage(0);
  };

  const calculateTotalPrice = () => {
    return recipes.reduce((total, item) => {
      const quantity = quantities[item.nameTR || item.nameEN] || 0;
      return total + (item.priceTL || 0) * quantity;
    }, 0);
  };

  const calculateHomemadeCost = () => {
    return selectedItems.reduce((total, item) => {
      const quantity = quantities[item.nameTR || item.nameEN] || 0;
      return total + (item.porsionCost || 0) * quantity;
    }, 0);
  };

  // İndirim sonrası toplam tutarı hesapla
  const calculateNetTotal = () => {
    // Ödenen tutardan indirim tutarını çıkar
    return Math.max(0, paidAmount - discount);
  };

  // Son hesaplamadan sonra modalı açmak için
  const handleShowSlip = () => setShowResultModal(true);
  const handleCloseSlip = () => setShowResultModal(false);

  // Evde yapılan yemeklerin toplam maliyeti
  const selectedRecipes = recipes.filter(item => (quantities[item.nameTR || item.nameEN] || 0) > 0);
  const homemadeTotal = selectedRecipes.reduce((total, item) => {
    const quantity = quantities[item.nameTR || item.nameEN] || 0;
    return total + (item.priceTL || 0) * quantity;
  }, 0);

  return (
    <>
      <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-2 mt-1 tracking-tight text-center">{t('food.title')}</h2>

      {/* Tarif Modalı */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setSelectedRecipe(null)}>
          <div
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl p-6 min-w-[300px] max-w-[400px] shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="mb-2 font-bold text-lg">{selectedRecipe.nameTR || selectedRecipe.nameEN}</h3>
            <p className="whitespace-pre-line">{selectedRecipe.description}</p>
            <button
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setSelectedRecipe(null)}
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-6 mt-2 sm:mt-6">
        {/* Left Section: Payment Info and Food Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Information Section */}
          <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl p-2 sm:p-4 md:p-6 mb-2 sm:mb-6 border border-green-100 dark:border-gray-700 w-full max-w-full sm:max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <ShoppingCart className="h-8 w-8 text-green-500" />
              <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">{t('food.calculation.paymentInfo')}</h2>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleCalculatePrice(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                {/* Satır 1: Servis ve Ödenen Tutar */}
                <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm px-2 py-2 w-full h-[44px] focus-within:ring-2 focus-within:ring-green-400 transition">
                  <CreditCard className="text-green-400 mr-2" size={20} />
                  <select
                    id="firm-select-debug"
                    value={selectedFirm?.id || ''}
                    onChange={(e) => dispatch(setSelectedFirm(firms.find(f => f.id === e.target.value) || null))}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none border-none w-full text-base placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 transition-colors"
                    required
                  >
                    {/* Servis seçeneği sadece placeholder olarak kullanılacak, option olarak listede yer almayacak */}
                    <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">{t('food.calculation.service')}</option>
                    {firms && Array.isArray(firms) && firms.length === 0 && (
                      <option disabled value="no-firm">Hiç firma bulunamadı</option>
                    )}
                    {firms.map((firm) => (
                      <option key={firm.id} value={firm.id} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                        {firm.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm px-2 py-2 w-full h-[44px] focus-within:ring-2 focus-within:ring-green-400 transition">
                  <DollarSign className="text-green-400 mr-2" size={20} />
                  <input
                    type="text"
                    value={paidAmountInput}
                    onChange={(e) => handlePaidAmountChange(e.target.value)}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none border-none w-full text-base placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0"
                    placeholder={`${t('food.calculation.paidAmount')} (${currencySymbol})`}
                  />
                </div>
                {/* Satır 2: İndirim, Joker ve Hesapla */}
                <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm px-2 py-2 w-full h-[44px] focus-within:ring-2 focus-within:ring-green-400 transition">
                  <Tag className="text-green-400 mr-2" size={20} />
                  <input
                    type="text"
                    value={discountInput}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none border-none w-full text-base placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0"
                    placeholder={`${t('food.calculation.discount')} (${currencySymbol})`}
                  />
                </div>
                <div className="flex gap-1 items-center w-full h-[44px]">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={joker}
                      onChange={() => setJoker(!joker)}
                      className="accent-green-500 w-5 h-5"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{t('food.calculation.joker')}</span>
                  </label>
                  <button
                    type="submit"
                    disabled={calculating || !selectedFirm || !paidAmount}
                    className={`flex-1 w-full h-[36px] flex items-center justify-center gap-2 text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-200 px-3
                      ${calculating || !selectedFirm || !paidAmount
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:scale-105'}
                    `}
                    style={{ boxShadow: '0 2px 8px 0 rgba(34,197,94,0.10), 0 1.5px 8px 0 rgba(0,0,0,0.08)', minWidth: 0 }}
                  >
                    <ShoppingCart size={20} />
                    <span>{calculating ? t('food.calculation.calculating') : t('food.calculation.calculate')}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {calculationError && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {calculationError}
            </div>
          )}

          {/* Food Items Section - Mobilde sadece 3 kartlık yükseklik ve infinite scroll */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 sm:p-6 relative overflow-x-auto">
            {/* Search + Categories in one row, horizontally scrollable */}
            <div className="mb-2 overflow-x-auto whitespace-nowrap pb-1 hide-scrollbar" style={{ display: 'flex', gap: 4 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('food.searchPlaceholder')}
                className="min-w-[120px] px-2 py-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 shadow transition placeholder-gray-400 text-sm font-medium flex-shrink-0"
              />
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 py-1 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold shadow transition text-sm flex-shrink-0"
                type="button"
                disabled={!searchQuery}
              >
                {t('common.clear')}
              </button>
              {['ALL','MAIN','SIDE','DRINK','DESSERT'].map(type => (
                <button
                  key={type}
                  onClick={() => setFoodType(type === 'ALL' ? '' : type)}
                  className={`px-2 py-1 rounded-xl font-bold text-sm border border-gray-200 dark:border-gray-700 transition flex-shrink-0 ${foodType === type || (type === 'ALL' && !foodType) ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-900'}`}
                  type="button"
                >
                  {t(`food.types.${type.toLowerCase()}`)}
                </button>
              ))}
              <button
                onClick={() => setHideImages(v => !v)}
                className={`px-2 py-1 rounded-xl font-bold text-sm border transition flex-shrink-0 ${hideImages ? 'bg-gray-300 text-gray-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
                type="button"
              >
                {hideImages ? t('food.showImages') : t('food.hideImages')}
              </button>
            </div>

            {/* Yemek kartları için CSS */}
            <style>{`
              .hide-scrollbar::-webkit-scrollbar {
                height: 0;
                display: none;
              }
              .hide-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .card-hover {
                transition: all 0.2s ease;
              }
              .card-hover:hover {
                transform: translateY(-4px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
              }
              .food-card-gradient {
                background: linear-gradient(45deg, #f59e0b, #f97316);
              }
              .food-card-gradient-dark {
                background: linear-gradient(45deg, #0369a1, #0284c7);
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fadeIn {
                animation: fadeIn 0.3s ease-out forwards;
              }
            `}</style>

            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 block sm:grid"
                style={{
                  maxHeight: '540px', // 3 kart yüksekliği (mobil)
                  overflowY: 'auto',
                }}
                onScroll={e => {
                  const el = e.currentTarget;
                  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20 && !loading && page < totalPages - 1) {
                    setPage(page + 1);
                  }
                }}
              >
                {recipes.map(item => (
                  <div
                    key={item.id}
                    className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                      quantities[item.nameTR || item.nameEN] > 0 
                        ? 'bg-gradient-to-br from-green-50/80 to-green-100/60 dark:from-green-900/20 dark:to-green-800/10 shadow-md ring-1 ring-green-300 dark:ring-green-800' 
                        : 'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:scale-[1.01]'
                    }`}
                    style={!hideImages && item.imageUrl ? {
                      backgroundImage: `url('${item.imageUrl}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    } : {}}
                  >
                    {!hideImages && item.imageUrl && <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/40" />}
                    
                    {!hideImages && !item.imageUrl && (
                      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 flex items-center justify-center">
                        <Utensils size={48} className="text-green-300/50 dark:text-green-700/30" />
                      </div>
                    )}
                    
                    <div className="p-4 relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className={`font-bold truncate ${!hideImages && item.imageUrl ? 'text-white' : 'text-gray-800 dark:text-white'} ${!hideImages && item.imageUrl ? 'drop-shadow-md' : ''}`}>
                          {item.nameTR || item.nameEN}
                        </h3>
                        {quantities[item.nameTR || item.nameEN] > 0 && (
                          <div className="flex items-center justify-center bg-white/90 text-green-700 dark:bg-white/90 dark:text-green-700 text-sm font-semibold px-2.5 py-1 rounded-md ml-2 shadow-sm">
                            <span>{quantities[item.nameTR || item.nameEN]}</span>
                            <span className="ml-0.5">×</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <div className={`text-sm font-medium ${!hideImages && item.imageUrl ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'} ${!hideImages && item.imageUrl ? 'drop-shadow-md' : ''}`}>
                          {item.categoryTR || item.categoryEN}
                        </div>
                        <div className={`font-bold ${!hideImages && item.imageUrl ? 'text-white' : 'text-gray-800 dark:text-white'} ${!hideImages && item.imageUrl ? 'drop-shadow-md' : ''}`}>
                          {item.priceTL?.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <QuantitySelector
                          quantity={quantities[item.nameTR || item.nameEN] || 0}
                          onIncrease={() => handleIncreaseQuantity(item.nameTR || item.nameEN)}
                          onDecrease={() => handleDecreaseQuantity(item.nameTR || item.nameEN)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Sayfa geçiş butonları ve toplam ürün bilgisi */}
            <div className="flex flex-col items-center mt-6 relative">
              {/* Sayfalama butonları - ortada */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0 || loading}
                  className="px-5 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold text-base shadow transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronDown className="rotate-90" size={16} /> {t('common.previous')}
                </button>
                <div className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-200 font-medium">
                  {page + 1} / {Math.max(1, totalPages)}
                </div>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages - 1 || loading}
                  className="px-5 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold text-base shadow transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {t('common.next')} <ChevronDown className="-rotate-90" size={16} />
                </button>
              </div>
              
              {/* Toplam ürün bilgisi - sağ alt köşede */}
              <div className="absolute right-0 bottom-0 hidden sm:block">
                <div className="bg-green-600 text-white px-3 py-2 rounded-lg shadow-md text-sm font-medium">
                  {totalElements} {t('common.product')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('food.calculation.title')}</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">{t('calculator.types.food')}</span>
          </div>

          {/* Hesaplama ve komisyonlar sadece hesaplama yapıldıysa göster */}
          {calculatedResult && (
              <>

                {discount > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">{t('food.calculation.discount')}</span>
                    <span className="font-medium text-green-500">-{typeof discount === 'number' ? discount.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}{currencySymbol}</span>
                  </div>
                )}
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <button 
                      onClick={() => setShowDetails(!showDetails)} 
                      className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {t('food.calculation.commissions')}
                    </button>
                    {calculatedResult && (
                      <span className="font-medium">
                        {(() => {
                          // Tüm komisyonları toplama
                          const commission = typeof calculatedResult.commission === 'number' ? calculatedResult.commission : 0;
                          const communicationCommission = typeof calculatedResult.communicationCommission === 'number' ? calculatedResult.communicationCommission : 0;
                          const discountCommission = joker && typeof calculatedResult.discountCommission === 'number' ? calculatedResult.discountCommission : 0;
                          
                          const totalCommission = commission + communicationCommission + discountCommission;
                          
                          return totalCommission.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + currencySymbol;
                        })()}
                      </span>
                    )}
                  </div>
                  {showDetails && calculatedResult && (
                    <div className="space-y-2 ml-4 text-sm mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                          {t('food.calculation.commission')} ({calculatedResult.firm?.commission || 0}%)
                        </span>
                        <span className="font-medium">{typeof calculatedResult.commission === 'number' ? calculatedResult.commission.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}{currencySymbol}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                          {t('food.calculation.communicationCommission')} ({calculatedResult.firm?.communicationCommission || 0}%)
                        </span>
                        <span className="font-medium">{typeof calculatedResult.communicationCommission === 'number' ? calculatedResult.communicationCommission.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}{currencySymbol}</span>
                      </div>
                      {joker && discount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            {t('food.calculation.discountCommission')} ({calculatedResult.firm?.discountCommission || 0}%)
                          </span>
                          <span className="font-medium">{typeof calculatedResult.discountCommission === 'number' ? calculatedResult.discountCommission.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}{currencySymbol}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 dark:text-gray-400">{t('food.calculation.tax')}</span>
                  <span className="font-medium">{typeof calculatedResult.tax === 'number' ? calculatedResult.tax.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}{currencySymbol}</span>
                </div>
                {typeof calculatedResult.profit === 'number' && (
                  <div className="flex justify-between items-center mb-2 mt-4">
                    <span className="text-green-700 dark:text-green-300 font-semibold">{t('food.calculation.profit')}</span>
                    <span className="font-semibold">{calculatedResult.profit.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}{currencySymbol}</span>
                  </div>
                )}
                <div className="border-t-2 border-green-500 dark:border-green-400 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-800 dark:text-white">{t('food.calculation.total')}</span>
                    <span className="font-bold text-xl text-green-600 dark:text-green-400">
                      {calculateNetTotal().toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}{currencySymbol}
                    </span>
                  </div>
                </div>
                {/* Fiyat Karşılaştırması VS ve açıklama ile */}
                <div className="flex justify-center my-6">
                  <Advertisement width={450} height={150} imageUrl={advertisementImage2}/>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <span className="font-bold text-xl text-gray-800 dark:text-white">{t('food.comparison.title')}</span>
                    <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center max-w-md mx-auto">
                    <div className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-300
                      ${(paidAmount - homemadeTotal) < 0
                        ? 'bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-green-900/60 dark:via-green-950/60 dark:to-green-900/80 ring-2 ring-green-400 shadow-[0_4px_24px_0_rgba(34,197,94,0.15)] scale-105 z-10'
                        : 'bg-gray-50 dark:bg-gray-800'}
                    `}>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t('food.comparison.paid')}</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">{calculateNetTotal().toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}{currencySymbol}</span>
                      {(paidAmount - homemadeTotal) < 0 && (
                        <CheckCircle size={32}
                                     className="absolute -left-3 -bottom-3 text-green-500 bg-white dark:bg-green-900 rounded-full shadow border-2 border-white dark:border-green-900"/>
                      )}
                    </div>
                    <div className="flex flex-col items-center z-20">
                      <span className="text-2xl font-extrabold text-gray-400 drop-shadow-sm tracking-wider select-none">VS</span>
                      <div className="h-8 w-0.5 bg-gradient-to-b from-green-300 via-gray-300 to-green-300 dark:from-green-700 dark:via-gray-700 dark:to-green-700 opacity-70"></div>
                    </div>
                    <div className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-300
                      ${(paidAmount - homemadeTotal) >= 0
                        ? 'bg-green-50 dark:bg-green-900/50 ring-2 ring-green-500 dark:ring-green-400'
                        : 'bg-gray-50 dark:bg-gray-800'}`}>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t('food.comparison.homemade')}</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">{homemadeTotal.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}{currencySymbol}</span>
                      {(paidAmount - homemadeTotal) >= 0 && (
                        <CheckCircle size={32}
                                     className="absolute -left-3 -bottom-3 text-green-500 bg-white dark:bg-green-900 rounded-full shadow border-2 border-white dark:border-green-900"/>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('food.comparison.difference')}:</span>
                    <div className={`px-3 py-1 rounded-lg font-bold text-base
                      ${(paidAmount - homemadeTotal) < 0
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                      {typeof ((paidAmount - discount) - homemadeTotal) === 'number' ? Math.abs((paidAmount - discount) - homemadeTotal).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}{currencySymbol}
                    </div>
                  </div>
                  {selectedItems.length > 0 && (
                    <div className="mt-6 border-t border-green-200 dark:border-green-800 pt-4">
                      <h3 className="font-bold text-green-700 dark:text-green-300 mb-3 text-base text-center">{t('food.selectedItems')}</h3>
                      <ul className="space-y-2 mb-4">
                        {selectedItems.map(item => (
                          <li key={item.nameTR || item.nameEN} className="flex justify-between items-center text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-sm font-semibold px-2.5 py-1 rounded-md">
                                <span>{quantities[item.nameTR || item.nameEN]}</span>
                                <span className="ml-0.5">×</span>
                              </div>
                              <span className="font-medium">{item.nameTR || item.nameEN}</span>
                            </div>
                            <span className="font-semibold text-green-600 dark:text-green-400">{typeof (item.priceTL * (quantities[item.nameTR || item.nameEN] || 0)) === 'number' ? (item.priceTL * (quantities[item.nameTR || item.nameEN] || 0)).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}₺</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-green-200 dark:border-green-800 pt-3 mt-2 flex justify-between items-center">
                        <span className="font-bold text-gray-800 dark:text-white">{t('common.total')}:</span>
                        <span className="font-bold text-xl text-green-600 dark:text-green-400">{homemadeTotal.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
          )}
          {/* Hesaplama sonrası butonu göster */}
          {calculatedResult && (
            <div className="flex justify-end mt-2">
              <button onClick={handleShowSlip} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold shadow">
                {t('food.calculation.viewShare')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Seçilen ürünlerin toplam fiyatı - sayfanın sağ alt köşesinde sabit pozisyonda */}
      {Object.values(quantities).some(q => q > 0) && (
        <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50 w-[96vw] max-w-xs sm:max-w-sm">
          <div className="bg-green-600/90 text-white px-2 py-2 sm:px-4 sm:py-3 rounded-xl shadow-lg flex items-center gap-2 w-full text-sm">
            <ShoppingCart size={20} />
            <div>
              <div className="font-bold">{Object.values(quantities).reduce((sum, q) => sum + q, 0)} {t('common.selectedProducts')}</div>
              <div className="text-sm">{t('common.total')}: {calculateNetTotal().toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</div>
            </div>
          </div>
        </div>
      )}
      <CalculationResultModal
        open={showResultModal}
        onClose={handleCloseSlip}
        result={calculatedResult}
        slipTitle={t('food.calculation.slipTitle') || 'Yemek Hesaplama Sonucu'}
        homemadeTotal={homemadeTotal}
        selectedRecipes={selectedRecipes}
        quantities={quantities}
        paidAmount={paidAmount}
      />
    </>
  );

};

export default FoodCalculator;