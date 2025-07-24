import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Modal,
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useModalStore } from '../stores/modalStore';
import { useDrinkDetails } from '../hooks/useQueries';
import { Drink } from '../types';

interface DrinkCardProps {
  drink: Drink;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const DrinkCard: React.FC<DrinkCardProps> = ({ drink }) => {
  const { isOpen, selectedDrinkId, openModal, closeModal } = useModalStore();
  const isCurrentModalOpen = isOpen && selectedDrinkId === drink.idDrink;

  const {
    data: drinkDetails,
    isLoading,
    error,
  } = useDrinkDetails(isCurrentModalOpen ? selectedDrinkId : null);

  const renderIngredients = (drinkInfo: Drink): React.ReactElement[] => {
    const ingredients: React.ReactElement[] = [];
    for (let i = 1; i < 16; i++) {
      const ingredient = drinkInfo[`strIngredient${i}` as keyof Drink] as string;
      const measure = drinkInfo[`strMeasure${i}` as keyof Drink] as string;
      
      if (ingredient?.trim()) {
        ingredients.push(
          <ListItem key={i} disablePadding>
            <ListItemText 
              primary={`${ingredient.trim()} ${measure?.trim() || ''}`}
              sx={{ py: 0.5 }}
            />
          </ListItem>
        );
      }
    }
    return ingredients;
  };

  const handleViewRecipe = (): void => {
    openModal(drink.idDrink);
  };

  const handleCloseModal = (): void => {
    closeModal();
  };

  const renderModalContent = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading recipe details...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error">
          Error loading recipe details. Please try again.
        </Alert>
      );
    }

    if (!drinkDetails) {
      return (
        <Alert severity="warning">
          No details found for this recipe.
        </Alert>
      );
    }

    return (
      <>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography id="modal-recipe-title" variant="h4" component="h2" sx={{ pr: 2 }}>
            {drinkDetails.strDrink}
          </Typography>
          <IconButton
            onClick={handleCloseModal}
            sx={{ 
              position: 'sticky',
              top: 0,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
            }}
          >
            <Close />
          </IconButton>
        </Box>
        
        {drinkDetails.strDrinkThumb && (
          <Box
            component="img"
            src={drinkDetails.strDrinkThumb}
            alt={drinkDetails.strDrink}
            sx={{
              width: '100%',
              maxWidth: 300,
              height: 'auto',
              mb: 3,
              display: 'block',
              mx: 'auto',
              borderRadius: 2,
            }}
          />
        )}

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
          Ingredients and Quantities
        </Typography>
        <List dense sx={{ mb: 3 }}>
          {renderIngredients(drinkDetails)}
        </List>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
          Instructions
        </Typography>
        <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
          {drinkDetails.strInstructions}
        </Typography>
      </>
    );
  };

  return (
    <>
      <Card sx={{ maxWidth: 345, mb: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="200"
          image={drink.strDrinkThumb}
          alt={`Image of ${drink.strDrink}`}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h2" 
            sx={{ 
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.3,
              mb: 2
            }}
          >
            {drink.strDrink}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleViewRecipe}
            sx={{ mt: 'auto' }}
          >
            View Recipe
          </Button>
        </CardContent>
      </Card>

      <Modal
        open={isCurrentModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-recipe-title"
        aria-describedby="modal-recipe-description"
        slotProps={{
          backdrop: {
            onClick: handleCloseModal,
          },
        }}
      >
        <Box sx={modalStyle}>
          {renderModalContent()}
        </Box>
      </Modal>
    </>
  );
};

export default DrinkCard;
