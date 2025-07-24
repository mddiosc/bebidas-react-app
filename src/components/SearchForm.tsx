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

interface FormProps {
  onSearch: (searchParams: SearchFormData) => void;
}

const Form: React.FC<FormProps> = ({ onSearch }) => {
  const [searchData, setSearchData] = useState<SearchFormData>({
    name: '',
    category: '',
  });

  const { data: categories = [], isLoading, error } = useCategories();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>): void => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchData.name.trim() || searchData.category.trim()) {
      onSearch(searchData);
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading categories. Please try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" component="legend" align="center" gutterBottom>
          Search Drinks by Category or Ingredient
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="name"
              label="Search by ingredient"
              placeholder="e.g: vodka, rum, lemon..."
              value={searchData.name}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={searchData.category}
                onChange={handleSelectChange}
                label="Category"
                disabled={isLoading}
              >
                <MenuItem value="">
                  <em>-- Select Category --</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.strCategory} value={category.strCategory}>
                    {category.strCategory}
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
              disabled={!searchData.name.trim() && !searchData.category.trim()}
              sx={{ height: '56px' }}
            >
              Search Drinks
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Form;
