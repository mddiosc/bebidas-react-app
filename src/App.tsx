import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Header from './components/Header';
import Form from './components/SearchForm';
import DrinkList from './components/DrinksList';
import { SearchFormData } from './types';

// Create a custom theme for Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

// Create a QueryClient instance with optimized configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes by default
      gcTime: 10 * 60 * 1000, // 10 minutes in cache by default
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnReconnect: true, // Refetch when reconnecting to internet
    },
    mutations: {
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchFormData | null>(null);
  const [searchEnabled, setSearchEnabled] = useState<boolean>(false);

  const handleSearch = (params: SearchFormData): void => {
    setSearchParams(params);
    setSearchEnabled(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Form onSearch={handleSearch} />
        <DrinkList 
          searchParams={searchParams} 
          searchEnabled={searchEnabled} 
        />
        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
