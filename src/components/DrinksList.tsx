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
import DrinkCard from './DrinkCard';

interface DrinkListProps {
  searchParams: SearchFormData | null;
  searchEnabled: boolean;
}

const DrinkList: React.FC<DrinkListProps> = ({
  searchParams,
  searchEnabled,
}) => {
  const {
    data: drinks = [],
    isLoading,
    error,
    isError,
  } = useSearchDrinks(
    searchParams || { name: '', category: '' },
    searchEnabled && !!searchParams
  );

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Searching for drinks...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (isError && searchEnabled) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Alert severity="error">
          Error searching for drinks. Please try again.
          {error?.message && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Details: {error.message}
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
          Use the form above to search for drink recipes.
        </Typography>
      </Container>
    );
  }

  if (drinks.length === 0 && searchEnabled) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h6" align="center" color="text.secondary">
          No drinks were found with the search terms used.
          Try with other ingredients or categories.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Search Results ({drinks.length} drinks found)
      </Typography>
      
      <Grid container spacing={3}>
        {drinks.map((drink) => (
          <Grid item xs={12} sm={6} md={4} key={drink.idDrink}>
            <DrinkCard drink={drink} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DrinkList;
