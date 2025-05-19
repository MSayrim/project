export interface CalcItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface CalculationType {
  id: string;
  name: string;
  icon: string;
  available: boolean;
  description: string;
}

export interface Calculation {
  id: string;
  type: string;
  items: CalcItem[];
  total: number;
  date: Date;
}

export interface Firm {
  id: string;
  name: string;
  code: string;
  communicationCommission?: number;
  tax?: number;
  discountCommission?: number;
  commission?: number;
}

export interface PriceCalculationRequest {
  fullPrice: number;
  discount: number;
  firm: {
    name: string;
    code: string;
  };
}

export interface PriceCalculationResponse {
  fullPrice: number;
  discount: number;
  discountCommission: number;
  tax: number;
  communicationCommission: number;
  commission: number;
  profit: number;
  firm: Firm;
}

export interface ApiResponse<T> {
  resultMapping: string;
  responseData: T;
}