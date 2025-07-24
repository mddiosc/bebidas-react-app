import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Category, CategoryApiResponse, CategoriasContextType } from '../types';

// Crear context
export const CategoriasContext = createContext<CategoriasContextType | undefined>(undefined);

interface CategoriasProviderProps {
  children: ReactNode;
}

const CategoriasProvider: React.FC<CategoriasProviderProps> = ({ children }) => {
  // Creamos el state
  const [categorias, guardarCategorias] = useState<Category[]>([]);

  // Ejecutamos la llamada al API
  useEffect(() => {
    const obtenerCategorias = async (): Promise<void> => {
      try {
        const url = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
        const response = await axios.get<CategoryApiResponse>(url);
        guardarCategorias(response.data.drinks);
      } catch (error) {
        console.error('Error fetching categories:', error);
        guardarCategorias([]);
      }
    };
    obtenerCategorias();
  }, []);

  return (
    <CategoriasContext.Provider value={{ categorias }}>
      {children}
    </CategoriasContext.Provider>
  );
};

export default CategoriasProvider;
