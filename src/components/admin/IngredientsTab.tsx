import React, { useState, useEffect, useMemo, useContext } from 'react';
import { getAllIngredients, saveOrUpdateIngredient, IngredientDto, Season } from '../../api/adminApi';
import { FormContext } from './AdminPage';

interface IngredientsTabProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
}

const IngredientsTab: React.FC<IngredientsTabProps> = ({ isFormOpen, setIsFormOpen }) => {
  const [ingredients, setIngredients] = useState<IngredientDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formContext = useContext(FormContext);

  // Search filters
  const [nameFilter, setNameFilter] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('');
  const [processedFilter, setProcessedFilter] = useState<string>('');

  // Form state
  const [currentIngredient, setCurrentIngredient] = useState<IngredientDto>({
    name: '',
    season: Season.ALL_SEASON,
    proccessed: false,
    imageUrl: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Helper function to get Season enum key from display value
  const getSeasonKey = (displayValue: string): string => {
    const entry = Object.entries(Season).find(([_, val]) => val === displayValue);
    return entry ? entry[0] : 'ALL_SEASON'; // Default to ALL_SEASON if not found
  };

  // Helper function to display season in UI
  const getSeasonDisplay = (key: string): string => {
    return Season[key as keyof typeof Season] || Season.ALL_SEASON;
  };

  // Fetch ingredients on component mount
  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const data = await getAllIngredients();
      setIngredients(data);
      setError(null);
    } catch (err) {
      setError('Malzemeler yüklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCurrentIngredient(prev => ({ ...prev, [name]: checked }));
    } else {
      setCurrentIngredient(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentIngredient.name.trim()) {
      setError('Malzeme adı boş olamaz.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Sezon değerini enum key olarak gönder
      const ingredientToSave = {
        ...currentIngredient,
        // Eğer sezon display value ise enum key'e çevir
        season: typeof currentIngredient.season === 'string' && 
                Object.values(Season).includes(currentIngredient.season as any) ? 
                  Object.keys(Season).find(key => 
                    Season[key as keyof typeof Season] === currentIngredient.season
                  ) : currentIngredient.season
      };
      
      await saveOrUpdateIngredient(ingredientToSave);
      await fetchIngredients();
      
      // Sadece form verilerini sıfırla ama formu kapatma
      if (isEditing) {
        // Düzenleme modundaysak tam sıfırlama ve formu kapatabiliriz
        resetForm();
        setIsFormOpen(false);
      } else {
        // Ekleme modundaysak formu açık tutup yeni veri girişi için hazırla
        setCurrentIngredient({
          name: '',
          season: Season.ALL_SEASON,
          proccessed: false,
          imageUrl: ''
        });
        setIsEditing(false);
        setError(null);
      }
    } catch (err) {
      setError('Malzeme kaydedilirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (ingredient: IngredientDto) => {
    // Backend'den gelen season değeri görüntüleme değeri (Tüm Sezonlar) ise, enum key'e (ALL_SEASON) çevirelim
    const seasonKey = Object.keys(Season).find(key => 
      Season[key as keyof typeof Season] === ingredient.season
    ) || ingredient.season;
    
    setCurrentIngredient({ 
      ...ingredient,
      season: seasonKey
    });
    setIsEditing(true);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setCurrentIngredient({
      name: '',
      season: Season.ALL_SEASON,
      proccessed: false,
      imageUrl: ''
    });
    setIsEditing(false);
    setError(null);
  };

  // Apply filters to ingredients
  const filteredIngredients = useMemo(() => {
    return ingredients.filter(ingredient => {
      const nameMatch = !nameFilter || 
        ingredient.name.toLowerCase().includes(nameFilter.toLowerCase());
      
      const seasonMatch = !seasonFilter || 
        getSeasonDisplay(ingredient.season).toLowerCase().includes(seasonFilter.toLowerCase());
      
      let processedMatch = true;
      if (processedFilter === 'true') {
        processedMatch = ingredient.proccessed === true;
      } else if (processedFilter === 'false') {
        processedMatch = ingredient.proccessed === false;
      }
      
      return nameMatch && seasonMatch && processedMatch;
    });
  }, [ingredients, nameFilter, seasonFilter, processedFilter]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Malzemeler</h2>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(!isFormOpen);
          }}
          className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
        >
          {isFormOpen ? 'İptal' : 'Yeni Malzeme Ekle'}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white dark:bg-gray-700 p-5 rounded-md mb-6 shadow-md transition-all duration-300">
          <h3 className="text-lg font-medium mb-4">{isEditing ? 'Malzeme Düzenle' : 'Yeni Malzeme Ekle'}</h3>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Malzeme Adı</label>
                <input
                  type="text"
                  name="name"
                  value={currentIngredient.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Sezon</label>
                <select
                  name="season"
                  value={currentIngredient.season}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  {Object.entries(Season).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">İşlenmiş mi?</label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    name="proccessed"
                    checked={currentIngredient.proccessed}
                    onChange={(e) => 
                      setCurrentIngredient(prev => ({
                        ...prev,
                        proccessed: e.target.checked
                      }))
                    }
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                  />
                  <span>{currentIngredient.proccessed ? 'Evet' : 'Hayır'}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Resim URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={currentIngredient.imageUrl || ''}
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
                disabled={loading}
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
            <label className="block text-sm font-medium mb-1">İsim</label>
            <input
              type="text"
              placeholder="Malzeme ara..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sezon</label>
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            >
              <option value="">Tümü</option>
              {Object.entries(Season).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">İşlenmiş mi?</label>
            <select
              value={processedFilter}
              onChange={(e) => setProcessedFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            >
              <option value="">Tümü</option>
              <option value="true">Evet</option>
              <option value="false">Hayır</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İsim
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sezon
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlenmiş
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Resim
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredIngredients.length > 0 ? (
                filteredIngredients.map((ingredient) => (
                  <tr key={ingredient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">{ingredient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getSeasonDisplay(ingredient.season)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ingredient.proccessed ? 'Evet' : 'Hayır'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ingredient.imageUrl ? (
                        <img 
                          src={ingredient.imageUrl} 
                          alt={ingredient.name} 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">Görsel yok</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(ingredient)}
                        className="text-violet-600 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300 mr-3"
                      >
                        Düzenle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {ingredients.length > 0 ? 'Arama kriterlerine uygun malzeme bulunamadı.' : 'Henüz malzeme eklenmemiş.'}
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

export default IngredientsTab;
