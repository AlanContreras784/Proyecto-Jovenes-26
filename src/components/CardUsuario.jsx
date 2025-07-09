import { Card, Button } from "react-bootstrap";

function CardUsuario({ usuario, onEditar, onEliminar }) {
  return (
    <Card className="mb-3 shadow-sm" style={{ maxWidth: "24rem" }}>
      <Card.Img
        variant="top"
        src={usuario.imagen || "https://i.postimg.cc/Rh2g9nkn/usuario_Admin.png"}
        alt={usuario.name}
      />
      <Card.Body>
        <Card.Title>{usuario.name}</Card.Title>
        <Card.Text>
          <strong>Email:</strong> {usuario.email} <br />
          <strong>Edad:</strong> {usuario.age} <br />
          <strong>País:</strong> {usuario.country}
        </Card.Text>
        <div className="d-flex justify-content-between">
          <Button variant="outline-primary" onClick={() => onEditar(usuario)}>Editar</Button>
          <Button variant="outline-danger" onClick={() => onEliminar(usuario.id)}>Eliminar</Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardUsuario;
