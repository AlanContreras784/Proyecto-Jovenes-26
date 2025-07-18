import { useEffect, useState } from "react";
import {
  crearEvangelismoEnFirebase,
  editarEvangelismo,
} from "../Auth/firebase";
import { Button, Container, Modal, Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  dispararSweetAlertBasico,
  dispararSweetAlertTrueFalse,
} from "../assets/SweetAlert";
import { useEvangelismoContext } from "../contexts/EvangelismoContext";
import { Timestamp } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Logo from "../assets/img/logo_jovenes+26_fondoBlanco.jpeg"; // Logo válido

// Estado inicial para el formulario
const formInicial = {
  dia: "",
  lugarEvangelismo:"",
  cantObreros: "",
  pedidosOracion: "",
  personasOradas: "",
  decisiones: "",
  comentarios: "",
};

// Convierte un Timestamp de Firestore a formato yyyy-mm-dd para inputs tipo date
function timestampToDateInputValue(timestamp) {
  if (!timestamp?.seconds) return "";
  const date = new Date(timestamp.seconds * 1000);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Convierte una cadena 'yyyy-mm-dd' a Timestamp de Firestore
function dateStringToTimestamp(dateString) {
  const date = new Date(dateString + "T12:00:00"); // mediodía para evitar zonas horarias problemáticas
  return Timestamp.fromDate(date);
}

// Convierte una imagen a base64 para poder usarla en jsPDF
const getImageBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // evita problemas CORS
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

// Agrupa registros por mes para organizar el PDF
const agruparPorMes = (registros) => {
  const grupos = {};
  registros.forEach((item) => {
    const fecha = new Date(item.dia.seconds * 1000);
    // Obtiene mes y año en español (ej: "julio 2025")
    const mesClave = fecha.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
    });
    // Convertir a mayúsculas sin problemas con acentos
  const mesClaveMayus = mesClave.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    if (!grupos[mesClaveMayus]) grupos[mesClaveMayus] = [];
    grupos[mesClaveMayus].push(item);
  });
  return grupos;
};

// Calcula totales mensuales para el resumen del PDF
const generarResumenMensual = (registrosPorMes) => {
  const resumen = [];
  for (const [mes, items] of Object.entries(registrosPorMes)) {
    const totalObreros = items.reduce((sum, r) => sum + (r.cantObreros || 0), 0);
    const totalOradas = items.reduce((sum, r) => sum + (r.personasOradas || 0), 0);
    const totalPedidos = items.reduce((sum, r) => sum + (r.pedidosOracion || 0), 0);
    const totalDecisiones = items.reduce((sum, r) => sum + (r.decisiones || 0), 0);
    resumen.push([
      mes.toUpperCase(),
      totalObreros,
      totalOradas,
      totalPedidos,
      totalDecisiones,
    ]);
  }
  return resumen;
};

