import React from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Skeleton,
  Fade,
  Paper,
  Button,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { SearchOff, TrendingUp, LocalBar } from '@mui/icons-material';
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

  // Loading state with skeletons
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
          <CircularProgress size={60} />
          <Box ml={2}>
            <Typography variant="h5" fontWeight="bold">
              Searching for drinks...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Finding the perfect cocktails for you
            </Typography>
          </Box>
        </Box>
        
        <Grid2 container spacing={3}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Paper 
                elevation={2} 
                sx={{ 
                  borderRadius: 3, 
                  overflow: 'hidden',
                  height: 420, // Misma altura que las tarjetas reales
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Skeleton variant="rectangular" width="100%" height={220} />
                <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '70%' }} />
                  </Box>
                  <Box display="flex" gap={1} mt={2}>
                    <Skeleton variant="rounded" width={80} height={24} />
                    <Skeleton variant="rounded" width={60} height={24} />
                  </Box>
                  <Skeleton variant="rectangular" width="100%" height={36} sx={{ mt: 2, borderRadius: 2 }} />
                </Box>
              </Paper>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    );
  }

  // Error state
  if (isError && searchEnabled) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: 3,
            border: '2px solid',
            borderColor: 'error.light'
          }}
        >
          <SearchOff sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom color="error.main" fontWeight="bold">
            Search Error
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We encountered an error while searching for drinks. Please try again.
          </Typography>
          {error?.message && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Details: {error.message}
            </Alert>
          )}
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  // Initial state - no search yet
  if (!searchEnabled || !searchParams) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Fade in>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 6, 
              textAlign: 'center', 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}
          >
            <LocalBar sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold" color="primary.main">
              Ready to Explore?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Use the search form above to discover amazing cocktail recipes from around the world.
              Search by ingredient or browse by category!
            </Typography>
            
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                Popular Searches:
              </Typography>
              <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1} mt={2}>
                {['Vodka', 'Rum', 'Whiskey', 'Gin', 'Cocktail', 'Shot'].map((term) => (
                  <Button
                    key={term}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 'medium'
                    }}
                  >
                    {term}
                  </Button>
                ))}
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    );
  }

  // No results found
  if (drinks.length === 0 && searchEnabled) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Fade in>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 6, 
              textAlign: 'center', 
              borderRadius: 3,
              border: '2px dashed',
              borderColor: 'warning.light'
            }}
          >
            <SearchOff sx={{ fontSize: 80, color: 'warning.main', mb: 3 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold" color="warning.main">
              No Drinks Found
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 500, mx: 'auto' }}>
              We couldn't find any drinks matching your search criteria.
              Try different ingredients or explore other categories!
            </Typography>
            
            <Box mt={3}>
              <Typography variant="body1" fontWeight="medium" gutterBottom>
                Search suggestions:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Try broader terms like "rum" instead of "spiced rum"<br/>
                • Check your spelling<br/>
                • Browse different categories<br/>
                • Try popular ingredients like vodka, whiskey, or gin
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    );
  }

  // Results found - display drinks
  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Fade in>
        <Box>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 3,
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              🍸 Found {drinks.length} Amazing {drinks.length === 1 ? 'Recipe' : 'Recipes'}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {searchParams?.name && `Ingredient: "${searchParams.name}"`}
              {searchParams?.name && searchParams?.category && ' • '}
              {searchParams?.category && `Category: "${searchParams.category}"`}
            </Typography>
          </Paper>
          
          <Grid2 container spacing={3}>
            {drinks.map((drink, index) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={drink.idDrink}>
                <Fade in timeout={300 + index * 100}>
                  <div>
                    <DrinkCard drink={drink} />
                  </div>
                </Fade>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Fade>
    </Container>
  );
};

export default DrinkList;
