import  { useState } from 'react';
import {  Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { loginEmailPass } from '../Auth/firebase';
import { Button,Form, Container, Card, Alert } from 'react-bootstrap';
import { dispararSweetAlertBasico } from "../assets/SweetAlert";

function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [error, setError] = useState();


  function iniciarLoginEmailPass(e){
      e.preventDefault();
      loginEmailPass(usuario,password).then((user)=>{
        login(usuario);
        navigate('/');
        setError('');
      }).catch((error)=>{
            if(error.code == "auth/invalid-credential"){
                  dispararSweetAlertBasico("Credenciales incorrectas", "", "error", "Cerrar")
                  setError("Credenciales incorrectas")
            }if(error.code == "auth/weak-password"){
                  dispararSweetAlertBasico("Contraseña debil", "La contraseña debe tener al menos 6 caracteres", "error", "Cerrar")
                  setError("La contraseña debe tener al menos 6 caracteres")
            }if(error.code == "auth/missing-password"){
                  dispararSweetAlertBasico("Contraseña Faltante", "", "error", "Cerrar")
                  setError("Contraseña Faltante")
            }if(error.code == "auth/invalid-email"){
                  dispararSweetAlertBasico("Error", "Email invalido", "error", "Cerrar")
                  setError('Formato de email invalido. "ejemplo@mail.com" ')
            }
      }
    )
  }



  return (

    <Container className="mt-5 mb-5 d-flex justify-content-center align-items-center" style={{ maxWidth: 400 }}>
      <Card className='shadow-lg' style={{ width: "24rem" }}>
          <Card.Body>
          <Card.Title className="mb-3 text-center"><h2>Iniciar sesión</h2></Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={iniciarLoginEmailPass}>
            <Form.Group className="mb-3 text-start">
              <Form.Label >Email:</Form.Label>
              <Form.Control value={usuario} type="text" onChange={(e) => setUsuario(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3 text-start">
              <Form.Label>Contraseña:</Form.Label>
              <Form.Control value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button className='me-4 mb-3' variant="primary"  type='submit'>Entrar</Button>
            <Link to={'/registrarse'}><Button className='mb-3' variant='outline-primary'>Registrarse</Button></Link>
          </Form>
          </Card.Body>
        </Card>
    </Container>
  );
}
export default Login;