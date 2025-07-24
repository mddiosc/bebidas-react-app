import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Drink, DrinkApiResponse, ModalContextType } from '../types';

// Crear context
export const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [idReceta, guardarIdReceta] = useState<string | null>(null);
  const [inforeceta, guardarReceta] = useState<Drink | null>(null);

  // Una vez tenemos el id llamamos al API
  useEffect(() => {
    const obtenerReceta = async (): Promise<void> => {
      if (!idReceta) return;
      
      try {
        const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idReceta}`;
        const resultado = await axios.get<DrinkApiResponse>(url);
        if (resultado.data.drinks && resultado.data.drinks.length > 0) {
          guardarReceta(resultado.data.drinks[0]);
        }
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        guardarReceta(null);
      }
    };
    obtenerReceta();
  }, [idReceta]);

  const contextValue: ModalContextType = {
    inforeceta,
    guardarIdReceta,
    guardarReceta,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
