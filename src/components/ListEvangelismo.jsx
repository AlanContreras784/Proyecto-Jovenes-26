import {useEffect, useState } from "react"
import { obtenerRegistrosEvangelismo } from "../Auth/firebase";
import { Container, Table } from "react-bootstrap";

const ListEvangelismo = () => {
  const [evangelismo, setEvangelismo] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando]= useState(true)

{useEffect(() => {
        obtenerRegistrosEvangelismo()
            .then((datos) => {
                console.log(datos)
                setEvangelismo(datos)
                setCargando(false);
            })
            .catch((error) => {
                console.log("Error", error)
                setError('Hubo un problema al cargar los usuarios.');
                setCargando(false);
            });
    }, []);}

  if (cargando) {
      return <p>Cargando productos...</p>;
  }else if (error){
      return <p>{error}</p>;
  }else{
    return(
        <Container className="mt-4">
          <h3>Registro Evangelismo</h3>
          <Table striped bordered hover responsive className="mt-3" >
            <thead >
              <tr>
                <th>Dia</th>
                <th>CantObreros</th>
                <th>P.Oradas</th>
                <th>Pedidos</th>
                <th>Decisiones</th>
                <th>Comentarios</th>
              </tr>
            </thead>
            <tbody>
              {evangelismo.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.dia.seconds * 1000).toLocaleDateString()}</td>
                  <td>{item.cantObreros}</td>
                  <td>{item.pedidosOracion}</td>
                  <td>{item.personasOradas}</td>
                  <td>{item.decisiones}</td>
                  <td>{item.comentarios}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
    )
  }
}

export default ListEvangelismo
