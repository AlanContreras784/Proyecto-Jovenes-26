import { createContext, useContext, useState } from "react";
import {
  editarEvangelismo,
  eliminarEvangelismo,
  obtenerEvangelismoEnFirebase,
  obtenerRegistrosEvangelismo,
} from "../Auth/firebase";

const EvangelismoContext = createContext();

export function EvangelismoProvider({ children }) {
  const [evangelismo, setEvangelismo] = useState([]);
  const [evangelismoSeleccionado, setEvangelismoSeleccionado] = useState(null);

  // ✅ Obtener todos los registros
  async function obtenerEvangelismosFirebase() {
    const registros = await obtenerRegistrosEvangelismo();
    setEvangelismo(registros);
    return registros;
  }

  // ✅ Obtener uno por ID
  async function obtenerUnevangelismoFirebase(id) {
    try {
      const ev = await obtenerEvangelismoEnFirebase(id);
      setEvangelismoSeleccionado(ev);
      return ev;
    } catch (err) {
      console.error("Error al obtener el evangelismo:", err);
      throw new Error("Hubo un error al obtener el evangelismo.");
    }
  }

  // ✅ Editar
  async function editarevangelismoFirebase(evangelismo) {
    if (!evangelismo?.id) {
      throw new Error("El ID del evangelismo es inválido o no está definido.");
    }
    await editarEvangelismo(evangelismo);
    setEvangelismoSeleccionado(evangelismo);
    return evangelismo;
  }

  // ✅ Eliminar
  async function eliminarEvangelismoFirebase(id) {
    await eliminarEvangelismo(id);
  }

  return (
    <EvangelismoContext.Provider
      value={{
        evangelismo,
        evangelismoSeleccionado,
        obtenerEvangelismosFirebase,
        obtenerUnevangelismoFirebase,
        editarevangelismoFirebase,
        eliminarEvangelismoFirebase,
      }}
    >
      {children}
    </EvangelismoContext.Provider>
  );
}

export const useEvangelismoContext = () => useContext(EvangelismoContext);