import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { foodItems } from '../data/foodItems';
import { CalcItem } from '../types';
import QuantitySelector from './QuantitySelector';
import { ShoppingCart } from 'lucide-react';
import { usePriceContext } from '../contexts/PriceContext';

const FoodCalculator: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<CalcItem[]>(foodItems);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0); // Ödenen toplam tutar
  const { firms, selectedFirm, setSelectedFirm, calculatePrices } = usePriceContext();

  // State to store the API response for calculated prices
  const [calculatedResult, setCalculatedResult] = useState<any>(null);

  // Categories for filtering
  const categories = [
    { id: 'all', name: t('food.categories.all') },
    { id: 'main', name: t('food.categories.main') },
    { id: 'side', name: t('food.categories.side') },
    { id: 'drink', name: t('food.categories.drink') },
    { id: 'dessert', name: t('food.categories.dessert') }
  ];

  // Filter items based on active category
  const filteredItems = activeCategory === 'all'
      ? items
      : items.filter(item => item.category === activeCategory);

  // Get selected items (quantity > 0)
  const selectedItems = items.filter(item => item.quantity > 0);

  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Handle quantity increase
  const handleIncreaseQuantity = (id: string) => {
    setItems(prev => prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = (id: string) => {
    setItems(prev => prev.map(item =>
        item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  // Handle discount change
  const handleDiscountChange = (value: number) => {
    setDiscount(Math.min(value, totalAmount)); // Ensure discount does not exceed total amount
  };

  // Handle paid amount change
  const handlePaidAmountChange = (value: number) => {
    setPaidAmount(value); // Update paid amount
  };

  // Handle price calculation
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
      const formattedDiscount = parseFloat(discount.toFixed(2)); // Ensure discount is sent as fixed decimal
      const formattedPaidAmount = parseFloat(paidAmount.toFixed(2)); // Ensure paid amount is sent as fixed decimal

      // Call the API with totalAmount, discount, and paidAmount
      const response = await calculatePrices(formattedPaidAmount, formattedDiscount);
      setCalculatedResult(response); // Store the API response in state
    } catch (error) {
      console.error('Error calculating price:', error);
      alert(t('food.calculation.calculationError'));
    }
  };

  return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Section: Food Items */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
                <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${activeCategory === category.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
              `}
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

        {/* Right Section: Cart and Summary */}
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

                  <div className="space-y-4 mb-4">
                    {/* Delivery Service Selection */}
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

                    {/* Discount Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('food.calculation.discount')}
                      </label>
                      <input
                          type="number"
                          min="0"
                          max={totalAmount}
                          step="0.01"
                          value={discount}
                          onChange={(e) => handleDiscountChange(Number(e.target.value))}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                          aria-label={t('food.calculation.discount')}
                      />
                    </div>

                    {/* Paid Amount Input */}
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
                          aria-label={t('food.calculation.paidAmount')}
                      />
                    </div>
                  </div>

                  {/* Tax Calculation */}
                  {calculatedResult && selectedFirm ? (
                      <div>
                        {/* Vergi (Tax) */}
                        <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('food.calculation.tax')} ({calculatedResult.firm.tax}%)
                    </span>
                          <span className="font-medium">{calculatedResult.tax.toFixed(2)}₺</span>
                        </div>

                        {/* İletişim Komisyonu (Communication Commission) */}
                        <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('food.calculation.communicationCommission')} ({calculatedResult.firm.communicationCommission}%)
                    </span>
                          <span className="font-medium">{calculatedResult.communicationCommission.toFixed(2)}₺</span>
                        </div>

                        {/* Komisyon (Commission) */}
                        <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('food.calculation.commission')} ({calculatedResult.firm.commission}%)
                    </span>
                          <span className="font-medium">{calculatedResult.commission.toFixed(2)}₺</span>
                        </div>

                        {/* İndirim Komisyonu (Discount Commission) - Sadece indirim varsa gösterilir */}
                        {discount > 0 && (
                            <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('food.calculation.discountCommission')} ({calculatedResult.firm.discountCommission}%)
                      </span>
                              <span className="font-medium">{calculatedResult.discountCommission.toFixed(2)}₺</span>
                            </div>
                        )}

                        {/* Kar (Profit) */}
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-600 dark:text-gray-400">{t('food.calculation.profit')}</span>
                          <span className="font-medium">{calculatedResult.profit.toFixed(2)}₺</span>
                        </div>
                      </div>
                  ) : null}
                </div>

                {/* Total Amount */}
                <div className="border-t-2 border-green-500 dark:border-green-400 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-800 dark:text-white">{t('food.calculation.total')}</span>
                    <span className="font-bold text-xl text-green-600 dark:text-green-400">
                  {calculatedResult ? calculatedResult.fullPrice.toFixed(2) : ((totalAmount - discount)).toFixed(2)}₺
                </span>
                  </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleCalculatePrice}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg mt-6 transition-colors flex items-center justify-center gap-2"
                    aria-label={t('food.calculation.save')}
                >
                  <ShoppingCart size={18} />
                  {t('food.calculation.save')}
                </button>
              </>
          ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 dark:text-gray-400">
                <ShoppingCart size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                <p className="mb-2">{t('food.calculation.empty')}</p>
                <p className="text-sm">{t('food.calculation.addItems')}</p>
              </div>
          )}

          {/* Comparison Section */}
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">{t('food.calculation.compare')}</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">{t('food.calculation.avgMealCost')}</span>
              <span className="font-medium text-yellow-600 dark:text-yellow-400">{totalAmount.toFixed(2)}₺</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-700 dark:text-gray-300">{t('food.calculation.paidAmount')}</span>
              <span className="font-medium text-yellow-600 dark:text-yellow-400">{paidAmount.toFixed(2)}₺</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-700 dark:text-gray-300">{t('food.calculation.difference')}</span>
              <span className="font-medium text-yellow-600 dark:text-yellow-400">
              {Math.abs(totalAmount - paidAmount).toFixed(2)}₺
            </span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default FoodCalculator;