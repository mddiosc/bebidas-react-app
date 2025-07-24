import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    
    // Verify that the main title is present
    expect(screen.getByText('Search Drink Recipes')).toBeInTheDocument();
  });

  it('renders search form elements', () => {
    render(<App />);
    
    // Verify that form elements are present
    expect(screen.getByLabelText(/search by ingredient/i)).toBeInTheDocument();
    
    // For MUI Select, search directly by combobox
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    
    // Verify the search button
    expect(screen.getByRole('button', { name: /search drinks/i })).toBeInTheDocument();
  });
});
