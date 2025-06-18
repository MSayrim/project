import React, { useState, createContext } from 'react';
import IngredientsTab from './IngredientsTab';
import IngredientPricesTab from './IngredientPricesTab';
import RecipesTab from './RecipesTab';

// Form context to control form visibility across tabs
type FormContextType = {
  closeAllForms: () => void;
};

export const FormContext = createContext<FormContextType>({
  closeAllForms: () => {}
});

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'recipes' | 'ingredientPrices'>('ingredients');
  
  // Form visibility state for each tab
  const [isIngredientFormOpen, setIsIngredientFormOpen] = useState(false);
  const [isRecipeFormOpen, setIsRecipeFormOpen] = useState(false);
  const [isPriceFormOpen, setIsPriceFormOpen] = useState(false);

  // Close all forms when switching tabs
  const handleTabChange = (tab: 'ingredients' | 'recipes' | 'ingredientPrices') => {
    setActiveTab(tab);
    setIsIngredientFormOpen(false);
    setIsRecipeFormOpen(false);
    setIsPriceFormOpen(false);
  };

  // Context provider value for closing all forms
  const formContextValue = {
    closeAllForms: () => {
      setIsIngredientFormOpen(false);
      setIsRecipeFormOpen(false);
      setIsPriceFormOpen(false);
    }
  };

  return (
    <FormContext.Provider value={formContextValue}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-violet-600 dark:text-violet-400">
            Admin Panel
          </h1>
          
          <div className="mb-6">
            <ul className="flex border-b border-gray-200 dark:border-gray-700">
              <li className="mr-2">
                <button 
                  className={`py-2 px-4 rounded-t-lg ${activeTab === 'ingredients' ? 'bg-violet-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                  onClick={() => handleTabChange('ingredients')}
                >
                  Malzemeler
                </button>
              </li>
              <li className="mr-2">
                <button 
                  className={`py-2 px-4 rounded-t-lg ${activeTab === 'recipes' ? 'bg-violet-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                  onClick={() => handleTabChange('recipes')}
                >
                  Tarifler
                </button>
              </li>
              <li>
                <button 
                  className={`py-2 px-4 rounded-t-lg ${activeTab === 'ingredientPrices' ? 'bg-violet-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                  onClick={() => handleTabChange('ingredientPrices')}
                >
                  Malzeme Fiyatları
                </button>
              </li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {activeTab === 'ingredients' && (
              <IngredientsTab isFormOpen={isIngredientFormOpen} setIsFormOpen={setIsIngredientFormOpen} />
            )}
            
            {activeTab === 'recipes' && (
              <RecipesTab isFormOpen={isRecipeFormOpen} setIsFormOpen={setIsRecipeFormOpen} />
            )}
            
            {activeTab === 'ingredientPrices' && (
              <IngredientPricesTab isFormOpen={isPriceFormOpen} setIsFormOpen={setIsPriceFormOpen} />
            )}
          </div>
        </div>
      </div>
    </FormContext.Provider>
  );
};

export default AdminPage;
