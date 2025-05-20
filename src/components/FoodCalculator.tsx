import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { foodItems } from '../data/foodItems';
import { CalcItem } from '../types';
import QuantitySelector from './QuantitySelector';
import { ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
import { usePriceContext } from '../contexts/PriceContext';
import Advertisement from "./Advertisement.tsx";
import advertisementImage2 from '../assets/images.png';

const FoodCalculator: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<CalcItem[]>(foodItems);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const { firms, selectedFirm, setSelectedFirm, calculatePrices } = usePriceContext();
  const [calculatedResult, setCalculatedResult] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: t('food.categories.all') },
    { id: 'main', name: t('food.categories.main') },
    { id: 'side', name: t('food.categories.side') },
    { id: 'drink', name: t('food.categories.drink') },
    { id: 'dessert', name: t('food.categories.dessert') }
  ];

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);

  const selectedItems = items.filter(item => item.quantity > 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleIncreaseQuantity = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const handleDecreaseQuantity = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const handleDiscountChange = (value: number) => {
    // Ensure discount cannot exceed paid amount
    setDiscount(Math.min(value, paidAmount));
  };

  const handlePaidAmountChange = (value: number) => {
    setPaidAmount(value);
    // Adjust discount if it exceeds new paid amount
    if (discount > value) {
      setDiscount(value);
    }
  };

  const handleCalculatePrice = async () => {
    if (!selectedFirm) {
      alert(t('food.calculation.selectFirm'));
      return;
    }

    if (selectedItems.length === 0) {
      alert(t('food.calculation.addItems'));
      return;
    }

    try {
      setCalculating(true);
      const formattedDiscount = parseFloat(discount.toFixed(2));
      const formattedPaidAmount = parseFloat(paidAmount.toFixed(2));
      const response = await calculatePrices(formattedPaidAmount, formattedDiscount);
      setCalculatedResult(response);
      setCalculationError(null);
    } catch (error) {
      console.error('Error calculating price:', error);
      setCalculationError(t('food.calculation.calculationError'));
    } finally {
      setCalculating(false);
    }
  };

  const totalCommissions = calculatedResult
    ? calculatedResult.tax + calculatedResult.commission + calculatedResult.communicationCommission +
      (calculatedResult.discountCommission || 0)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Left Section: Payment Info and Food Items */}
      <div className="lg:col-span-2 space-y-6">
        {/* Payment Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">{t('food.calculation.paymentInfo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('food.calculation.selectService')}
              </label>
              <select
                value={selectedFirm?.code || ''}
                onChange={(e) => setSelectedFirm(firms.find(f => f.code === e.target.value) || null)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                required
              >
                <option value="">{t('food.calculation.selectServicePlaceholder')}</option>
                {firms.map((firm) => (
                  <option key={firm.code} value={firm.code}>
                    {firm.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('food.calculation.paidAmount')}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={paidAmount}
                onChange={(e) => handlePaidAmountChange(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('food.calculation.discount')}
              </label>
              <input
                type="number"
                min="0"
                max={paidAmount}
                step="0.01"
                value={discount}
                onChange={(e) => handleDiscountChange(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleCalculatePrice}
                disabled={calculating}
                className={`w-full ${
                  calculating 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600'
                } text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2`}
              >
                <ShoppingCart size={18} />
                {calculating ? t('food.calculation.calculating') : t('food.calculation.calculate')}
              </button>
            </div>
          </div>

          {calculationError && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {calculationError}
            </div>
          )}
        </div>

        {/* Food Items Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${activeCategory === category.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className={`
                  bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600
                  ${item.quantity > 0 ? 'ring-2 ring-green-500 dark:ring-green-400' : ''}
                  transition-all duration-200 hover:shadow-md
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">{item.name}</h3>
                  <span className="text-green-600 dark:text-green-400 font-semibold">{item.price}₺</span>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.category}</span>
                  <QuantitySelector
                    quantity={item.quantity}
                    onIncrease={() => handleIncreaseQuantity(item.id)}
                    onDecrease={() => handleDecreaseQuantity(item.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section: Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-fit">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('food.calculation.title')}</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{t('calculator.types.food')}</span>
        </div>

        {selectedItems.length > 0 ? (
          <>
            <div className="space-y-4 mb-6">
              {selectedItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-md text-xs mr-2">
                      x{item.quantity}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {(item.price * item.quantity).toFixed(2)}₺
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 dark:text-gray-400">{t('food.calculation.subtotal')}</span>
                <span className="font-medium">{totalAmount.toFixed(2)}₺</span>
              </div>

              {calculatedResult && (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      <span>Total Commissions</span>
                      {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <span className="font-medium">{totalCommissions.toFixed(2)}₺</span>
                  </div>

                  {showDetails && (
                    <div className="space-y-2 ml-4 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                          {t('food.calculation.tax')} ({calculatedResult.firm.tax}%)
                        </span>
                        <span className="font-medium">{calculatedResult.tax.toFixed(2)}₺</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                          {t('food.calculation.commission')} ({calculatedResult.firm.commission}%)
                        </span>
                        <span className="font-medium">{calculatedResult.commission.toFixed(2)}₺</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                          {t('food.calculation.communicationCommission')} ({calculatedResult.firm.communicationCommission}%)
                        </span>
                        <span className="font-medium">{calculatedResult.communicationCommission.toFixed(2)}₺</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            {t('food.calculation.discountCommission')} ({calculatedResult.firm.discountCommission}%)
                          </span>
                          <span className="font-medium">{calculatedResult.discountCommission.toFixed(2)}₺</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="border-t-2 border-green-500 dark:border-green-400 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-gray-800 dark:text-white">{t('food.calculation.total')}</span>
                <span className="font-bold text-xl text-green-600 dark:text-green-400">
                  {calculatedResult ? calculatedResult.fullPrice.toFixed(2) : ((totalAmount - discount)).toFixed(2)}₺
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 dark:text-gray-400">
            <ShoppingCart size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="mb-2">{t('food.calculation.empty')}</p>
            <p className="text-sm">{t('food.calculation.addItems')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCalculator;