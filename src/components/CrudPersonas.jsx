import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../Auth/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { Button, Container, Form, Table, Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Logo from "../assets/img/logo_jovenes+26_fondoBlanco.jpeg";

const formInicial = {
  nombre: "",
  edad: "",
  telefono: "",
  direccion: "",
  pedidoOracion: "",
  nota: "",
};

const CrudPersonas = () => {
  const { evangelismoId } = useParams();
  const [personas, setPersonas] = useState([]);
  const [form, setForm] = useState(formInicial);
  const [fechaEvangelismo, setFechaEvangelismo] = useState(null);
  const [fechaEvangelismoTimestamp, setFechaEvangelismoTimestamp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null); // id persona editando o null
  const [datosEvangelismo, setDatosEvangelismo] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    obtenerPersonas();
    obtenerFechaEvangelismo();
  }, []);

  const obtenerPersonas = async () => {
    const snap = await getDocs(
      collection(db, "evangelismo", evangelismoId, "personas")
    );
    const datos = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPersonas(datos);
  };

  const obtenerFechaEvangelismo = async () => {
  const ref = doc(db, "evangelismo", evangelismoId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    setDatosEvangelismo(data); // Guarda todo

    const timestamp = data.dia;
    setFechaEvangelismoTimestamp(timestamp);

    const fecha = new Date(timestamp.seconds * 1000);
    const strFecha = fecha.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setFechaEvangelismo(strFecha);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const abrirModalNuevo = () => {
    setForm(formInicial);
    setEditandoId(null);
    setShowModal(true);
  };

  const abrirModalEditar = (persona) => {
    setForm({
      nombre: persona.nombre || "",
      edad: persona.edad || "",
      telefono: persona.telefono || "",
      direccion: persona.direccion || "",
      pedidoOracion: persona.pedidoOracion || "",
      nota: persona.nota || "",
    });
    setEditandoId(persona.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      if (editandoId) {
        // Actualizar persona
        const refDoc = doc(db, "evangelismo", evangelismoId, "personas", editandoId);
        await updateDoc(refDoc, {
          ...form,
          edad: Number(form.edad),
          dia: fechaEvangelismoTimestamp,
        });
      } else {
        // Crear persona nueva
        await addDoc(collection(db, "evangelismo", evangelismoId, "personas"), {
          ...form,
          edad: Number(form.edad),
          creado: Timestamp.now(),
          dia: fechaEvangelismoTimestamp,
        });
      }
      setForm(formInicial);
      setShowModal(false);
      setEditandoId(null);
      obtenerPersonas();
      setCargando(false);
    } catch (e) {
      console.error("Error al guardar persona:", e);
    }
  };

  const eliminarPersona = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta persona?")) {
      try {
        await deleteDoc(doc(db, "evangelismo", evangelismoId, "personas", id));
        obtenerPersonas();
      } catch (e) {
        console.error("Error al eliminar persona:", e);
      }
    }
  };

  //////////////////////CONVERTIR LA IMAGEN DEL LOGO A BASE 64 PARA PODER IMPRIMIR////////////////////////
  const getImageBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
  });
};


//////////////////////////////FUNCION PARA IMPRMIR EN FORMATO PDF///////////////////////////////////////

const exportarPDF = async () => {
  const docPDF = new jsPDF();
  const horaActual = new Date().toLocaleString("es-AR");

  // Convertir imagen importada a base64
  const logoBase64 = await getImageBase64(Logo);

  // Ajustar logo: (x, y, width, height)
  const logoWidth = 20;
  const logoHeight = 20;
  const logoX = 10;
  const logoY = 10;

  // Insertar logo en la esquina superior izquierda
  docPDF.addImage(logoBase64, "PNG", logoX, logoY, logoWidth, logoHeight);

  // Para centrar título y subtítulo, calculamos la mitad del ancho de página
  const pageWidth = docPDF.internal.pageSize.getWidth();
  const tituloY = logoY + 7;   // altura para el título
  const subtituloY = tituloY + 8; // altura para el subtítulo

  docPDF.setFontSize(14);
  docPDF.text(`LUGAR: ${datosEvangelismo.lugarEvangelismo || 'Lugar no especificado'}`, pageWidth / 2, tituloY, { align: "center" });

  docPDF.setFontSize(12);
  docPDF.text(`Evangelismo del ${fechaEvangelismo}`, pageWidth / 2, subtituloY, { align: "center" });

  const body = personas.map((p) => [
    p.nombre,
    p.edad || "--",
    p.telefono || "--",
    p.direccion || "--",
    p.pedidoOracion || "--",
    p.nota || "--",
  ]);

  autoTable(docPDF, {
    startY: logoY + logoHeight + 10, // iniciar debajo del logo
    head: [["Nombre", "Edad", "Teléfono", "Dirección", "Pedido", "Nota"]],
    body,
    styles: {
      halign: "center",  // centra texto en todas las celdas
      fontSize: 10,
    },
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: 255,
      halign: "center",  // centra encabezados
    },
    margin: { left: 14, right: 14 },

    didDrawPage: (data) => {
      const pageHeight = docPDF.internal.pageSize.height;
      const baseY = pageHeight - 30;

      docPDF.setFontSize(12);
      // Centramos los datos del evangelismo al final
      docPDF.text(`Lugar de Evangelismo: ${datosEvangelismo.lugarEvangelismo || "-"}`, pageWidth / 2, baseY, { align: "center" });
      docPDF.text(`Obreros: ${datosEvangelismo.cantObreros || 0}     -     Personas Oradas: ${datosEvangelismo.personasOradas || 0}`, pageWidth / 2, baseY + 6, { align: "center" });
      docPDF.text(`Pedidos de Oración: ${datosEvangelismo.pedidosOracion || 0}     -     Decisiones: ${datosEvangelismo.decisiones || 0}`, pageWidth / 2, baseY + 12, { align: "center" });
      docPDF.text(`Comentarios: ${datosEvangelismo.comentarios || "-"}`, pageWidth / 2, baseY + 18, { align: "center" });

      docPDF.setFontSize(8);
      docPDF.text(`PDF generado el ${horaActual}`, 14, pageHeight - 10);
    },
  });

  docPDF.save(`personas_${fechaEvangelismo}.pdf`);
};






  return (
    <Container className="mt-4">
      <h3>{datosEvangelismo?.lugarEvangelismo || ''} - Evangelismo del {fechaEvangelismo}</h3>

      <Button className="mb-3" onClick={abrirModalNuevo}>
        Agregar Persona
      </Button>

      <Button variant="secondary" className="mb-3 ms-2" onClick={exportarPDF}>
        Exportar a PDF
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Pedido</th>
            <th>Nota</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.edad}</td>
              <td>{p.telefono}</td>
              <td>{p.direccion}</td>
              <td>{p.pedidoOracion}</td>
              <td>{p.nota}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEditar(p)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => eliminarPersona(p.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para crear o editar persona */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editandoId ? "Editar Persona" : "Agregar Persona"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Edad</Form.Label>
              <Form.Control
                type="number"
                name="edad"
                value={form.edad}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Pedido de Oración</Form.Label>
              <Form.Control
                type="text"
                name="pedidoOracion"
                value={form.pedidoOracion}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Nota</Form.Label>
              <Form.Control
                type="text"
                name="nota"
                value={form.nota}
                onChange={handleChange}
              />
            </Form.Group>

            <Button type="submit">{editandoId ? "Guardar Cambios" : "Agregar Persona"}</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CrudPersonas;
