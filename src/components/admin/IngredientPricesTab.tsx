import React, { useState, useEffect, useMemo, useContext } from 'react';
import { 
  getAllIngredientPrices, 
  saveOrUpdateIngredientPrice, 
  getAllIngredients,
  getIngredientsWithoutRecentPrices,
  IngredientPriceDto, 
  IngredientDto, 
  MeasurementType 
} from '../../api/adminApi';
import { FormContext } from './AdminPage';

interface IngredientPricesTabProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
}

const IngredientPricesTab: React.FC<IngredientPricesTabProps> = ({ isFormOpen, setIsFormOpen }) => {
  const [ingredientPrices, setIngredientPrices] = useState<IngredientPriceDto[]>([]);
  const [ingredients, setIngredients] = useState<IngredientDto[]>([]);
  const [ingredientsWithoutRecentPrices, setIngredientsWithoutRecentPrices] = useState<IngredientDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formContext = useContext(FormContext);
  
  // Search filters
  const [ingredientFilter, setIngredientFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [quantityFilter, setQuantityFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showNoRecentPrices, setShowNoRecentPrices] = useState(false);
  
  // Form state
  const [currentPrice, setCurrentPrice] = useState<IngredientPriceDto>({
    ingredient: null as any,
    price: 0,
    value: 0,
    measurementType: MeasurementType.GRAM,
    priceDate: new Date().toISOString().split('T')[0]
  });
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientDto | null>(null);
  const [currentSearch, setCurrentSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchIngredientPrices();
    fetchIngredients();
    fetchIngredientsWithoutRecentPrices();
  }, []);

  const fetchIngredientPrices = async () => {
    try {
      setLoading(true);
      const data = await getAllIngredientPrices();
      setIngredientPrices(data);
      setError(null);
    } catch (err) {
      setError('Malzeme fiyatları yüklenirken bir hata oluştu.');
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

  const fetchIngredientsWithoutRecentPrices = async () => {
    try {
      const data = await getIngredientsWithoutRecentPrices();
      setIngredientsWithoutRecentPrices(data);
    } catch (err) {
      console.error('Fiyatsız malzemeler yüklenirken bir hata oluştu:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'ingredientId') {
      setSelectedIngredient(ingredients.find(ing => ing.id === value));
      setCurrentPrice(prev => ({ ...prev, ingredient: selectedIngredient }));
    } else if (name === 'price' || name === 'value') {
      // Parse number inputs to float
      const numberValue = parseFloat(value);
      setCurrentPrice(prev => ({ ...prev, [name]: isNaN(numberValue) ? 0 : numberValue }));
    } else if (name === 'measurementType') {
      // Birim için özel işleme - key'i değer olarak sakla
      setCurrentPrice(prev => ({ ...prev, measurementType: value }));
    } else {
      setCurrentPrice(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedIngredient) {
      setError('Lütfen bir malzeme seçin.');
      return;
    }
    
    try {
      setLoading(true);
      // Create price object with proper types and format date properly
      const priceToSave = {
        ...currentPrice,
        ingredient: selectedIngredient,
        price: typeof currentPrice.price === 'string' ? parseFloat(currentPrice.price) : currentPrice.price,
        value: typeof currentPrice.value === 'string' ? parseFloat(currentPrice.value) : currentPrice.value,
        measurementType: currentPrice.measurementType || MeasurementType.GRAM,
        priceDate: formatDateToLocalDateTime(currentPrice.priceDate)
      };
      await saveOrUpdateIngredientPrice(priceToSave);
      await fetchIngredientPrices();
      
      // Sadece form verilerini sıfırla ama formu kapatma
      if (isEditing) {
        // Düzenleme modundaysak tam sıfırlama ve formu kapatabiliriz
        resetForm();
        setIsFormOpen(false);
      } else {
        // Ekleme modundaysak formu açık tutup yeni veri girişi için hazırla
        setCurrentPrice({
          ingredient: null as any,
          price: 0,
          value: 0,
          measurementType: MeasurementType.GRAM,
          priceDate: new Date().toISOString().split('T')[0]
        });
        setSelectedIngredient(null);
        setCurrentSearch('');
        setError(null);
      }
    } catch (err) {
      setError('Fiyat kaydedilirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (price: IngredientPriceDto) => {
    setCurrentPrice({ ...price });
    if (price.ingredient) {
      setSelectedIngredient(price.ingredient);
      setCurrentSearch(price.ingredient.name);
    }
    setIsEditing(true);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setCurrentPrice({
      ingredient: null as any,
      price: 0,
      value: 0,
      measurementType: MeasurementType.GRAM,
      priceDate: new Date().toISOString().split('T')[0]
    });
    setSelectedIngredient(null);
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

  const filteredPrices = useMemo(() => {
    let filtered = ingredientPrices;
    
    // Eğer "3 ay içinde fiyat girilmemiş ürünleri göster" seçeneği işaretliyse
    if (showNoRecentPrices) {
      // Tüm malzeme listesinden 3 ay içinde fiyat girilmemiş olanları göster
      const noRecentPriceIds = ingredientsWithoutRecentPrices.map(ing => ing.id);
      
      // Eğer hiç fiyat girilmemiş malzemeler varsa, bunları da göster
      const allIngredientIds = ingredients.map(ing => ing.id);
      const ingredientsWithPrices = new Set(ingredientPrices.map(price => price.ingredient?.id).filter(Boolean));
      
      // Fiyatı olmayan malzemeleri bul
      const ingredientsWithoutPrices = ingredients.filter(ing => 
        ing.id && !ingredientsWithPrices.has(ing.id)
      );
      
      // Fiyatı olmayan malzemeler için boş fiyat nesneleri oluştur
      const emptyPrices = ingredientsWithoutPrices.map(ing => ({
        id: undefined,
        ingredient: ing,
        price: 0,
        value: 0,
        measurementType: MeasurementType.GRAM,
        priceDate: "Fiyat girilmemiş"
      } as IngredientPriceDto));
      
      // Mevcut fiyatlardan 3 ay içinde fiyat girilmemiş olanları filtrele
      const filteredExistingPrices = filtered.filter(price => 
        price.ingredient && noRecentPriceIds.includes(price.ingredient.id!)
      );
      
      // İki listeyi birleştir
      return [...filteredExistingPrices, ...emptyPrices];
    } else {
      // Normal filtreleme
      if (ingredientFilter) {
        filtered = filtered.filter(price => 
          price.ingredient && price.ingredient.name.toLowerCase().includes(ingredientFilter.toLowerCase())
        );
      }
      
      if (priceFilter) {
        const priceValue = parseFloat(priceFilter);
        if (!isNaN(priceValue)) {
          filtered = filtered.filter(price => price.price >= priceValue);
        }
      }
      
      if (quantityFilter) {
        filtered = filtered.filter(price => {
          const quantityStr = `${price.value} ${MeasurementType[price.measurementType as keyof typeof MeasurementType]}`;
          return quantityStr.toLowerCase().includes(quantityFilter.toLowerCase());
        });
      }
      
      if (dateFilter) {
        filtered = filtered.filter(price => {
          if (!price.priceDate) return false;
          return price.priceDate.includes(dateFilter);
        });
      }
    }
    
    return filtered;
  }, [ingredientPrices, ingredientFilter, priceFilter, quantityFilter, dateFilter, showNoRecentPrices, ingredientsWithoutRecentPrices, ingredients]);

  // Format date string to LocalDateTime format
  const formatDateToLocalDateTime = (dateString: string): string => {
    if (!dateString) return new Date().toISOString();
    
    // Convert YYYY-MM-DD to YYYY-MM-DDT12:00:00
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toISOString(); // Default to current time if invalid
    }
    
    // Format as ISO string (which includes timezone)
    return date.toISOString();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Malzeme Fiyatları</h2>
        <button
          onClick={() => {
            setCurrentPrice({
              ingredient: null as any,
              price: 0,
              value: 0,
              measurementType: MeasurementType.GRAM,
              priceDate: new Date().toISOString().split('T')[0]
            });
            setSelectedIngredient(null);
            setIsEditing(false);
            setIsFormOpen(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded dark:bg-violet-700 dark:hover:bg-violet-600"
        >
          Yeni Fiyat Ekle
        </button>
      </div>
      
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="showNoRecentPrices"
          checked={showNoRecentPrices}
          onChange={(e) => setShowNoRecentPrices(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="showNoRecentPrices" className="text-sm">
          3 ay içinde fiyat girilmemiş ürünleri göster
        </label>
      </div>

      {isFormOpen && (
        <div className="bg-white dark:bg-gray-700 p-5 rounded-md mb-6 shadow-md transition-all duration-300">
          <h3 className="text-lg font-medium mb-4">{isEditing ? 'Fiyat Düzenle' : 'Yeni Fiyat Ekle'}</h3>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
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
                    required
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
                              setCurrentPrice(prev => ({ ...prev, ingredient }));
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
                <label className="block text-sm font-medium mb-1">Fiyat (TL)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={currentPrice.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Miktar</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  name="value"
                  value={currentPrice.value}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Birim</label>
                <select
                  name="measurementType"
                  value={currentPrice.measurementType || MeasurementType.GRAM}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  {Object.entries(MeasurementType).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tarih</label>
                <input
                  type="date"
                  name="priceDate"
                  value={currentPrice.priceDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
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
                disabled={loading || !selectedIngredient}
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
            <label className="block text-sm font-medium mb-1">Malzeme</label>
            <input
              type="text"
              placeholder="Malzeme ara..."
              value={ingredientFilter}
              onChange={(e) => setIngredientFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fiyat</label>
            <input
              type="number"
              min="0"
              placeholder="Min fiyat"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Miktar/Birim</label>
            <input
              type="text"
              placeholder="Örn: 1 GR"
              value={quantityFilter}
              onChange={(e) => setQuantityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tarih</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Malzeme
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fiyat
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Miktar/Birim
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tarih
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredPrices.length > 0 ? (
                filteredPrices.map((price, index) => (
                  <tr key={price.id || `empty-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{price.ingredient?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {price.priceDate === "Fiyat girilmemiş" ? "-" : `${price.price} TL`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {price.priceDate === "Fiyat girilmemiş" ? "-" : 
                          `${price.value} ${MeasurementType[price.measurementType as keyof typeof MeasurementType]}`
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${price.priceDate === "Fiyat girilmemiş" ? "text-red-500 font-semibold" : ""}`}>
                        {price.priceDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {price.priceDate === "Fiyat girilmemiş" ? (
                        <button
                          onClick={() => {
                            setCurrentPrice({
                              ingredient: price.ingredient,
                              price: 0,
                              value: 0,
                              measurementType: MeasurementType.GRAM,
                              priceDate: new Date().toISOString().split('T')[0]
                            });
                            setSelectedIngredient(price.ingredient);
                            setCurrentSearch(price.ingredient?.name || ''); 
                            setIsEditing(false);
                            setIsFormOpen(true);
                            setDropdownOpen(false); 
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                        >
                          Fiyat Ekle
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(price)}
                          className="text-violet-600 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300 mr-3"
                        >
                          Düzenle
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {loading ? 'Yükleniyor...' : 'Fiyat bulunamadı'}
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

export default IngredientPricesTab;
