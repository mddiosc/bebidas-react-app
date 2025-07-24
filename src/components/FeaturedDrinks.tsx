import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Fade,
  CircularProgress,
  Alert,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { TrendingUp, Shuffle, LocalBar } from '@mui/icons-material';
import { usePopularDrinks, useRandomDrink } from '../hooks/useExtraQueries';
import DrinkCard from './DrinkCard';

const FeaturedDrinks: React.FC = () => {

  
  const { 
    data: popularDrinks = [], 
    isLoading: popularLoading, 
    error: popularError 
  } = usePopularDrinks();

  const { 
    data: randomDrink, 
    isLoading: randomLoading, 
    refetch: getNewRandomDrink 
  } = useRandomDrink();

  const handleGetRandomDrink = (): void => {
    getNewRandomDrink();
  };



  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      {/* Random Drink Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          mb: 6, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
          color: 'white'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              <Shuffle sx={{ mr: 2, verticalAlign: 'middle' }} />
              Daily Special
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Discover something new every day!
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetRandomDrink}
            disabled={randomLoading}
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          >
            {randomLoading ? <CircularProgress size={24} color="inherit" /> : 'Get New Random'}
          </Button>
        </Box>

        {randomDrink && (
          <Fade in>
            <Grid2 container spacing={3} alignItems="center">
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Box
                  component="img"
                  src={randomDrink.strDrinkThumb}
                  alt={randomDrink.strDrink}
                  sx={{
                    width: '100%',
                    maxWidth: 300,
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: 4,
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {randomDrink.strDrink}
                </Typography>
                <Box display="flex" gap={2} mb={2}>
                  <Box display="flex" alignItems="center">
                    <LocalBar sx={{ mr: 1 }} />
                    <Typography variant="h6">{randomDrink.strCategory}</Typography>
                  </Box>
                  <Typography variant="h6">•</Typography>
                  <Typography variant="h6">{randomDrink.strAlcoholic}</Typography>
                </Box>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6, mb: 3 }}>
                  {randomDrink.strInstructions?.substring(0, 150)}...
                </Typography>
              </Grid2>
            </Grid2>
          </Fade>
        )}
      </Paper>

      {/* Popular Drinks Section */}
      <Box mb={4}>
        <Typography 
          variant="h3" 
          component="h2" 
          fontWeight="bold" 
          gutterBottom 
          display="flex" 
          alignItems="center"
        >
          <TrendingUp sx={{ mr: 2, fontSize: 48 }} />
          Popular Cocktails
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Discover the most beloved cocktail recipes
        </Typography>
      </Box>

      {popularLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading popular drinks...
          </Typography>
        </Box>
      ) : popularError ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          Error loading popular drinks. Please try again later.
        </Alert>
      ) : (
        <Grid2 container spacing={3}>
          {popularDrinks.slice(0, 6).map((drink, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={drink.idDrink}>
              <Fade in timeout={300 + index * 100}>
                <div>
                  <DrinkCard drink={drink} />
                </div>
              </Fade>
            </Grid2>
          ))}
        </Grid2>
      )}
    </Container>
  );
};

export default FeaturedDrinks;
