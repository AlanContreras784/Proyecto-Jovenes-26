import { createContext, useState, useContext } from 'react';
import Swal from "sweetalert2";
import { obtenerUsuarioEnFirebase } from '../Auth/firebase.js';

// Crear el contexto del manejo de Productos------------------------------------ 
const UsuariosContext = createContext();

export function UsuariosProvider({ children }) {

    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

function obtenerUnUsuarioFirebase(id){
        return(
            new Promise((res, rej) => {
                obtenerUsuarioEnFirebase(id).then((usuario) => {
                    setUsuarioSeleccionado(usuario)
                    res(usuario)
                }).catch((err) => {
                    console.log("Error:", err);
                    rej("Hubo un error al obtener el usuario.");
                }); 
            })
        )
    }


return (
    <UsuariosContext.Provider value={{ usuarioSeleccionado, obtenerUnUsuarioFirebase }}>
        {children}
    </UsuariosContext.Provider> );
}
export const useUsuariosContext = () => useContext(UsuariosContext);