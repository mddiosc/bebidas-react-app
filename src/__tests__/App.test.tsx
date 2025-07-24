import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    
    // Verificar que el título principal esté presente
    expect(screen.getByText('Busca Recetas de Bebidas')).toBeInTheDocument();
  });

  it('renders search form elements', () => {
    render(<App />);
    
    // Verificar que los elementos del formulario estén presentes
    expect(screen.getByLabelText(/buscar por ingrediente/i)).toBeInTheDocument();
    
    // Para el Select de MUI, buscar directamente por el combobox
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    
    // Verificar el botón de búsqueda
    expect(screen.getByRole('button', { name: /buscar bebidas/i })).toBeInTheDocument();
  });
});
