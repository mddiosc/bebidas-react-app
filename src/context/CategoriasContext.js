import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// crear context

export const CategoriasContext = createContext();

const CategoriasProvider = (props) => {
  //creamos el state

  const [categorias, guardarCategorias] = useState([]);

  //Ejecutamos la llamada al api

  useEffect(() => {
    const obtenerCategorias = async () => {
      const url = `https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list`;
      const categorias = await axios.get(url);
      guardarCategorias(categorias.data.drinks);
    };
    obtenerCategorias();
  }, []);

  return (
    <CategoriasContext.Provider value={{ categorias }}>
      {props.children}
    </CategoriasContext.Provider>
  );
};

export default CategoriasProvider;
