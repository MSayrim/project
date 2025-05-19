import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePriceContext } from '../contexts/PriceContext';
import type { PriceCalculationResponse } from '../types';
import { Calculator, AlertCircle } from 'lucide-react';

const PriceCalculator: React.FC = () => {
  const { t } = useTranslation();
  const { firms, loading, error, selectedFirm, setSelectedFirm, calculatePrices } = usePriceContext();
  
  const [fullPrice, setFullPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [result, setResult] = useState<PriceCalculationResponse | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFirm) return;

    setCalculating(true);
    setCalculationError(null);
    
    try {
      const result = await calculatePrices(fullPrice, discount);
      setResult(result);
    } catch (err) {
      setCalculationError('Failed to calculate price. Please try again.');
      console.error('Calculation failed:', err);
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-6 w-6 text-green-500" />
        <h2 className="text-xl font-bold">Price Calculator</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
          <AlertCircle size={16} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleCalculate} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Firm
          </label>
          <select
            value={selectedFirm?.code || ''}
            onChange={(e) => setSelectedFirm(firms.find(f => f.code === e.target.value) || null)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            required
          >
            <option value="">Select a firm</option>
            {firms.map((firm) => (
              <option key={firm.code} value={firm.code}>
                {firm.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Price
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={fullPrice}
              onChange={(e) => setFullPrice(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Discount
            </label>
            <input
              type="number"
              min="0"
              max={fullPrice}
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              required
            />
          </div>
        </div>

        {calculationError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {calculationError}
          </div>
        )}

        <button
          type="submit"
          disabled={calculating || !selectedFirm}
          className={`w-full py-2 px-4 rounded-lg font-medium text-white
            ${calculating || !selectedFirm
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
            } transition-colors`}
        >
          {calculating ? 'Calculating...' : 'Calculate and Save'}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="font-medium text-lg mb-4">Calculation Results for {result.firm.name}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Full Price:</span>
                <span className="font-medium">{result.fullPrice.toFixed(2)}₺</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                <span className="font-medium text-green-500">-{result.discount.toFixed(2)}₺</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                <span className="font-medium">{result.tax.toFixed(2)}₺</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Commission:</span>
                <span className="font-medium">{result.commission.toFixed(2)}₺</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Discount Commission:</span>
                <span className="font-medium">{result.discountCommission.toFixed(2)}₺</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Communication Fee:</span>
                <span className="font-medium">{result.communicationCommission.toFixed(2)}₺</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Final Profit:</span>
              <span className="text-xl font-bold text-green-500">{result.profit.toFixed(2)}₺</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceCalculator;