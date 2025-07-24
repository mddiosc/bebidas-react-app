import { useQuery } from '@tanstack/react-query';
import { cocktailApi } from '../services/cocktailApi';
import { SearchFormData } from '../types';

// Hook to get categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: cocktailApi.getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes - categories don't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes in cache
  });
};

// Hook to search drinks
export const useSearchDrinks = (searchParams: SearchFormData, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['drinks', 'search', searchParams],
    queryFn: () => cocktailApi.searchDrinks(searchParams),
    enabled: enabled && (!!searchParams.name || !!searchParams.category),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes in cache
  });
};

// Hook to get details of a specific drink
export const useDrinkDetails = (drinkId: string | null) => {
  return useQuery({
    queryKey: ['drink', drinkId],
    queryFn: () => cocktailApi.getDrinkById(drinkId!),
    enabled: !!drinkId,
    staleTime: 10 * 60 * 1000, // 10 minutes - details don't change
    gcTime: 15 * 60 * 1000, // 15 minutes in cache
  });
};
