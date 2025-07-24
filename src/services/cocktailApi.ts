import axios from 'axios';
import { Category, CategoryApiResponse, Drink, DrinkApiResponse, SearchFormData } from '../types';

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export const cocktailApi = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await axios.get<CategoryApiResponse>(`${BASE_URL}/list.php?c=list`);
    return response.data.drinks || [];
  },

  // Search drinks by ingredient and category
  searchDrinks: async ({ name, category }: SearchFormData): Promise<Drink[]> => {
    const response = await axios.get<DrinkApiResponse>(
      `${BASE_URL}/filter.php?i=${name}&c=${category}`
    );
    return response.data.drinks || [];
  },

  // Get details of a specific drink
  getDrinkById: async (id: string): Promise<Drink | null> => {
    const response = await axios.get<DrinkApiResponse>(`${BASE_URL}/lookup.php?i=${id}`);
    return response.data.drinks?.[0] || null;
  },
};
