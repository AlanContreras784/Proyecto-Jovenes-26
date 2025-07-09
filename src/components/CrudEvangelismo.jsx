import { useEffect, useState } from "react";
import {crearEvangelismoEnFirebase, editarEvangelismo} from "../Auth/firebase";
import {Button, Container, Modal, Table, Form} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {dispararSweetAlertBasico, dispararSweetAlertTrueFalse} from "../assets/SweetAlert";
import { useEvangelismoContext } from "../contexts/EvangelismoContext";
import { Timestamp } from "firebase/firestore";

const formInicial = {
  dia: "",
  cantObreros: "",
  pedidosOracion: "",
  personasOradas: "",
  decisiones: "",
  comentarios: "",
};

// Función para convertir timestamp a string 'YYYY-MM-DD' para el input date
function timestampToDateInputValue(timestamp) {
  if (!timestamp?.seconds) return "";
  const date = new Date(timestamp.seconds * 1000);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Función para convertir string 'YYYY-MM-DD' a Timestamp fijando mediodía
function dateStringToTimestamp(dateString) {
  // La hora se fija a las 12:00 para evitar desfases por zona horaria
  const date = new Date(dateString + "T12:00:00");
  return Timestamp.fromDate(date);
}

const CrudEvangelismo = () => {
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(formInicial);
  const [editId, setEditId] = useState(null);
  const [evangelismoActual, setEvangelismoActual] = useState(null);
  const [registros, setRegistros] = useState(null);

  const navigate = useNavigate();

  const {
    obtenerEvangelismosFirebase,
    eliminarEvangelismoFirebase,
    obtenerUnevangelismoFirebase
  } = useEvangelismoContext();

  useEffect(() => {
    obtenerEvangelismosFirebase()
      .then((datos) => {
        setRegistros(datos);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error", error);
        setError("Hubo un problema al cargar los registros.");
        setCargando(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setShow(false);
    setEvangelismoActual(null);
    setForm(formInicial);
    setEditId(null);
  };

  const cargarDatos = async () => {
    try {
      const evangelismoSeleccionado = await obtenerUnevangelismoFirebase(evangelismoActual.id);

      setForm({
        ...evangelismoSeleccionado,
        dia: timestampToDateInputValue(evangelismoSeleccionado.dia),
        cantObreros: Number(evangelismoSeleccionado.cantObreros),
        pedidosOracion: Number(evangelismoSeleccionado.pedidosOracion),
        personasOradas: Number(evangelismoSeleccionado.personasOradas),
        decisiones: Number(evangelismoSeleccionado.decisiones),
        comentarios: evangelismoSeleccionado.comentarios || "",
      });

      setEditId(evangelismoSeleccionado.id);
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setError("Hubo un problema al cargar los datos.");
      setCargando(false);
    }
  };

  useEffect(() => {
    if (show && evangelismoActual?.id) {
      cargarDatos();
    }
  }, [show, evangelismoActual]);

  const handleShow = (item = null) => {
    setEvangelismoActual(item);
    setShow(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const timestampDia = dateStringToTimestamp(form.dia);

      if (editId) {
        await editarEvangelismo({
          id: editId,
          dia: timestampDia,
          cantObreros: Number(form.cantObreros),
          pedidosOracion: Number(form.pedidosOracion),
          personasOradas: Number(form.personasOradas),
          decisiones: Number(form.decisiones),
          comentarios: form.comentarios,
        });

        dispararSweetAlertBasico("Editado exitosamente", "", "success", "Confirmar");
      } else {
        await crearEvangelismoEnFirebase(
          timestampDia,
          Number(form.cantObreros),
          Number(form.pedidosOracion),
          Number(form.personasOradas),
          Number(form.decisiones),
          form.comentarios
        );

        dispararSweetAlertBasico("Agregado exitosamente", "", "success", "Confirmar");
      }

      handleClose();
      const nuevosDatos = await obtenerEvangelismosFirebase();
      setRegistros(nuevosDatos);
      navigate("/listaEvangelismo");
    } catch (error) {
      console.error("Error al guardar:", error);
      dispararSweetAlertBasico("Error", "No se pudo guardar el registro", "error", "Cerrar");
      setError("Error al guardar el registro: " + error.message);
    }
  };

  const dispararEliminar = async (id) => {
    const confirmar = await dispararSweetAlertTrueFalse(
      '¿Estás seguro que quieres eliminar este usuario?',
      "Esto no se puede deshacer",
      'warning',
      'Sí, Eliminar'
    );

    if (confirmar) {
      eliminarEvangelismoFirebase(id)
        .then(async () => {
          dispararSweetAlertBasico('Eliminado', 'Usuario eliminado correctamente.', 'success', 'OK');
          const nuevosDatos = await obtenerEvangelismosFirebase();
          setRegistros(nuevosDatos);
        })
        .catch((error) => {
          dispararSweetAlertBasico("Hubo un problema al eliminar el usuario", error.message, "error", "Cerrar");
        });
    }
  };

  if (cargando) return <p>Cargando registros...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container className="mt-4">
      <h2>CRUD de Evangelismo</h2>
      <Button className="mb-3" onClick={() => handleShow()}>Agregar Registro</Button>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Día</th>
            <th>Cant. Obreros</th>
            <th>P. Oradas</th>
            <th>Pedidos</th>
            <th>Decisiones</th>
            <th>Comentarios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registros.map(item => (
            <tr key={item.id}>
              <td>{timestampToDateInputValue(item.dia).replace(/-/g, '/')}</td>
              <td>{item.cantObreros}</td>
              <td>{item.personasOradas}</td>
              <td>{item.pedidosOracion}</td>
              <td>{item.decisiones}</td>
              <td>{item.comentarios}</td>
              <td>
                <Button size="sm" onClick={() => handleShow(item)}>Editar</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => dispararEliminar(item.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Editar" : "Agregar"} Evangelismo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Día</Form.Label>
              <Form.Control
                type="date"
                name="dia"
                value={form.dia}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Cant. Obreros</Form.Label>
              <Form.Control
                type="number"
                name="cantObreros"
                value={form.cantObreros}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Personas Oradas</Form.Label>
              <Form.Control
                type="number"
                name="personasOradas"
                value={form.personasOradas}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Pedidos de Oración</Form.Label>
              <Form.Control
                type="number"
                name="pedidosOracion"
                value={form.pedidosOracion}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Decisiones</Form.Label>
              <Form.Control
                type="number"
                name="decisiones"
                value={form.decisiones}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Comentarios</Form.Label>
              <Form.Control
                type="text"
                name="comentarios"
                value={form.comentarios || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Button type="submit" className="mt-2">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CrudEvangelismo;
