import { useEffect, useState } from "react";
import { obtenerRegistrosEvangelismo } from "../Auth/firebase";
import { Container, Table } from "react-bootstrap";

const ListEvangelismo = () => {
  const [evangelismo, setEvangelismo] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerRegistrosEvangelismo()
      .then((datos) => {
        console.log(datos);
        setEvangelismo(datos);
        setCargando(false);
      })
      .catch((error) => {
        console.log("Error", error);
        setError("Hubo un problema al cargar los registros.");
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Cargando registros...</p>;
  if (error) return <p>{error}</p>;

  // ✅ Ordenar de más reciente a más antiguo
  const evangelismoOrdenado = [...evangelismo].sort((a, b) => {
    const fechaA = a.dia?.seconds ? new Date(a.dia.seconds * 1000) : new Date(a.dia);
    const fechaB = b.dia?.seconds ? new Date(b.dia.seconds * 1000) : new Date(b.dia);
    return fechaB - fechaA;
  });

  return (
    <Container className="mt-4">
      <h3>Registro de Evangelismo</h3>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Día</th>
            <th>Obreros</th>
            <th>Oradas</th>
            <th>Pedidos</th>
            <th>Decisiones</th>
            <th>Comentarios</th>
          </tr>
        </thead>
        <tbody>
          {evangelismoOrdenado.map((item) => (
            <tr key={item.id}>
              <td>{new Date(item.dia.seconds * 1000).toLocaleDateString("es-AR")}</td>
              <td>{item.cantObreros}</td>
              <td>{item.personasOradas}</td>
              <td>{item.pedidosOracion}</td>
              <td>{item.decisiones}</td>
              <td>{item.comentarios}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListEvangelismo;
