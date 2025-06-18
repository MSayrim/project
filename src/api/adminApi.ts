import { API_ROOT, MIP_CONTEXT } from './config';

// Types for admin API
export interface GenericServiceResult<T = any> {
  resultMapping: string;
  responseData: T;
}

export interface IngredientDto {
  id?: string;
  name: string;
  season: string;
  proccessed: boolean;
  imageUrl: string;
  createdDate?: string;
  createdBy?: string;
  modifiedDate?: string;
  modifiedBy?: string;
  active?: boolean;
  deleted?: boolean;
}

export interface RecipeIngredientDto {
  id?: string;
  ingredient: IngredientDto;
  value: number;
  measurementType: string;
  createdDate?: string;
  createdBy?: string;
  modifiedDate?: string;
  modifiedBy?: string;
  active?: boolean;
  deleted?: boolean;
}

export interface RecipeDto {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  foodType: string;
  recipeIngredients: RecipeIngredientDto[];
  createdDate?: string;
  createdBy?: string;
  modifiedDate?: string;
  modifiedBy?: string;
  active?: boolean;
  deleted?: boolean;
}

export interface IngredientPriceDto {
  id?: string;
  ingredient: IngredientDto;
  price: number;
  value: number;
  measurementType: string;
  priceDate: string;
  createdDate?: string;
  createdBy?: string;
  modifiedDate?: string;
  modifiedBy?: string;
  active?: boolean;
  deleted?: boolean;
}

export enum FoodType {
  MAIN = "Ana Yemek",
  SIDE = "Yan Yemek",
  DRINK = "İçecekler",
  DESSERT = "Tatlı"
}

export enum MeasurementType {
  LT = "LT",
  ML = "ML",
  GR = "GR",
  KG = "KG",
  PIECE = "PIECE",
  TBSP = "TBSP",
  TSP = "TSP",
  CUP = "CUP",
  PINCH = "PINCH",
  OZ = "OZ",
  LB = "LB",
  SLICE = "SLICE",
  STICK = "STICK",
  BUNCH = "BUNCH",
  CAN = "CAN",
  PACKET = "PACKET",
  CL = "CL",
  DROP = "DROP",
  HEAD = "HEAD",
  CLOVE = "CLOVE",
  BAG = "BAG"
}

export enum Season {
  ALL_SEASON = "Tüm Sezonlar",
  WINTER = "Kış",
  SUMMER = "Yaz",
  AUTUMN = "Sonbahar",
  SPRING = "İlkbahar"
}

// Ingredient API
export const getAllIngredients = async (): Promise<IngredientDto[]> => {
  try {
    const response = await fetch(`${API_ROOT}${MIP_CONTEXT}/ingredient/list-all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ingredients: ${response.status} ${response.statusText}`);
    }

    const data: GenericServiceResult<IngredientDto[]> = await response.json();

    if (data.resultMapping !== 'SUCCESS') {
      throw new Error(`API Error: ${data.resultMapping}`);
    }

    return data.responseData;
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
};

export const saveOrUpdateIngredient = async (ingredient: IngredientDto): Promise<IngredientDto> => {
  try {
    const response = await fetch(`${API_ROOT}${MIP_CONTEXT}/ingredient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ingredient)
    });

    if (!response.ok) {
      throw new Error(`Failed to save ingredient: ${response.status} ${response.statusText}`);
    }

    const data: GenericServiceResult<IngredientDto> = await response.json();

    if (data.resultMapping !== 'SUCCESS') {
      throw new Error(`API Error: ${data.resultMapping}`);
    }

    return data.responseData;
  } catch (error) {
    console.error('Error saving ingredient:', error);
    throw error;
  }
};

// Recipe API
export const getAllRecipes = async (): Promise<RecipeDto[]> => {
  try {
    const response = await fetch(`${API_ROOT}${MIP_CONTEXT}/recipe/list-all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recipes: ${response.status} ${response.statusText}`);
    }

    const data: GenericServiceResult<RecipeDto[]> = await response.json();

    if (data.resultMapping !== 'SUCCESS') {
      throw new Error(`API Error: ${data.resultMapping}`);
    }

    return data.responseData;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

export const saveOrUpdateRecipe = async (recipe: RecipeDto): Promise<RecipeDto> => {
  try {
    const response = await fetch(`${API_ROOT}${MIP_CONTEXT}/recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipe)
    });

    if (!response.ok) {
      throw new Error(`Failed to save recipe: ${response.status} ${response.statusText}`);
    }

    const data: GenericServiceResult<RecipeDto> = await response.json();

    if (data.resultMapping !== 'SUCCESS') {
      throw new Error(`API Error: ${data.resultMapping}`);
    }

    return data.responseData;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
};

