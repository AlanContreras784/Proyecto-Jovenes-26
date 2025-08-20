import  { useState } from 'react';
import {  Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { loginEmailPass } from '../Auth/firebase';
import { Button,Form, Container, Card, Alert, FloatingLabel } from 'react-bootstrap';
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
        navigate('/listaEvangelismo');
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
            <Form.Group controlId='email' className=" input-group mb-3 text-start">
              <FloatingLabel controlId="floatingInput" label="Email:" className="mb-4">
              <Form.Control placeholder='Email:' className='input' value={usuario} type="text" onChange={(e) => setUsuario(e.target.value)} />              
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3 text-start">
              <FloatingLabel controlId="floatingInput" label="Contraseña:" className="mb-4">
              <Form.Control placeholder='Contraseña:' value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
              </FloatingLabel>
            </Form.Group>
            <Button className='me-4 mb-3 w-100' variant="primary"  type='submit'>Entrar</Button>
            <span className='color-registro'>¿No tienes cuenta?</span><Link className='text-registro' to={'/registrarse'}> Registrate</Link>
          </Form>
          </Card.Body>
        </Card>
    </Container>
  );
}
export default Login;