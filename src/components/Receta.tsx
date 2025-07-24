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

interface RecetaModernaProps {
  receta: Drink;
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

const RecetaModerna: React.FC<RecetaModernaProps> = ({ receta }) => {
  const { isOpen, selectedDrinkId, openModal, closeModal } = useModalStore();
  const isCurrentModalOpen = isOpen && selectedDrinkId === receta.idDrink;

  const {
    data: detalleReceta,
    isLoading,
    error,
  } = useDrinkDetails(isCurrentModalOpen ? selectedDrinkId : null);

  const mostrarIngredientes = (informacion: Drink): React.ReactElement[] => {
    const ingredientes: React.ReactElement[] = [];
    for (let i = 1; i < 16; i++) {
      const ingrediente = informacion[`strIngredient${i}` as keyof Drink] as string;
      const medida = informacion[`strMeasure${i}` as keyof Drink] as string;
      
      if (ingrediente?.trim()) {
        ingredientes.push(
          <ListItem key={i} disablePadding>
            <ListItemText 
              primary={`${ingrediente.trim()} ${medida?.trim() || ''}`}
              sx={{ py: 0.5 }}
            />
          </ListItem>
        );
      }
    }
    return ingredientes;
  };

  const handleVerReceta = (): void => {
    openModal(receta.idDrink);
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
            Cargando detalles de la receta...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error">
          Error al cargar los detalles de la receta. Por favor, inténtalo de nuevo.
        </Alert>
      );
    }

    if (!detalleReceta) {
      return (
        <Alert severity="warning">
          No se encontraron detalles para esta receta.
        </Alert>
      );
    }

    return (
      <>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography id="modal-receta-title" variant="h4" component="h2" sx={{ pr: 2 }}>
            {detalleReceta.strDrink}
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
        
        {detalleReceta.strDrinkThumb && (
          <Box
            component="img"
            src={detalleReceta.strDrinkThumb}
            alt={detalleReceta.strDrink}
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
          Ingredientes y Cantidades
        </Typography>
        <List dense sx={{ mb: 3 }}>
          {mostrarIngredientes(detalleReceta)}
        </List>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
          Instrucciones
        </Typography>
        <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
          {detalleReceta.strInstructions}
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
          image={receta.strDrinkThumb}
          alt={`Imagen de ${receta.strDrink}`}
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
            {receta.strDrink}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleVerReceta}
            sx={{ mt: 'auto' }}
          >
            Ver Receta
          </Button>
        </CardContent>
      </Card>

      <Modal
        open={isCurrentModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-receta-title"
        aria-describedby="modal-receta-description"
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

export default RecetaModerna;
