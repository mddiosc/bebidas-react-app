import { useQuery } from '@tanstack/react-query';
import { cocktailApi } from '../services/cocktailApi';
import { SearchFormData } from '../types';

// Hook para obtener categorías
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: cocktailApi.getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutos - las categorías no cambian frecuentemente
    gcTime: 10 * 60 * 1000, // 10 minutos en caché
  });
};

// Hook para buscar bebidas
export const useSearchDrinks = (searchParams: SearchFormData, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['drinks', 'search', searchParams],
    queryFn: () => cocktailApi.searchDrinks(searchParams),
    enabled: enabled && (!!searchParams.nombre || !!searchParams.categoria),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos en caché
  });
};

// Hook para obtener detalles de una bebida específica
export const useDrinkDetails = (drinkId: string | null) => {
  return useQuery({
    queryKey: ['drink', drinkId],
    queryFn: () => cocktailApi.getDrinkById(drinkId!),
    enabled: !!drinkId,
    staleTime: 10 * 60 * 1000, // 10 minutos - los detalles no cambian
    gcTime: 15 * 60 * 1000, // 15 minutos en caché
  });
};
