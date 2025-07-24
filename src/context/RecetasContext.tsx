import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Drink, DrinkApiResponse, SearchFormData, RecetasContextType } from '../types';

// Crear context
export const RecetasContext = createContext<RecetasContextType | undefined>(undefined);

interface RecetasProviderProps {
  children: ReactNode;
}

const RecetasProvider: React.FC<RecetasProviderProps> = ({ children }) => {
  // Creamos el state
  const [recetas, guardarRecetas] = useState<Drink[]>([]);
  const [busqueda, buscarRecetas] = useState<SearchFormData>({
    nombre: '',
    categoria: '',
  });
  const [consultar, guardarConsultar] = useState<boolean>(false);

  const { nombre, categoria } = busqueda;

  // Ejecutamos la llamada al API
  useEffect(() => {
    if (consultar) {
      const obtenerRecetas = async (): Promise<void> => {
        try {
          const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${nombre}&c=${categoria}`;
          const resultado = await axios.get<DrinkApiResponse>(url);
          guardarRecetas(resultado.data.drinks || []);
        } catch (error) {
          console.error('Error fetching recipes:', error);
          guardarRecetas([]);
        }
      };
      obtenerRecetas();
    }
  }, [busqueda, consultar, nombre, categoria]);

  const contextValue: RecetasContextType = {
    recetas,
    buscarRecetas,
    guardarConsultar,
  };

  return (
    <RecetasContext.Provider value={contextValue}>
      {children}
    </RecetasContext.Provider>
  );
};

export default RecetasProvider;
