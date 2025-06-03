import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { setSelectedFirm, calculatePrices } from '../store/priceSlice';
import type { PriceCalculationResponse, Firm } from '../types';
import { Calculator, AlertCircle } from 'lucide-react';

const PriceCalculator: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { firms, loading, error, selectedFirm, result } = useSelector((state: RootState) => state.price);

  const [fullPrice, setFullPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFirm) return;
    setCalculationError(null);
    try {
      await dispatch(calculatePrices({ fullPrice, discount }));
    } catch (err) {
      setCalculationError(t('calculator.price.calculationError'));
      console.error('Calculation failed:', err);
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
        <h2 className="text-xl font-bold">{t('calculator.price.title')}</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
          <AlertCircle size={16} />
          <p className="text-sm">{error}</p>
        </div>
      )}
      {calculationError && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-800 dark:text-red-200">
          <AlertCircle size={16} />
          <p className="text-sm">{calculationError}</p>
        </div>
      )}

      <form onSubmit={handleCalculate} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('calculator.price.selectFirm')}
          </label>
          <select
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            value={selectedFirm?.id || ''}
            onChange={e => {
              const firm = firms.find(f => f.id === e.target.value) || null;
              dispatch(setSelectedFirm(firm));
            }}
          >
            <option value="">{t('calculator.price.selectFirmOption')}</option>
            {firms.map(firm => (
              <option key={firm.id} value={firm.id}>{firm.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('calculator.price.fullPrice')}
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              value={fullPrice === 0 ? '' : fullPrice.toString().replace('.', ',')}
              onChange={e => {
                const value = e.target.value.replace(',', '.');
                setFullPrice(value === '' ? 0 : Number(value));
              }}
              placeholder="0,00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('calculator.price.discount')}
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              value={discount === 0 ? '' : discount.toString().replace('.', ',')}
              onChange={e => {
                const value = e.target.value.replace(',', '.');
                setDiscount(value === '' ? 0 : Number(value));
              }}
              placeholder="0,00"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-lg font-medium text-white
            ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
            } transition-colors`}
          disabled={loading}
        >
          {loading ? t('calculator.price.calculating') : t('calculator.price.calculateAndSave')}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-2 pt-6">
          {/* Komisyonlar */}
          <div>
            <span className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">{t('calculator.price.commissions')}</span>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('calculator.price.commission')}</span>
              <span className="font-medium">{result.commission.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('calculator.price.communicationCommission')}</span>
              <span className="font-medium">{result.communicationCommission.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
            </div>
          </div>
          {/* KDV - Komisyonların hemen ALTINDA, Restoran Kârının ÜSTÜNDE */}
          <div className="flex justify-between mt-2">
            <span className="text-gray-600 dark:text-gray-400">{t('calculator.price.tax')}</span>
            <span className="font-medium">{result.tax.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
          </div>
          {/* Restoran Kârı */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-lg font-bold">{t('calculator.price.profit')}</span>
            <span className="text-xl font-bold text-green-500">{result.profit.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}₺</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceCalculator;