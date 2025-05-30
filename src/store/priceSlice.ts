import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { PriceCalculationResponse } from '../types';
import { API_ROOT, API_URLS } from '../api/config';

interface Firm {
  id: string;
  name: string;
}

interface PriceState {
  price: number | null;
  loading: boolean;
  error: string | null;
  firms: Firm[];
  selectedFirm: Firm | null;
  result: PriceCalculationResponse | null;
}

const initialState: PriceState = {
  price: null,
  loading: false,
  error: null,
  firms: [],
  selectedFirm: null,
  result: null,
};

export const calculatePrices = createAsyncThunk(
  'price/calculatePrices',
  async ({ fullPrice, discount, joker }: { fullPrice: number; discount: number; joker?: boolean }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as { price: PriceState };
      const firm = state.price.selectedFirm;
      
      const response = await fetch(`${API_ROOT}${API_URLS.calculate}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullPrice, 
          discount, 
          joker,
          firm
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to calculate price');
      }
      const data = await response.json();
      return data.responseData as PriceCalculationResponse;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchFirms = createAsyncThunk(
  'price/fetchFirms',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${API_ROOT}${API_URLS.price}`);
      const data = await response.json();
      return data.responseData || data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const priceSlice = createSlice({
  name: 'price',
  initialState,
  reducers: {
    setPrice(state, action: PayloadAction<number | null>) {
      state.price = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setFirms(state, action: PayloadAction<Firm[]>) {
      state.firms = action.payload;
    },
    setSelectedFirm(state, action: PayloadAction<Firm | null>) {
      state.selectedFirm = action.payload;
    },
    resetPrice(state) {
      state.price = null;
      state.error = null;
      state.loading = false;
      state.result = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculatePrices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculatePrices.fulfilled, (state, action: PayloadAction<PriceCalculationResponse>) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(calculatePrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFirms.fulfilled, (state, action: PayloadAction<Firm[]>) => {
        state.firms = action.payload;
      });
  },
});

export const { 
  setPrice, 
  setLoading, 
  setError, 
  setFirms, 
  setSelectedFirm, 
  resetPrice 
} = priceSlice.actions;
// export { fetchFirms }; // ÇİFT EXPORT HATASINI ENGELLEMEK İÇİN KALDIRILDI
export default priceSlice.reducer;
export type { Firm };
