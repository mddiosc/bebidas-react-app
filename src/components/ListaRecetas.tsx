import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { useRecetas } from '../hooks/useContexts';
import Receta from './Receta';

const ListaRecetas: React.FC = () => {
  const { recetas } = useRecetas();

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      {recetas.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary">
          No se encontraron recetas. Intenta con otros términos de búsqueda.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {recetas.map((receta) => (
            <Grid item xs={12} sm={6} md={4} key={receta.idDrink}>
              <Receta receta={receta} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ListaRecetas;