const CrudEvangelismo = () => {
  // Estados para manejar errores, carga, modales, formulario y registros
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(formInicial);
  const [editId, setEditId] = useState(null);
  const [evangelismoActual, setEvangelismoActual] = useState(null);
  const [registros, setRegistros] = useState(null);

  const navigate = useNavigate();

  // Contexto para manejar datos de evangelismo (funciones para Firebase)
  const {
    obtenerEvangelismosFirebase,
    eliminarEvangelismoFirebase,
    obtenerUnevangelismoFirebase,
  } = useEvangelismoContext();

  // Calcula la fecha máxima permitida para el input date (hoy)
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  const fechaMax = `${yyyy}-${mm}-${dd}`;

  // Al montar el componente, obtener registros desde Firebase
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

  // Actualiza el formulario al cambiar inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Cierra modal y resetea formulario y estado de edición
  const handleClose = () => {
    setShow(false);
    setEvangelismoActual(null);
    setForm(formInicial);
    setEditId(null);
  };

  // Carga datos de un registro para editar en el formulario
  const cargarDatos = async () => {
    try {
      const evangelismoSeleccionado = await obtenerUnevangelismoFirebase(
        evangelismoActual.id
      );

      setForm({
        ...evangelismoSeleccionado,
        dia: timestampToDateInputValue(evangelismoSeleccionado.dia),
        lugarEvangelismo: evangelismoSeleccionado.lugarEvangelismo || "",
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

  // Cuando se abre modal y hay registro seleccionado, carga datos para edición
  useEffect(() => {
    if (show && evangelismoActual?.id) {
      cargarDatos();
    }
  }, [show, evangelismoActual]);

  // Abre modal, opcionalmente con datos para editar
  const handleShow = (item = null) => {
    setEvangelismoActual(item);
    setShow(true);
  };

  // Guarda nuevo registro o edición en Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const timestampDia = dateStringToTimestamp(form.dia);

      if (editId) {
        // Edición
        await editarEvangelismo({
          id: editId,
          dia: timestampDia,
          lugarEvangelismo: form.lugarEvangelismo,
          cantObreros: Number(form.cantObreros),
          pedidosOracion: Number(form.pedidosOracion),
          personasOradas: Number(form.personasOradas),
          decisiones: Number(form.decisiones),
          comentarios: form.comentarios,
        });

        dispararSweetAlertBasico("Editado exitosamente", "", "success", "Confirmar");
      } else {
        // Nuevo registro
        await crearEvangelismoEnFirebase(
          timestampDia,
          form.lugarEvangelismo,
          Number(form.cantObreros),
          Number(form.pedidosOracion),
          Number(form.personasOradas),
          Number(form.decisiones),
          form.comentarios,
        );

        dispararSweetAlertBasico("Agregado exitosamente", "", "success", "Confirmar");
      }

      // Actualiza lista y cierra modal
      handleClose();
      const nuevosDatos = await obtenerEvangelismosFirebase();
      setRegistros(nuevosDatos);
      navigate("/admin/crud");
    } catch (error) {
      console.error("Error al guardar:", error);
      dispararSweetAlertBasico("Error", "No se pudo guardar el registro", "error", "Cerrar");
      setError("Error al guardar el registro: " + error.message);
    }
  };

  // Confirmación y eliminación de registro
  const dispararEliminar = async (id) => {
    const confirmar = await dispararSweetAlertTrueFalse(
      "¿Estás seguro que quieres eliminar este usuario?",
      "Esto no se puede deshacer",
      "warning",
      "Sí, Eliminar"
    );

    if (confirmar) {
      eliminarEvangelismoFirebase(id)
        .then(async () => {
          dispararSweetAlertBasico("Eliminado", "Usuario eliminado correctamente.", "success", "OK");
          const nuevosDatos = await obtenerEvangelismosFirebase();
          setRegistros(nuevosDatos);
        })
        .catch((error) => {
          dispararSweetAlertBasico(
            "Hubo un problema al eliminar el usuario",
            error.message,
            "error",
            "Cerrar"
          );
        });
    }
  };

  if (cargando) return <p>Cargando registros...</p>;
  if (error) return <p>{error}</p>;

  // Exporta los registros a PDF agrupados por mes y con resumen
  const exportarPDF = async () => {
    if (!registros || registros.length === 0) {
      dispararSweetAlertBasico("No hay registros para exportar", "", "info", "OK");
      return;
    }

    const doc = new jsPDF();
    const fechaHoraActual = new Date().toLocaleString("es-AR");
    const logoBase64 = await getImageBase64(Logo);

    const logoX = 14;
    const logoY = 14;
    const logoWidth = 28;
    const logoHeight = 28;

    const tituloY = logoY + 10;
    const subtituloY = tituloY + 12;

    // Ordenar registros más recientes primero para el PDF
    const registrosOrdenados = [...registros].sort(
      (a, b) => b.dia.seconds - a.dia.seconds
    );

    // Agrupar registros por mes para el PDF
    const registrosPorMes = agruparPorMes(registrosOrdenados);

    // Construir las secciones de la tabla con encabezados por mes
    const secciones = [];
    for (const [mes, items] of Object.entries(registrosPorMes)) {
      secciones.push([
        {
          content: ` ${mes.toUpperCase()}`,
          colSpan: 7,
          styles: {
            halign: "left",
            fontStyle: "bold",
            fillColor: [220, 220, 220],
          },
        },
      ]);

      items.forEach((item) => {
        const fecha = new Date(item.dia.seconds * 1000);
        const strFecha = fecha.toLocaleDateString("es-AR").replace(/\//g, "/");
        secciones.push([
          strFecha,
          item.lugarEvangelismo,
          item.cantObreros,
          item.personasOradas,
          item.pedidosOracion,
          item.decisiones,
          item.comentarios || "",
        ]);
      });
    }

    // Tabla principal con registros
  autoTable(doc, {
    startY: logoY + logoHeight + 10,
    head: [["Día","Lugar Evangelismo", "Obreros", "Personas Oradas", "Pedidos", "Decisiones", "Comentarios"]],
    body: secciones,
    styles: { 
      fontSize: 10,
      halign: "center"   // <-- centra contenido de todas las celdas
    },
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: 255,
      halign: "center",  // <-- centra encabezados
    },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 35, bottom: 30 },
    didDrawPage: (data) => {
      // Agregar logo en cada página
      doc.addImage(logoBase64, "PNG", logoX, logoY, logoWidth, logoHeight);

      // Título centrado
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text("Reporte de Evangelismos", doc.internal.pageSize.getWidth() / 2, tituloY, {
        align: "center",
      });

      // Subtítulo con fecha de exportación
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `EVANGELISMO  JOVENES+26 - MARTES Y VIERNES 17:30 Y 18:30HS `,
        doc.internal.pageSize.getWidth() / 2,
        subtituloY - 5,
        { align: "center" }
      );
      doc.text(`Exportado el ${fechaHoraActual}`, doc.internal.pageSize.getWidth() / 2, subtituloY, {
        align: "center",
      });

      // Número de página abajo a la derecha
      const pageNumber = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Página ${pageNumber}`,
        doc.internal.pageSize.getWidth() - 20,
        doc.internal.pageSize.getHeight() - 10
      );
    },
  });


    // Tabla resumen mensual con totales
    const resumen = generarResumenMensual(registrosPorMes);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Mes", "Total Obreros", "Total Oradas", "Total Pedidos", "Total Decisiones"]],
      body: resumen,
      styles: { 
        fontSize: 10,
        halign: "center"   // <-- centrado horizontal de todos los datos
      },
      
      headStyles: {
        fillColor: [0, 153, 76],
        textColor: 255,
        halign: "center",  // <-- centrado de encabezado
      },
      alternateRowStyles: { fillColor: [240, 255, 240] },
    });

    doc.save("reporte_evangelismo.pdf");
  };

  // Ordena los registros para mostrarlos en la tabla de la UI, del más reciente al más antiguo
  const registrosOrdenados = registros
    ? [...registros].sort((a, b) => {
        const fechaA = a.dia?.seconds
          ? new Date(a.dia.seconds * 1000)
          : new Date(a.dia);
        const fechaB = b.dia?.seconds
          ? new Date(b.dia.seconds * 1000)
          : new Date(b.dia);
        return fechaB - fechaA;
      })
    : [];

  return (
    <Container className="mt-4">
      <h2> -EVANGELISMOS- </h2>
      <Button className="mb-3" onClick={() => handleShow()}>
        Agregar Registro
      </Button>
      <Button variant="secondary" className="mb-3 ms-2" onClick={exportarPDF}>
        Exportar a PDF
      </Button>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Día</th>
            <th>Lugar Evangelismo</th>
            <th>Cant. Obreros</th>
            <th>P. Oradas</th>
            <th>Pedidos</th>
            <th>Decisiones</th>
            {/* <th>Comentarios</th> */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registrosOrdenados?.map((item) => (
            <tr key={item.id}>
              <td>{timestampToDateInputValue(item.dia).replace(/-/g, "/")}</td>
              <td>{item.lugarEvangelismo}</td>
              <td>{item.cantObreros}</td>
              <td>{item.personasOradas}</td>
              <td>{item.pedidosOracion}</td>
              <td>{item.decisiones}</td>
              {/* <td>{item.comentarios}</td> */}
              <td>
                <Button size="sm" onClick={() => handleShow(item)}>
                  Editar
                </Button>{" "}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => dispararEliminar(item.id)}
                >
                  Eliminar
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate(`/evangelismo/${item.id}/personas`)}
                >
                  Personas
                </Button>
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
                max={fechaMax} // Limita selección a hoy o antes
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Lugar Evangelismo</Form.Label>
              <Form.Control
                type="text"
                name="lugarEvangelismo"
                value={form.lugarEvangelismo}
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
