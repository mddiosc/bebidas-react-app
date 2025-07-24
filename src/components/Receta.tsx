import React, { useState } from 'react';
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
} from '@mui/material';
import { useModal } from '../hooks/useContexts';
import { Drink } from '../types';

interface RecetaProps {
  receta: Drink;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Receta: React.FC<RecetaProps> = ({ receta }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { guardarIdReceta, inforeceta, guardarReceta } = useModal();

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    guardarIdReceta(null);
    guardarReceta(null);
  };

  const mostrarIngredientes = (informacion: Drink): React.ReactElement[] => {
    const ingredientes: React.ReactElement[] = [];
    for (let i = 1; i < 16; i++) {
      const ingrediente = informacion[`strIngredient${i}` as keyof Drink] as string;
      const medida = informacion[`strMeasure${i}` as keyof Drink] as string;
      
      if (ingrediente) {
        ingredientes.push(
          <ListItem key={i} disablePadding>
            <ListItemText 
              primary={`${ingrediente} ${medida || ''}`}
              sx={{ py: 0.5 }}
            />
          </ListItem>
        );
      }
    }
    return ingredientes;
  };

  const handleVerReceta = (): void => {
    guardarIdReceta(receta.idDrink);
    handleOpen();
  };

  return (
    <Card sx={{ maxWidth: 345, mb: 3 }}>
      <CardMedia
        component="img"
        height="200"
        image={receta.strDrinkThumb}
        alt={`Imagen de ${receta.strDrink}`}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          {receta.strDrink}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleVerReceta}
        >
          Ver Receta
        </Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-receta-title"
          aria-describedby="modal-receta-description"
        >
          <Box sx={modalStyle}>
            {inforeceta && (
              <>
                <Typography id="modal-receta-title" variant="h4" component="h2" gutterBottom>
                  {inforeceta.strDrink}
                </Typography>
                
                <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
                  Instrucciones
                </Typography>
                <Typography variant="body1" paragraph>
                  {inforeceta.strInstructions}
                </Typography>

                {inforeceta.strDrinkThumb && (
                  <Box
                    component="img"
                    src={inforeceta.strDrinkThumb}
                    alt={inforeceta.strDrink}
                    sx={{
                      width: '100%',
                      maxWidth: 300,
                      height: 'auto',
                      my: 2,
                      display: 'block',
                      mx: 'auto',
                    }}
                  />
                )}

                <Typography variant="h6" component="h3" gutterBottom>
                  Ingredientes y Cantidades
                </Typography>
                <List dense>
                  {mostrarIngredientes(inforeceta)}
                </List>
              </>
            )}
          </Box>
        </Modal>
      </CardContent>
    </Card>
  );
};

export default Receta;
