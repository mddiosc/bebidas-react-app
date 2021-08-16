import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// crear context

export const ModalContext = createContext();

const ModalProvider = (props) => {
  const [idReceta, guardarIdReceta] = useState(null);
  const [informacion, guardarReceta] = useState({})

  // una vex tenemos el id llamamos api

  useEffect(() => {
    const obtenerReceta = async () => {
      if (!idReceta) return null;
      const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idReceta}`;
      const resultado = await axios.get(url);
      guardarReceta(resultado.data.drinks[0]);
    };
    obtenerReceta();
  }, [idReceta]);

  return (
    <ModalContext.Provider
      value={{ guardarIdReceta, informacion, guardarReceta }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
