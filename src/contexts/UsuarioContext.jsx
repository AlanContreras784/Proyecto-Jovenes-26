import { createContext, useState, useContext } from 'react';
import { editarUsuario, eliminarUsuario, obtenerUsuarioEnFirebase, obtenerUsuarios } from '../Auth/firebase.js';


// Crear el contexto del manejo de Productos------------------------------------ 
const UsuariosContext = createContext();

export function UsuariosProvider({ children }) {

    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    function obtenerUsuariosFirebase(){
        return(
            new Promise((res, rej) => {
                obtenerUsuarios().then(usuarios => {
                    setUsuarios(usuarios)
                    res(usuarios)
                }).catch(error => {
                    rej(error)
                })
            })
        )
    }


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

    function editarUsuarioFirebase(usuario){
        return(
            new Promise((res, rej) => {
                editarUsuario(usuario).then(usuario => {
                    setUsuarioSeleccionado(usuario)
                    //console.log(usuario)
                    res(usuario)
                }).catch(error => {
                    rej (error)
                })
            })
        )
    }

    function eliminarUsuarioFirebase(id){
        return(
            new Promise((res, rej) => {
                eliminarUsuario(id).then(() => {
                    res()
                }).catch(error => {
                    rej(error)
                })
            })
        )
    }



    return (
        <UsuariosContext.Provider value={{ usuarioSeleccionado,obtenerUsuariosFirebase, obtenerUnUsuarioFirebase, editarUsuarioFirebase, eliminarUsuarioFirebase }}>
            {children}
        </UsuariosContext.Provider> );
}
export const useUsuariosContext = () => useContext(UsuariosContext);