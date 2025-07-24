import React from 'react';
import Header from './components/Header';
import Formulario from './components/Formulario';
import ListaRecetas from './components/ListaRecetas';
import CategoriasProvider from './context/CategoriasContext';
import RecetasProvider from './context/RecetasContext';
import ModalProvider from './context/ModalContext';

const App: React.FC = () => {
  return (
    <CategoriasProvider>
      <RecetasProvider>
        <ModalProvider>
          <Header />
          <Formulario />
          <ListaRecetas />
        </ModalProvider>
      </RecetasProvider>
    </CategoriasProvider>
  );
};

export default App;
