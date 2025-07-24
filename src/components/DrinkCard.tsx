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
  Chip,
  Divider,
  Paper,
  CardActions,
  Tooltip,
  Avatar,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { 
  Close, 
  LocalBar, 
  Category, 
  LiquorOutlined, 
  AccessTime,
  Info,
  Share,
  Favorite,
  FavoriteBorder 
} from '@mui/icons-material';
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
  width: { xs: '95%', sm: '90%', md: 800 },
  maxHeight: '95vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3,
};

const DrinkCard: React.FC<DrinkCardProps> = ({ drink }) => {
  const { isOpen, selectedDrinkId, openModal, closeModal } = useModalStore();
  const isCurrentModalOpen = isOpen && selectedDrinkId === drink.idDrink;
  const [isFavorite, setIsFavorite] = React.useState(false);

  const {
    data: drinkDetails,
    isLoading,
    error,
  } = useDrinkDetails(isCurrentModalOpen ? selectedDrinkId : null);

  const renderIngredients = (drinkInfo: Drink): React.ReactElement[] => {
    const ingredients: React.ReactElement[] = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = drinkInfo[`strIngredient${i}` as keyof Drink] as string;
      const measure = drinkInfo[`strMeasure${i}` as keyof Drink] as string;
      
      if (ingredient?.trim()) {
        ingredients.push(
          <ListItem key={i} sx={{ py: 0.5, px: 0 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: 12, mr: 2 }}>
              {i}
            </Avatar>
            <ListItemText 
              primary={ingredient.trim()}
              secondary={measure?.trim() || 'To taste'}
              primaryTypographyProps={{ fontWeight: 'medium' }}
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

  const handleToggleFavorite = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleShare = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: drink.strDrink,
        text: `Check out this ${drink.strDrink} cocktail recipe!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${drink.strDrink} - ${window.location.href}`);
    }
  };

  const renderModalContent = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={50} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading recipe details...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          Error loading recipe details. Please try again.
        </Alert>
      );
    }

    if (!drinkDetails) {
      return (
        <Alert severity="warning" sx={{ m: 2 }}>
          No details found for this recipe.
        </Alert>
      );
    }

    const ingredients = renderIngredients(drinkDetails);

    return (
      <Box>
        {/* Header with image and basic info */}
        <Grid2 container spacing={3} sx={{ p: 3 }}>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <CardMedia
              component="img"
              image={drinkDetails.strDrinkThumb}
              alt={drinkDetails.strDrink}
              sx={{ 
                borderRadius: 2, 
                width: '100%', 
                height: 250,
                objectFit: 'cover'
              }}
            />
          </Grid2>
          
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Typography variant="h4" component="h2" fontWeight="bold">
                {drinkDetails.strDrink}
              </Typography>
              <IconButton onClick={handleCloseModal} size="large">
                <Close />
              </IconButton>
            </Box>
            
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {drinkDetails.strCategory && drinkDetails.strCategory.trim() && (
                <Chip 
                  icon={<Category />} 
                  label={drinkDetails.strCategory.trim()} 
                  color="primary" 
                  variant="outlined"
                />
              )}
              {drinkDetails.strAlcoholic && drinkDetails.strAlcoholic.trim() && (
                <Chip 
                  icon={<LiquorOutlined />} 
                  label={drinkDetails.strAlcoholic.trim()} 
                  color="secondary" 
                  variant="outlined"
                />
              )}
              {drinkDetails.strGlass && drinkDetails.strGlass.trim() && (
                <Chip 
                  icon={<LocalBar />} 
                  label={drinkDetails.strGlass.trim()} 
                  color="info" 
                  variant="outlined"
                />
              )}
              {drinkDetails.strIBA && drinkDetails.strIBA.trim() && (
                <Chip 
                  label={`IBA: ${drinkDetails.strIBA.trim()}`} 
                  color="success" 
                  variant="outlined"
                />
              )}
            </Box>

            {drinkDetails.strTags && drinkDetails.strTags.trim() && (
              <Box mb={2}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Tags:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {drinkDetails.strTags.split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0)
                    .map((tag, index) => (
                      <Chip 
                        key={index}
                        label={tag} 
                        size="small" 
                        color="default"
                      />
                    ))}
                </Box>
              </Box>
            )}
          </Grid2>
        </Grid2>

        <Divider />

        {/* Ingredients and Instructions */}
        <Grid2 container spacing={3} sx={{ p: 3 }}>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" display="flex" alignItems="center">
                <Info sx={{ mr: 1 }} />
                Ingredients ({ingredients.length})
              </Typography>
              <List dense>
                {ingredients}
              </List>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 7 }}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" display="flex" alignItems="center">
                <AccessTime sx={{ mr: 1 }} />
                Instructions
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                {drinkDetails.strInstructions}
              </Typography>
              
              {drinkDetails.strInstructionsES && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    Instrucciones en Español:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {drinkDetails.strInstructionsES}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid2>
        </Grid2>

        {/* Additional info if available */}
        {(drinkDetails.strImageSource || drinkDetails.dateModified) && (
          <>
            <Divider />
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              {drinkDetails.strImageSource && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Image source: {drinkDetails.strImageSource}
                </Typography>
              )}
              {drinkDetails.dateModified && (
                <Typography variant="body2" color="text.secondary">
                  Last modified: {new Date(drinkDetails.dateModified).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>
    );
  };

  return (
    <>
      <Card 
        sx={{ 
          maxWidth: 345,
          height: 420, // Altura fija para todas las tarjetas
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6,
          },
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Box position="relative">
          <CardMedia
            component="img"
            height="220"
            image={drink.strDrinkThumb}
            alt={drink.strDrink}
            sx={{ objectFit: 'cover' }}
          />
          <Box
            position="absolute"
            top={8}
            right={8}
            display="flex"
            gap={1}
          >
            <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
              <IconButton
                onClick={handleToggleFavorite}
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                }}
              >
                {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Share recipe">
              <IconButton
                onClick={handleShare}
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                }}
              >
                <Share />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <CardContent sx={{ 
          flexGrow: 1, 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <Box>
            <Typography 
              gutterBottom 
              variant="h6" 
              component="h3" 
              fontWeight="bold"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                minHeight: '3rem', // Altura mínima para 2 líneas
                lineHeight: 1.5
              }}
            >
              {drink.strDrink}
            </Typography>
          </Box>
          
          <Box display="flex" flexWrap="wrap" gap={0.5} mt="auto">
            {drink.strCategory && drink.strCategory.trim() && (
              <Chip 
                label={drink.strCategory.trim()} 
                size="small" 
                color="primary" 
                variant="outlined"
              />
            )}
            {drink.strAlcoholic && drink.strAlcoholic.trim() && (
              <Chip 
                label={drink.strAlcoholic.trim()} 
                size="small" 
                color="secondary" 
                variant="outlined"
              />
            )}
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0, mt: 'auto' }}>
          <Button
            onClick={handleViewRecipe}
            variant="contained"
            fullWidth
            size="large"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            View Recipe
          </Button>
        </CardActions>
      </Card>

      <Modal
        open={isCurrentModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-recipe-title"
      >
        <Box sx={modalStyle}>
          {renderModalContent()}
        </Box>
      </Modal>
    </>
  );
};

export default DrinkCard;
