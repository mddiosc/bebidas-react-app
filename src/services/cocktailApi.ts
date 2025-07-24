import axios from 'axios';
import { Category, CategoryApiResponse, Drink, DrinkApiResponse, SearchFormData } from '../types';

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export const cocktailApi = {
  // Obtener todas las categorías
  getCategories: async (): Promise<Category[]> => {
    const response = await axios.get<CategoryApiResponse>(`${BASE_URL}/list.php?c=list`);
    return response.data.drinks || [];
  },

  // Buscar recetas por ingrediente y categoría
  searchDrinks: async ({ nombre, categoria }: SearchFormData): Promise<Drink[]> => {
    const response = await axios.get<DrinkApiResponse>(
      `${BASE_URL}/filter.php?i=${nombre}&c=${categoria}`
    );
    return response.data.drinks || [];
  },

  // Obtener detalles de una receta específica
  getDrinkById: async (id: string): Promise<Drink | null> => {
    const response = await axios.get<DrinkApiResponse>(`${BASE_URL}/lookup.php?i=${id}`);
    return response.data.drinks?.[0] || null;
  },
};
