import { useEffect, useState } from "react";
import {
  obtenerUsuarios,
  eliminarUsuario,
  editarUsuario,
} from "../Auth/firebase";
import CardUsuario from "./CardUsuario";
import { Modal, Button, Form } from "react-bootstrap";
import { dispararSweetAlertBasico } from "../assets/SweetAlert";

function ListUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [imagenPreview, setImagenPreview] = useState("");
  const [nuevaImagen, setNuevaImagen] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    const resultado = await obtenerUsuarios();
    setUsuarios(resultado);
  }

  const handleEditar = (usuario) => {
    setUsuarioSeleccionado({ ...usuario });
    setImagenPreview(usuario.imagen);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Eliminar este usuario?");
    if (confirmar) {
      await eliminarUsuario(id);
      dispararSweetAlertBasico("Usuario eliminado", "", "success", "OK");
      cargarUsuarios();
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNuevaImagen(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const handleGuardarCambios = async () => {
    try {
      let imagenFinal = usuarioSeleccionado.imagen;

      // Subida a Cloudinary si hay nueva imagen
      if (nuevaImagen) {
        const data = new FormData();
        data.append("file", nuevaImagen);
        data.append("upload_preset", "usuarios_react");

        const res = await fetch("https://api.cloudinary.com/v1_1/dtxm4r6ys/image/upload", {
          method: "POST",
          body: data,
        });

        const fileData = await res.json();
        imagenFinal = fileData.secure_url;
      }

      await editarUsuario({
        ...usuarioSeleccionado,
        imagen: imagenFinal,
      });

      setShowModal(false);
      dispararSweetAlertBasico("Usuario actualizado", "", "success", "OK");
      cargarUsuarios();
    } catch (e) {
      console.error("Error al editar", e);
    }
  };

  return (
    <div className="d-flex flex-wrap justify-content-center gap-3 p-3">
      {usuarios.map((u) => (
        <CardUsuario
          key={u.id}
          usuario={u}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />
      ))}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {usuarioSeleccionado && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={usuarioSeleccionado.name}
                  onChange={(e) =>
                    setUsuarioSeleccionado({
                      ...usuarioSeleccionado,
                      name: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Edad</Form.Label>
                <Form.Control
                  type="number"
                  value={usuarioSeleccionado.age}
                  onChange={(e) =>
                    setUsuarioSeleccionado({
                      ...usuarioSeleccionado,
                      age: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>País</Form.Label>
                <Form.Control
                  type="text"
                  value={usuarioSeleccionado.country}
                  onChange={(e) =>
                    setUsuarioSeleccionado({
                      ...usuarioSeleccionado,
                      country: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Imagen</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImagenChange}
                />
              </Form.Group>

              {imagenPreview && (
                <div className="text-center">
                  <img
                    src={imagenPreview}
                    alt="preview"
                    style={{ width: "100%", borderRadius: "10px" }}
                  />
                </div>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarCambios}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ListUsuarios;
