import { createContext, useState, useContext } from 'react';
import Swal from "sweetalert2";

// Crear el contexto de autenticación
const AuthContext = createContext();
export function AuthProvider({ children }) {
  
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);

  //--------------------FUNCION INICIAR SESION ------------------------------------
  const login = (username) => {
    // Simulando la creación de un token (en una app real, esto sería generado por un servidor)
    const token = `fake-token-${username}`;
  
    if(username==="admin@gmail.com"){ //contraseña : test12
        setAdmin(true);
    }
    localStorage.setItem('authToken', token);
    setUser(username);
  };

  //Funcion para cerrar Sesion-------------------------------------
  const logout = () => {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "¡Quieres cerrar sesión!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, cerrar!",
        cancelButtonText: "Cancelar",
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
            title: "Ok!",
            text: "Cerraste sesión.",
            icon: "success"
            });
            localStorage.removeItem('authToken');
            setUser(null);
            setAdmin(false)
        }else{

        }
    });

  };

  //FUNNCION PARA VERIFICACION DE USUARIO Y ADMIN--------------------------
  function verificacionLog(){
    const userToken = localStorage.getItem("authToken")
    if(userToken && userToken == "fake-token-admin@gmail.com"){
      setAdmin(true)
      setUser(userToken)
      return
    }if(userToken){
      setUser(userToken)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, admin, verificacionLog}}>
      {children}
    </AuthContext.Provider> );
}
export const useAuthContext = () => useContext(AuthContext);