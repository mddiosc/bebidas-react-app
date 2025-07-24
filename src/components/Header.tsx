import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#dc3545' }}>
      <Toolbar>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1, textAlign: 'center' }}>
          Busca Recetas de Bebidas
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