// Ingredient Price API
export const getAllIngredientPrices = async (): Promise<IngredientPriceDto[]> => {
  try {
    const response = await fetch(`${API_ROOT}${MIP_CONTEXT}/ingredient-price/list-all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ingredient prices: ${response.status} ${response.statusText}`);
    }

    const data: GenericServiceResult<IngredientPriceDto[]> = await response.json();

    if (data.resultMapping !== 'SUCCESS') {
      throw new Error(`API Error: ${data.resultMapping}`);
    }

    return data.responseData;
  } catch (error) {
    console.error('Error fetching ingredient prices:', error);
    throw error;
  }
};

export const saveOrUpdateIngredientPrice = async (ingredientPrice: IngredientPriceDto): Promise<IngredientPriceDto> => {
  try {
    const response = await fetch(`${API_ROOT}${MIP_CONTEXT}/ingredient-price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ingredientPrice)
    });

    if (!response.ok) {
      throw new Error(`Failed to save ingredient price: ${response.status} ${response.statusText}`);
    }

    const data: GenericServiceResult<IngredientPriceDto> = await response.json();

    if (data.resultMapping !== 'SUCCESS') {
      throw new Error(`API Error: ${data.resultMapping}`);
    }

    return data.responseData;
  } catch (error) {
    console.error('Error saving ingredient price:', error);
    throw error;
  }
};

// Son 3 ay içinde fiyat girilmemiş malzemeleri getir
export const getIngredientsWithoutRecentPrices = async (): Promise<IngredientDto[]> => {
  try {
    // Tüm malzemeleri al
    const allIngredients = await getAllIngredients();
    
    // Tüm fiyatları al
    const allPrices = await getAllIngredientPrices();
    
    // Şu anki tarih
    const now = new Date();
    
    // 3 ay öncesinin tarihi
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    
    // Fiyatı olan malzemelerin ID'lerini topla
    const ingredientsWithPriceIds = new Set(
      allPrices.map(price => price.ingredient?.id).filter(Boolean)
    );
    
    // Son 3 ay içinde fiyatı olmayan malzemeleri filtrele
    const ingredientsWithoutRecentPrices = allIngredients.filter(ingredient => {
      // Bu malzemeye hiç fiyat girilmemiş mi?
      if (!ingredientsWithPriceIds.has(ingredient.id)) {
        return true; // Hiç fiyat girilmemiş
      }
      
      // Bu malzemeye ait tüm fiyatları bul
      const ingredientPrices = allPrices.filter(price => 
        price.ingredient?.id === ingredient.id
      );
      
      // Hiç fiyat yoksa (bu normalde olmamalı çünkü yukarıda kontrol ettik)
      if (ingredientPrices.length === 0) {
        return true;
      }
      
      // En son fiyat tarihini bul
      const latestPriceDate = new Date(Math.max(
        ...ingredientPrices.map(price => new Date(price.priceDate).getTime())
      ));
      
      // Son fiyat 3 aydan eski mi?
      return latestPriceDate < threeMonthsAgo;
    });
    
    return ingredientsWithoutRecentPrices;
  } catch (error) {
    console.error('Error fetching ingredients without recent prices:', error);
    throw error;
  }
};
