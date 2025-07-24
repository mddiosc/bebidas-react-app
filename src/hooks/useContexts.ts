import { useContext } from 'react';
import { CategoriasContext } from '../context/CategoriasContext';
import { RecetasContext } from '../context/RecetasContext';
import { ModalContext } from '../context/ModalContext';
import { CategoriasContextType, RecetasContextType, ModalContextType } from '../types';

export const useCategorias = (): CategoriasContextType => {
  const context = useContext(CategoriasContext);
  if (context === undefined) {
    throw new Error('useCategorias must be used within a CategoriasProvider');
  }
  return context;
};

export const useRecetas = (): RecetasContextType => {
  const context = useContext(RecetasContext);
  if (context === undefined) {
    throw new Error('useRecetas must be used within a RecetasProvider');
  }
  return context;
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
