import { API_BASE_URL, endpoints } from './config';
import type { ApiResponse, Firm, PriceCalculationRequest, PriceCalculationResponse } from '../types';

// Function to fetch firms from the API
export const getFirms = async (): Promise<Firm[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoints.firms}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch firms: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse<Firm[]> = await response.json();

    if (data.resultMapping !== 'SUCCESS') {
      throw new Error(`API Error: ${data.resultMapping}`);
    }

    return data.responseData;
  } catch (error) {
    console.error('Error fetching firms:', error);
    throw error;
  }
};

// Function to calculate price using the API
export const calculatePrice = async (
    request: PriceCalculationRequest
): Promise<PriceCalculationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoints.calculate}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Failed to calculate price: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse<PriceCalculationResponse> = await response.json();

    if (data.resultMapping !== 'SUCCESS') {
      throw new Error(`API Error: ${data.resultMapping}`);
    }

    return data.responseData;
  } catch (error) {
    console.error('Error calculating price:', error);
    throw error;
  }
};