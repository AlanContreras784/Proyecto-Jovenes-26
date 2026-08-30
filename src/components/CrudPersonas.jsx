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

import {
  Button,
  Container,
  Form,
  Table,
  Modal,
  Spinner,
} from "react-bootstrap";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Logo from "../assets/img/logo_jovenes+26_fondoBlanco.jpeg";

import { FaEdit, FaRegTrashAlt, FaFileDownload } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";

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

  const [fechaEvangelismo, setFechaEvangelismo] = useState("");
  const [fechaEvangelismoTimestamp, setFechaEvangelismoTimestamp] =
    useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [datosEvangelismo, setDatosEvangelismo] = useState(null);

  const [cargando, setCargando] = useState(false);

  ////////////////////////////////
  // OBTENER DATOS
  ////////////////////////////////

  useEffect(() => {
    if (!evangelismoId) return;

    obtenerPersonas();
    obtenerFechaEvangelismo();
  }, [evangelismoId]);

  const obtenerPersonas = async () => {
    try {
      if (!evangelismoId) return;

      const snap = await getDocs(
        collection(db, "evangelismo", evangelismoId, "personas")
      );

      const datos = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setPersonas(datos);
    } catch (error) {
      console.error("Error al obtener personas:", error);
    }
  };

  const obtenerFechaEvangelismo = async () => {
    try {
      if (!evangelismoId) return;

      const ref = doc(db, "evangelismo", evangelismoId);

      const snap = await getDoc(ref);

      if (!snap.exists()) return;

      const data = snap.data();

      setDatosEvangelismo(data);

      const timestamp = data?.dia;

      if (!timestamp?.seconds) return;

      setFechaEvangelismoTimestamp(timestamp);

      const fecha = new Date(timestamp.seconds * 1000);

      const strFecha = fecha.toLocaleDateString("es-AR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      setFechaEvangelismo(strFecha);
    } catch (error) {
      console.error("Error al obtener evangelismo:", error);
    }
  };

  ////////////////////////////////
  // FORM
  ////////////////////////////////

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  ////////////////////////////////
  // MODAL
  ////////////////////////////////

  const abrirModalNuevo = () => {
    setForm(formInicial);
    setEditandoId(null);
    setShowModal(true);
  };

  const abrirModalEditar = (persona) => {
    setForm({
      nombre: String(persona?.nombre || ""),
      edad: String(persona?.edad || ""),
      telefono: String(persona?.telefono || ""),
      direccion: String(persona?.direccion || ""),
      pedidoOracion: String(persona?.pedidoOracion || ""),
      nota: String(persona?.nota || ""),
    });

    setEditandoId(persona.id);

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditandoId(null);
    setForm(formInicial);
  };

  ////////////////////////////////
  // GUARDAR
  ////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!evangelismoId) return;

    try {
      setCargando(true);

      const data = {
        nombre: String(form.nombre || ""),
        edad: form.edad === "" ? null : Number(form.edad),
        telefono: String(form.telefono || ""),
        direccion: String(form.direccion || ""),
        pedidoOracion: String(form.pedidoOracion || ""),
        nota: String(form.nota || ""),
        dia: fechaEvangelismoTimestamp,
      };

      if (editandoId) {
        const refDoc = doc(
          db,
          "evangelismo",
          evangelismoId,
          "personas",
          editandoId
        );

        await updateDoc(refDoc, data);
      } else {
        await addDoc(
          collection(db, "evangelismo", evangelismoId, "personas"),
          {
            ...data,
            creado: Timestamp.now(),
          }
        );
      }

      await obtenerPersonas();

      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar persona:", error);
    } finally {
      setCargando(false);
    }
  };

  ////////////////////////////////
  // ELIMINAR
  ////////////////////////////////

  const eliminarPersona = async (id) => {
    try {
      if (!evangelismoId || !id) return;

      const confirmar = window.confirm(
        "¿Seguro que quieres eliminar esta persona?"
      );

      if (!confirmar) return;

      await deleteDoc(
        doc(db, "evangelismo", evangelismoId, "personas", id)
      );

      await obtenerPersonas();
    } catch (error) {
      console.error("Error al eliminar persona:", error);
    }
  };

  ////////////////////////////////
  // IMAGEN BASE64
  ////////////////////////////////

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

  ////////////////////////////////
  // EXPORTAR PDF
  ////////////////////////////////

  const exportarPDF = async () => {
    try {
      if (!datosEvangelismo) return;

      const docPDF = new jsPDF();

      const horaActual = new Date().toLocaleString("es-AR");

      const logoBase64 = await getImageBase64(Logo);

      const logoWidth = 20;
      const logoHeight = 20;

      const logoX = 10;
      const logoY = 10;

      docPDF.addImage(
        logoBase64,
        "PNG",
        logoX,
        logoY,
        logoWidth,
        logoHeight
      );

      const pageWidth = docPDF.internal.pageSize.getWidth();

      const tituloY = logoY + 7;
      const subtituloY = tituloY + 8;

      docPDF.setFontSize(14);

      docPDF.text(
        `LUGAR: ${String(
          datosEvangelismo?.lugarEvangelismo || "Lugar no especificado"
        )}`,
        pageWidth / 2,
        tituloY,
        { align: "center" }
      );

      docPDF.setFontSize(12);

      docPDF.text(
        `Evangelismo del ${String(fechaEvangelismo || "")}`,
        pageWidth / 2,
        subtituloY,
        { align: "center" }
      );

      const body = personas.map((p) => [
        String(p?.nombre || ""),
        String(p?.edad ?? ""),
        String(p?.telefono || "--"),
        String(p?.direccion || "--"),
        String(p?.pedidoOracion || "--"),
        String(p?.nota || "--"),
      ]);

      autoTable(docPDF, {
        startY: logoY + logoHeight + 10,

        head: [
          [
            "Nombre",
            "Edad",
            "Teléfono",
            "Dirección",
            "Pedido",
            "Nota",
          ],
        ],

        body,

        styles: {
          halign: "center",
          fontSize: 10,
        },

        headStyles: {
          fillColor: [0, 102, 204],
          textColor: 255,
          halign: "center",
        },

        margin: {
          left: 14,
          right: 14,
        },

        didDrawPage: () => {
          const pageHeight = docPDF.internal.pageSize.height;

          const baseY = pageHeight - 30;

          docPDF.setFontSize(12);

          docPDF.text(
            `Lugar de Evangelismo: ${String(
              datosEvangelismo?.lugarEvangelismo || "-"
            )}`,
            pageWidth / 2,
            baseY,
            { align: "center" }
          );

          docPDF.text(
            `Obreros: ${String(
              datosEvangelismo?.cantObreros || 0
            )}     -     Personas Oradas: ${String(
              datosEvangelismo?.personasOradas || 0
            )}`,
            pageWidth / 2,
            baseY + 6,
            { align: "center" }
          );

          docPDF.text(
            `Pedidos de Oración: ${String(
              datosEvangelismo?.pedidosOracion || 0
            )}     -     Decisiones: ${String(
              datosEvangelismo?.decisiones || 0
            )}`,
            pageWidth / 2,
            baseY + 12,
            { align: "center" }
          );

          docPDF.text(
            `Comentarios: ${String(
              datosEvangelismo?.comentarios || "-"
            )}`,
            pageWidth / 2,
            baseY + 18,
            { align: "center" }
          );

          docPDF.setFontSize(8);

          docPDF.text(
            `PDF generado el ${horaActual}`,
            14,
            pageHeight - 10
          );
        },
      });

      docPDF.save(
        `personas_${String(fechaEvangelismo || "evangelismo")}.pdf`
      );
    } catch (error) {
      console.error("Error al exportar PDF:", error);
    }
  };

  ////////////////////////////////
  // VALIDACION
  ////////////////////////////////

  if (!evangelismoId) {
    return (
      <Container className="mt-4">
        <p>
          Debe seleccionar un evangelismo válido para ver las
          personas.
        </p>
      </Container>
    );
  }

  ////////////////////////////////
  // RENDER
  ////////////////////////////////

  return (
    <Container className="mt-4">
      <h3>
        {String(datosEvangelismo?.lugarEvangelismo || "")}
        {" - "}
        Evangelismo del {String(fechaEvangelismo || "")}
      </h3>

      <Button
        title="Agregar Personas"
        variant="success"
        className="mb-3"
        onClick={abrirModalNuevo}
      >
        Agregar <IoMdPersonAdd size={24} />
      </Button>

      <Button
        title="Descargar PDF"
        variant="secondary"
        className="mb-3 ms-2"
        onClick={exportarPDF}
      >
        Descargar <FaFileDownload size={24} />
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
              <td>{String(p?.nombre || "")}</td>
              <td>{String(p?.edad || "")}</td>
              <td>{String(p?.telefono || "")}</td>
              <td>{String(p?.direccion || "")}</td>
              <td>{String(p?.pedidoOracion || "")}</td>
              <td>{String(p?.nota || "")}</td>

              <td>
                <Button
                  title="Editar"
                  variant="primary"
                  size="sm"
                  className="mb-1"
                  onClick={() => abrirModalEditar(p)}
                >
                  <FaEdit size={18} />
                </Button>{" "}

                <Button
                  title="Eliminar"
                  variant="danger"
                  size="sm"
                  onClick={() => eliminarPersona(p.id)}
                >
                  <FaRegTrashAlt size={18} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        key={editandoId || "nuevo"}
        show={showModal}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editandoId
              ? "Editar Persona"
              : "Agregar Persona"}
          </Modal.Title>
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

            <Button type="submit" disabled={cargando}>
              {cargando ? (
                <>
                  <Spinner size="sm" />
                  {" Guardando..."}
                </>
              ) : editandoId ? (
                "Guardar Cambios"
              ) : (
                "Agregar Persona"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CrudPersonas;