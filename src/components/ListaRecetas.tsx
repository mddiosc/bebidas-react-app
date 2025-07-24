import React from 'react';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { useSearchDrinks } from '../hooks/useQueries';
import { SearchFormData } from '../types';
import Receta from './Receta';

interface ListaRecetasProps {
  searchParams: SearchFormData | null;
  searchEnabled: boolean;
}

const ListaRecetasModerna: React.FC<ListaRecetasProps> = ({
  searchParams,
  searchEnabled,
}) => {
  const {
    data: recetas = [],
    isLoading,
    error,
    isError,
  } = useSearchDrinks(
    searchParams || { nombre: '', categoria: '' },
    searchEnabled && !!searchParams
  );

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Buscando recetas...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (isError && searchEnabled) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Alert severity="error">
          Error al buscar las recetas. Por favor, inténtalo de nuevo.
          {error?.message && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Detalle: {error.message}
            </Typography>
          )}
        </Alert>
      </Container>
    );
  }

  if (!searchEnabled || !searchParams) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h6" align="center" color="text.secondary">
          Utiliza el formulario de arriba para buscar recetas de bebidas.
        </Typography>
      </Container>
    );
  }

  if (recetas.length === 0 && searchEnabled) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h6" align="center" color="text.secondary">
          No se encontraron recetas con los términos de búsqueda utilizados.
          Intenta con otros ingredientes o categorías.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Resultados de la búsqueda ({recetas.length} recetas encontradas)
      </Typography>
      
      <Grid container spacing={3}>
        {recetas.map((receta) => (
          <Grid item xs={12} sm={6} md={4} key={receta.idDrink}>
            <Receta receta={receta} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ListaRecetasModerna;
