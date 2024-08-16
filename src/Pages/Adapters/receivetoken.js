

// Almacena el token en una variable global o en un contexto si es necesario
let token = null;

// Función para establecer el token
export const setToken = (newToken) => {
  token = newToken;
};

// Función para obtener el token
export const getToken = () => {
  return token;
};
