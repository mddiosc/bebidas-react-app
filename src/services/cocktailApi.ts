import axios from 'axios';
import { 
  Drink, 
  DrinkApiResponse, 
  Category, 
  CategoryApiResponse, 
  SearchFormData,
  Ingredient,
  IngredientApiResponse,
  Glass,
  GlassApiResponse
} from '../types';

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export const cocktailApi = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await axios.get<CategoryApiResponse>(`${BASE_URL}/list.php?c=list`);
    return response.data.drinks;
  },

  // Search drinks by name or category
  searchDrinks: async ({ name, category }: SearchFormData): Promise<Drink[]> => {
    let url: string;
    
    if (name.trim()) {
      // Try both ingredient search and name search, then combine results
      const ingredientUrl = `${BASE_URL}/filter.php?i=${encodeURIComponent(name.trim())}`;
      const nameUrl = `${BASE_URL}/search.php?s=${encodeURIComponent(name.trim())}`;
      
      try {
        const [ingredientResponse, nameResponse] = await Promise.all([
          axios.get<DrinkApiResponse>(ingredientUrl).catch(() => ({ data: { drinks: null } })),
          axios.get<DrinkApiResponse>(nameUrl).catch(() => ({ data: { drinks: null } }))
        ]);
        
        const ingredientDrinks = ingredientResponse.data.drinks || [];
        const nameDrinks = nameResponse.data.drinks || [];
        
        // Combine and deduplicate results
        const combinedDrinks = [...ingredientDrinks, ...nameDrinks];
        const uniqueDrinks = combinedDrinks.filter((drink, index, self) => 
          index === self.findIndex(d => d.idDrink === drink.idDrink)
        );
        
        return uniqueDrinks;
      } catch (error) {
        console.error('Search error:', error);
        return [];
      }
    } else if (category.trim()) {
      // Filter by category
      url = `${BASE_URL}/filter.php?c=${encodeURIComponent(category.trim())}`;
      const response = await axios.get<DrinkApiResponse>(url);
      return response.data.drinks || [];
    } else {
      return [];
    }
  },

  // Get drink details by ID
  getDrinkById: async (id: string): Promise<Drink | null> => {
    const response = await axios.get<DrinkApiResponse>(`${BASE_URL}/lookup.php?i=${id}`);
    return response.data.drinks?.[0] || null;
  },

  // Get random drink
  getRandomDrink: async (): Promise<Drink | null> => {
    const response = await axios.get<DrinkApiResponse>(`${BASE_URL}/random.php`);
    return response.data.drinks?.[0] || null;
  },

  // Get drinks by first letter
  getDrinksByLetter: async (letter: string): Promise<Drink[]> => {
    const response = await axios.get<DrinkApiResponse>(`${BASE_URL}/search.php?f=${letter}`);
    return response.data.drinks || [];
  },

  // Get ingredient details by name
  getIngredientDetails: async (ingredientName: string): Promise<Ingredient | null> => {
    const response = await axios.get<IngredientApiResponse>(`${BASE_URL}/search.php?i=${encodeURIComponent(ingredientName)}`);
    return response.data.ingredients?.[0] || null;
  },

  // Get all glasses list
  getGlasses: async (): Promise<Glass[]> => {
    const response = await axios.get<GlassApiResponse>(`${BASE_URL}/list.php?g=list`);
    return response.data.drinks || [];
  },

  // Get all ingredients list
  getIngredients: async (): Promise<Ingredient[]> => {
    const response = await axios.get<IngredientApiResponse>(`${BASE_URL}/list.php?i=list`);
    return response.data.ingredients || [];
  },
};
