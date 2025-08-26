import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { obtenerEvangelismosConFecha } from "../Auth/firebase";

const ListaEvangelismoPorFecha = () => {
  const [evangelismos, setEvangelismos] = useState([]);

  useEffect(() => {
    obtenerEvangelismosConFecha().then(setEvangelismos);
  }, []);

  const formatoFecha = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("es-AR", { year: 'numeric', month: 'long', day: 'numeric' });
  };

   // ✅ Ordenar de más reciente a más antiguo
  const evangelismoOrdenado = [...evangelismos].sort((a, b) => {
    const fechaA = a.dia?.seconds ? new Date(a.dia.seconds * 1000) : new Date(a.dia);
    const fechaB = b.dia?.seconds ? new Date(b.dia.seconds * 1000) : new Date(b.dia);
    return fechaB - fechaA;
  });

  return (
    <Container className="mt-4">
      <h3>Evangelismos por Día</h3>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Ver Personas</th>
          </tr>
        </thead>
        <tbody>
          {evangelismoOrdenado.map(e => (
            <tr key={e.id}>
              <td>{formatoFecha(e.dia)}</td>
              <td>
                <Button as={Link} to={`/evangelismo/${e.id}/personas`} size="sm">
                  Ver Personas
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListaEvangelismoPorFecha;