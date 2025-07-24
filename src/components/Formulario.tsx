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
  CircularProgress,
  Alert,
} from '@mui/material';
import { useCategories } from '../hooks/useQueries';
import { SearchFormData } from '../types';

interface FormularioProps {
  onSearch: (searchParams: SearchFormData) => void;
}

const Formulario: React.FC<FormularioProps> = ({ onSearch }) => {
  const [busqueda, guardarBusqueda] = useState<SearchFormData>({
    nombre: '',
    categoria: '',
  });

  const { data: categorias = [], isLoading, error } = useCategories();

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
    if (busqueda.nombre.trim() || busqueda.categoria.trim()) {
      onSearch(busqueda);
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error al cargar las categorías. Por favor, inténtalo de nuevo.
        </Alert>
      </Container>
    );
  }

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
              name="nombre"
              label="Buscar por ingrediente"
              placeholder="Ej: vodka, ron, limón..."
              value={busqueda.nombre}
              onChange={obtenerDatosInput}
              variant="outlined"
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
                disabled={isLoading}
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
              {isLoading && (
                <CircularProgress size={20} sx={{ position: 'absolute', right: 40, top: 15 }} />
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={!busqueda.nombre.trim() && !busqueda.categoria.trim()}
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
