import { useQuery } from '@tanstack/react-query';
import { cocktailApi } from '../services/cocktailApi';

// Hook for random cocktail
export const useRandomDrink = () => {
  return useQuery({
    queryKey: ['randomDrink'],
    queryFn: cocktailApi.getRandomDrink,
    staleTime: 1000 * 60 * 2, // 2 minutes - random cocktails can be fresh
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook for drinks by first letter
export const useDrinksByLetter = (letter: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['drinksByLetter', letter],
    queryFn: () => cocktailApi.getDrinksByLetter(letter),
    enabled: enabled && letter.length === 1,
    staleTime: 1000 * 60 * 15, // 15 minutes - letters don't change often
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Hook for ingredient details
export const useIngredientDetails = (ingredientName: string | null) => {
  return useQuery({
    queryKey: ['ingredientDetails', ingredientName],
    queryFn: () => cocktailApi.getIngredientDetails(ingredientName!),
    enabled: !!ingredientName,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - ingredient info rarely changes
    gcTime: 1000 * 60 * 60 * 48, // 48 hours
  });
};

// Hook for popular drinks (this would be a premium feature, but we can simulate)
export const usePopularDrinks = () => {
  return useQuery({
    queryKey: ['popularDrinks'],
    queryFn: async () => {
      // Since we don't have access to popular drinks, we'll get a selection of cocktails
      const categories = ['Cocktail', 'Ordinary Drink', 'Shot'];
      const promises = categories.map(category => 
        cocktailApi.searchDrinks({ name: '', category })
      );
      
      const results = await Promise.all(promises);
      const allDrinks = results.flatMap(drinks => drinks);
      
      // Return first 12 drinks as "popular"
      return allDrinks.slice(0, 12);
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};
