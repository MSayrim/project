import React, { useState, useEffect, useMemo, useContext } from 'react';
import { 
  getAllRecipes, 
  saveOrUpdateRecipe, 
  getAllIngredients,
  RecipeDto, 
  IngredientDto, 
  RecipeIngredientDto,
  FoodType,
  MeasurementType
} from '../../api/adminApi';
import { FormContext } from './AdminPage';

interface RecipesTabProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
}

const RecipesTab: React.FC<RecipesTabProps> = ({ isFormOpen, setIsFormOpen }) => {
  const [recipes, setRecipes] = useState<RecipeDto[]>([]);
  const [ingredients, setIngredients] = useState<IngredientDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formContext = useContext(FormContext);
  
  // Table search filters
  const [nameFilter, setNameFilter] = useState('');
  const [foodTypeFilter, setFoodTypeFilter] = useState('');
  const [ingredientCountFilter, setIngredientCountFilter] = useState('');
  
  // Form state
  const [currentRecipe, setCurrentRecipe] = useState<RecipeDto>({
    name: '',
    description: '',
    foodType: 'MAIN',
    imageUrl: '',
    recipeIngredients: [],
  });
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientDto | null>(null);
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [ingredientUnit, setIngredientUnit] = useState(MeasurementType.GRAM);
  const [currentSearch, setCurrentSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  useEffect(() => {
    fetchRecipes();
    fetchIngredients();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await getAllRecipes();
      setRecipes(data);
      setError(null);
    } catch (err) {
      setError('Tarifler yüklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIngredients = async () => {
    try {
      const data = await getAllIngredients();
      setIngredients(data);
    } catch (err) {
      console.error('Malzemeler yüklenirken bir hata oluştu:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleAddIngredient = () => {
    if (!selectedIngredient || !ingredientQuantity) {
      return;
    }

    const newRecipeIngredient: RecipeIngredientDto = {
      ingredient: selectedIngredient,
      value: parseFloat(ingredientQuantity),
      measurementType: ingredientUnit || MeasurementType.GRAM,
    };

    setCurrentRecipe(prev => ({
      ...prev,
      recipeIngredients: [...prev.recipeIngredients, newRecipeIngredient]
    }));

    setSelectedIngredient(null);
    setIngredientQuantity('');
    setIngredientUnit(MeasurementType.GRAM);
  };

  const handleRemoveIngredient = (index: number) => {
    setCurrentRecipe(prev => ({
      ...prev,
      recipeIngredients: prev.recipeIngredients.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentRecipe.name.trim()) {
      setError('Tarif adı boş olamaz.');
      return;
    }
    
    if (currentRecipe.recipeIngredients.length === 0) {
      setError('En az bir malzeme ekleyin.');
      return;
    }
    
    try {
      setLoading(true);
      await saveOrUpdateRecipe(currentRecipe);
      await fetchRecipes();
      
      // Sadece form verilerini sıfırla ama formu kapatma
      if (isEditing) {
        // Düzenleme modundaysak tam sıfırlama ve formu kapatabiliriz
        resetForm();
        setIsFormOpen(false);
      } else {
        // Ekleme modundaysak formu açık tutup yeni veri girişi için hazırla
        setCurrentRecipe({
          name: '',
          description: '',
          imageUrl: '',
          foodType: 'MAIN',
          recipeIngredients: []
        });
        setCurrentSearch('');
        setSelectedIngredient(null);
        setIngredientQuantity('');
        setIngredientUnit(MeasurementType.GRAM);
        setIsEditing(false);
        setError(null);
      }
    } catch (err) {
      setError('Tarif kaydedilirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (recipe: RecipeDto) => {
    setCurrentRecipe({ ...recipe });
    setIsEditing(true);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setCurrentRecipe({
      name: '',
      description: '',
      foodType: 'MAIN',
      imageUrl: '',
      recipeIngredients: [],
    });
    setSelectedIngredient(null);
    setIngredientQuantity('');
    setIngredientUnit(MeasurementType.GRAM);
    setCurrentSearch('');
    setIsEditing(false);
    setError(null);
  };

  const filteredIngredients = useMemo(() => {
    if (!currentSearch.trim()) return ingredients;
    
    return ingredients.filter(ingredient => 
      ingredient.name.toLowerCase().includes(currentSearch.toLowerCase())
    );
  }, [ingredients, currentSearch]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const nameMatch = !nameFilter || 
        recipe.name.toLowerCase().includes(nameFilter.toLowerCase());
      
      const foodTypeMatch = !foodTypeFilter || 
        getFoodTypeDisplayValue(recipe.foodType).toLowerCase().includes(foodTypeFilter.toLowerCase());
      
      // Malzeme sayısı filtresini, girilen sayıdan büyük veya eşit olanları gösterecek şekilde değiştir
      const ingredientCountMatch = !ingredientCountFilter || 
        recipe.recipeIngredients.length >= parseInt(ingredientCountFilter, 10);
      
      return nameMatch && foodTypeMatch && ingredientCountMatch;
    });
  }, [recipes, nameFilter, foodTypeFilter, ingredientCountFilter]);

  const getFoodTypeDisplayValue = (key: string): string => {
    return FoodType[key as keyof typeof FoodType] || FoodType.MAIN;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Tarifler</h2>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(!isFormOpen);
          }}
          className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
        >
          {isFormOpen ? 'İptal' : 'Yeni Tarif Ekle'}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white dark:bg-gray-700 p-5 rounded-md mb-6 shadow-md transition-all duration-300">
          <h3 className="text-lg font-medium mb-4">{isEditing ? 'Tarif Düzenle' : 'Yeni Tarif Ekle'}</h3>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tarif Adı</label>
                <input
                  type="text"
                  name="name"
                  value={currentRecipe.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Yemek Türü</label>
                <select
                  name="foodType"
                  value={currentRecipe.foodType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  {Object.keys(FoodType).map((key) => (
                    <option key={key} value={key}>{FoodType[key as keyof typeof FoodType]}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Açıklama</label>
              <textarea
                name="description"
                value={currentRecipe.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Görsel URL</label>
              <input
                type="text"
                name="imageUrl"
                value={currentRecipe.imageUrl || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Malzemeler</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                <div className="md:col-span-2 relative">
                  <label className="block text-sm font-medium mb-1">Malzeme</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Malzeme ara..."
                      value={currentSearch}
                      onChange={(e) => {
                        setCurrentSearch(e.target.value);
                        setDropdownOpen(true);
                      }}
                      onFocus={() => setDropdownOpen(true)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                    {dropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-md max-h-60 overflow-auto rounded-md">
                        {filteredIngredients.length > 0 ? (
                          filteredIngredients.map((ingredient) => (
                            <div
                              key={ingredient.id}
                              className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => {
                                setSelectedIngredient(ingredient);
                                setCurrentSearch(ingredient.name);
                                setDropdownOpen(false);
                              }}
                            >
                              {ingredient.name}
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-500 dark:text-gray-400">
                            Sonuç bulunamadı
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Miktar</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={ingredientQuantity}
                    onChange={(e) => setIngredientQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Birim</label>
                  <select
                    value={ingredientUnit || MeasurementType.GRAM}
                    onChange={(e) => setIngredientUnit(e.target.value as MeasurementType)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    {Object.entries(MeasurementType).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                type="button"
                disabled={!selectedIngredient || !ingredientQuantity}
                onClick={handleAddIngredient}
                className="mb-4 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Malzeme Ekle
              </button>
              
              {currentRecipe.recipeIngredients.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium mb-2">Eklenen Malzemeler</h5>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {currentRecipe.recipeIngredients.map((ri, index) => (
                        <li key={index} className="py-2 flex justify-between items-center text-sm">
                          <span>
                            {ri.ingredient.name} - {ri.value} {MeasurementType[ri.measurementType as keyof typeof MeasurementType]}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <span>✕</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsFormOpen(false);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md shadow-sm transition-colors"
                disabled={loading || currentRecipe.recipeIngredients.length === 0}
              >
                {loading ? 'Kaydediliyor...' : isEditing ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-700 p-5 rounded-md shadow-md">
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Ad</label>
            <input
              type="text"
              placeholder="Tarif ara..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Yemek Türü</label>
            <select
              value={foodTypeFilter}
              onChange={(e) => setFoodTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            >
              <option value="">Tümü</option>
              {Object.keys(FoodType).map((key) => (
                <option key={key} value={key}>{FoodType[key as keyof typeof FoodType]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Malzeme Sayısı</label>
            <input
              type="number"
              min="0"
              placeholder="Min malzeme sayısı"
              value={ingredientCountFilter}
              onChange={(e) => setIngredientCountFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Yemek Türü
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Malzeme Sayısı
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => (
                  <tr key={recipe.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{recipe.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{getFoodTypeDisplayValue(recipe.foodType)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{recipe.recipeIngredients?.length || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(recipe)}
                        className="text-violet-600 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300 mr-3"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(recipe.id!)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {loading ? 'Yükleniyor...' : 'Tarif bulunamadı'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecipesTab;
