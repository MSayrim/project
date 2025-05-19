import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFirms, calculatePrice } from '../api/priceApi';
import type { Firm, PriceCalculationRequest, PriceCalculationResponse } from '../types';

interface PriceContextType {
  firms: Firm[];
  loading: boolean;
  error: string | null;
  selectedFirm: Firm | null;
  setSelectedFirm: (firm: Firm | null) => void;
  calculatePrices: (fullPrice: number, discount: number) => Promise<PriceCalculationResponse>;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

// Default firms for fallback when API fails
const defaultFirms: Firm[] = [
  {
    id: '1',
    name: 'Trendyol',
    code: 'tgo',
    communicationCommission: 60,
    tax: 8,
    discountCommission: 20,
    commission: 10
  },
  {
    id: '2',
    name: 'Hepsiburada',
    code: 'hb',
    communicationCommission: 55,
    tax: 8,
    discountCommission: 18,
    commission: 9
  }
];

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firms, setFirms] = useState<Firm[]>(defaultFirms);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFirm, setSelectedFirm] = useState<Firm | null>(null);

  useEffect(() => {
    const loadFirms = async () => {
      try {
        const firmData = await getFirms();
        if (firmData && firmData.length > 0) {
          setFirms(firmData);
          setError(null);
        } else {
          throw new Error('No firms returned from API');
        }
      } catch (err) {
        console.error('Failed to load firms, using default data:', err);
        setError('Could not load firms from server, using default data');
        // Fall back to default firms
        setFirms(defaultFirms);
      } finally {
        setLoading(false);
      }
    };

    loadFirms();
  }, []);

  const calculatePrices = async (fullPrice: number, discount: number): Promise<PriceCalculationResponse> => {
    if (!selectedFirm) {
      throw new Error('No firm selected');
    }

    const request: PriceCalculationRequest = {
      fullPrice,
      discount,
      firm: {
        name: selectedFirm.name,
        code: selectedFirm.code
      }
    };

    try {
      const response = await calculatePrice(request);
      return response;
    } catch (err) {
      console.error('Failed to calculate price, using estimated values:', err);
      // Fallback calculation logic
      const calculatedProfit =
          fullPrice -
          discount -
          (discount * selectedFirm.discountCommission!) / 100 -
          (fullPrice * selectedFirm.tax!) / 100 -
          (fullPrice * selectedFirm.commission!) / 100 -
          (selectedFirm.communicationCommission || 0);

      return {
        fullPrice,
        discount,
        discountCommission: (discount * selectedFirm.discountCommission!) / 100,
        tax: (fullPrice * selectedFirm.tax!) / 100,
        communicationCommission: selectedFirm.communicationCommission || 0,
        commission: (fullPrice * selectedFirm.commission!) / 100,
        profit: calculatedProfit,
        firm: selectedFirm
      };
    }
  };

  return (
      <PriceContext.Provider
          value={{
            firms,
            loading,
            error,
            selectedFirm,
            setSelectedFirm,
            calculatePrices
          }}
      >
        {children}
      </PriceContext.Provider>
  );
};

export const usePriceContext = () => {
  const context = useContext(PriceContext);
  if (context === undefined) {
    throw new Error('usePriceContext must be used within a PriceProvider');
  }
  return context;
};