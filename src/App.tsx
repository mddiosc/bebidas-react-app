import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Header from './components/Header';
import Formulario from './components/Formulario';
import ListaRecetas from './components/ListaRecetas';
import { SearchFormData } from './types';

// Crear un tema personalizado para Material-UI
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

// Crear una instancia del QueryClient con configuración optimizada
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutos por defecto
      gcTime: 10 * 60 * 1000, // 10 minutos en caché por defecto
      refetchOnWindowFocus: false, // No refetch cuando la ventana recupera el foco
      refetchOnReconnect: true, // Refetch cuando se reconecta a internet
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
        <Formulario onSearch={handleSearch} />
        <ListaRecetas 
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
