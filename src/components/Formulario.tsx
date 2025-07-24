import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Container,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { useCategorias, useRecetas } from '../hooks/useContexts';
import { SearchFormData } from '../types';

const Formulario: React.FC = () => {
  const [busqueda, guardarBusqueda] = useState<SearchFormData>({
    nombre: '',
    categoria: '',
  });

  const { categorias } = useCategorias();
  const { buscarRecetas, guardarConsultar } = useRecetas();

  const obtenerDatosInput = (e: ChangeEvent<HTMLInputElement>): void => {
    guardarBusqueda({
      ...busqueda,
      [e.target.name]: e.target.value,
    });
  };

  const obtenerDatosSelect = (e: SelectChangeEvent<string>): void => {
    guardarBusqueda({
      ...busqueda,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    buscarRecetas(busqueda);
    guardarConsultar(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" component="legend" align="center" gutterBottom>
          Busca Bebidas por Categoría o Ingrediente
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="text"
              name="nombre"
              label="Buscar por ingrediente"
              placeholder="Ej: vodka, ron, whisky..."
              variant="outlined"
              value={busqueda.nombre}
              onChange={obtenerDatosInput}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Categoría</InputLabel>
              <Select
                name="categoria"
                value={busqueda.categoria}
                onChange={obtenerDatosSelect}
                label="Categoría"
              >
                <MenuItem value="">
                  <em>-- Selecciona Categoría --</em>
                </MenuItem>
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.strCategory} value={categoria.strCategory}>
                    {categoria.strCategory}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ height: '56px' }}
            >
              Buscar Bebidas
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Formulario;
