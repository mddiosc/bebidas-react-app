import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Container,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  CircularProgress,
  Alert,
  Paper,
  Box,
  Chip,
  Divider,
  Fade,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { Search, FilterList, LocalBar } from '@mui/icons-material';
import { useCategories } from '../hooks/useQueries';
import { SearchFormData } from '../types';

interface FormProps {
  onSearch: (searchParams: SearchFormData) => void;
}

const SearchForm: React.FC<FormProps> = ({ onSearch }) => {
  const [searchData, setSearchData] = useState<SearchFormData>({
    name: '',
    category: '',
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

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
      // Add to recent searches
      const searchTerm = searchData.name.trim() || searchData.category;
      if (searchTerm && !recentSearches.includes(searchTerm)) {
        setRecentSearches(prev => [searchTerm, ...prev].slice(0, 5));
      }
      onSearch(searchData);
    }
  };

  const handleRecentSearchClick = (searchTerm: string): void => {
    setSearchData({ name: searchTerm, category: '' });
    onSearch({ name: searchTerm, category: '' });
  };

  const handleClearForm = (): void => {
    setSearchData({ name: '', category: '' });
  };

  const isSearchDisabled = !searchData.name.trim() && !searchData.category.trim();

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
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 2
        }}
      >
        <Box textAlign="center" mb={3}>
          <LocalBar sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Cocktail Explorer
          </Typography>
          <Typography variant="h6" component="p" sx={{ opacity: 0.9 }}>
            Discover amazing cocktail recipes from around the world
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={3} alignItems="center">
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                name="name"
                label="Search by name or ingredient"
                placeholder="e.g: margarita, vodka, rum, lemon..."
                value={searchData.name}
                onChange={handleInputChange}
                variant="outlined"
                InputProps={{
                  startAdornment: <Search sx={{ color: '#1976d2', mr: 1 }} />,
                  sx: {
                    '& .MuiInputBase-input::placeholder': {
                      color: '#666',
                      opacity: 1,
                      fontStyle: 'italic',
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { 
                    color: '#1976d2',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    '&.Mui-focused': { 
                      color: '#1976d2',
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                    '&.MuiInputLabel-shrink': {
                      color: '#1976d2',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.8)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      '& fieldset': {
                        borderColor: '#1976d2',
                      },
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      '& fieldset': {
                        borderColor: '#1976d2',
                        borderWidth: '2px',
                      },
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: '#1a1a1a',
                    fontWeight: '500',
                  }
                }}
              />
            </Grid2>
            
            <Grid2 size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel 
                  sx={{ 
                    color: '#1976d2',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    '&.Mui-focused': { 
                      color: '#1976d2',
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                    '&.MuiInputLabel-shrink': {
                      color: '#1976d2',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }
                  }}
                >
                  Category
                </InputLabel>
                <Select
                  name="category"
                  value={searchData.category}
                  onChange={handleSelectChange}
                  label="Category"
                  disabled={isLoading}
                  startAdornment={<FilterList sx={{ color: '#1976d2', mr: 1 }} />}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.8)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      '& fieldset': {
                        borderColor: '#1976d2',
                      },
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      '& fieldset': {
                        borderColor: '#1976d2',
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#1a1a1a',
                      fontWeight: '500',
                    }
                  }}
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
            </Grid2>
            
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Box display="flex" gap={1}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="large"
                  disabled={isSearchDisabled}
                  sx={{ 
                    height: '56px',
                    fontWeight: 'bold',
                    backgroundColor: '#FF6B6B',
                    '&:hover': { backgroundColor: '#FF5252' }
                  }}
                >
                  Search Drinks
                </Button>
                {!isSearchDisabled && (
                  <Button
                    variant="outlined"
                    onClick={handleClearForm}
                    sx={{ 
                      minWidth: '56px',
                      height: '56px',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      color: 'white',
                      '&:hover': { 
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Clear
                  </Button>
                )}
              </Box>
            </Grid2>
          </Grid2>
        </form>
      </Paper>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <Fade in>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Searches
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" flexWrap="wrap" gap={1}>
              {recentSearches.map((search, index) => (
                <Chip
                  key={index}
                  label={search}
                  onClick={() => handleRecentSearchClick(search)}
                  color="primary"
                  variant="outlined"
                  clickable
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'primary.main',
                      color: 'white'
                    }
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Fade>
      )}
    </Container>
  );
};

export default SearchForm;
