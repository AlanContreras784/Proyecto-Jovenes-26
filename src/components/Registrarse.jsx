import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useState } from "react";
import { Alert, Button, Card, Container, FloatingLabel, Form } from "react-bootstrap";
import { dispararSweetAlertBasico } from "../assets/SweetAlert";
import { crearUsuarioEnFirebase, crearUsuario } from '../Auth/firebase';

function Registrarse() {
  const [usuario, setUsuario] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [imagen, setImagen] = useState(null);  // ahora es File o null
  const [country, setCountry] = useState('');
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [preview, setPreview] = useState('https://i.postimg.cc/Rh2g9nkn/usuario_Admin.png'); // imagen por defecto

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  async function subirImagenCloudinary(imagenFile) {
  const data = new FormData();
  data.append('file', imagenFile);
  data.append('upload_preset', 'usuarios_react'); // <-- nombre del preset que creaste

  const res = await fetch('https://api.cloudinary.com/v1_1/dtxm4r6ys/image/upload', {
    method: 'POST',
    body: data
  });

  if (!res.ok) throw new Error('Error al subir imagen');

  const fileData = await res.json();
  return fileData.secure_url;
}


  async function registrarUsuario(e) {
  e.preventDefault();
  try {
    const user = await crearUsuario(email, password);

    let urlImagenFinal = preview; // imagen por defecto o la seleccionada

    if (imagen instanceof File) {
  urlImagenFinal = await subirImagenCloudinary(imagen);
}

    // Guardar usando el uid del usuario creado
    await crearUsuarioEnFirebase(user.uid, name, urlImagenFinal, age, email, country);

    login(email);
    dispararSweetAlertBasico("Registro exitoso", "", "success", "Confirmar");
    navigate("/login");
  } catch (error) {
    console.error("Error al registrar:", error.code);
    // manejo de errores igual que antes
    if (error.code === "auth/invalid-credential") {
        dispararSweetAlertBasico("Credenciales incorrectas", "", "error", "Cerrar");
        setError("Credenciales incorrectas");
      } else if (error.code === "auth/weak-password") {
        dispararSweetAlertBasico("Contraseña débil", "Debe tener al menos 6 caracteres", "error", "Cerrar");
        setError("Contraseña débil");
      } else if (error.code === "auth/invalid-email") {
        dispararSweetAlertBasico("Email inválido", "", "error", "Cerrar");
        setError("Email inválido");
      } else if (error.code === "auth/missing-password") {
        dispararSweetAlertBasico("Contraseña inválida", "", "error", "Cerrar");
        setError("Contraseña inválida");
      } else if (error.code === "auth/email-already-in-use") {
        dispararSweetAlertBasico("Correo ya en uso", "", "error", "Cerrar");
        setError("Correo ya en uso");
      } else {
        dispararSweetAlertBasico("Error inesperado", error.message || "", "error", "Cerrar");
        setError(error.message);
      }
  }
}


  return (
    <Container className="mt-5 mb-5 d-flex justify-content-center align-items-center" style={{ maxWidth: 400 }}>
      <Card className='shadow-lg' style={{ width: "24rem" }}>
        <Card.Body>
          <Card.Title className="mb-3 text-center"><h2>Regístrarse</h2></Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Preview Imagen */}
          {preview && (
            <div className="d-flex justify-content-center mb-3">
              <img
                src={preview}
                alt="Preview"
                style={{ maxWidth: "100%", borderRadius: "8px" }}
              />
            </div>
          )}

          <Form onSubmit={registrarUsuario}>
            <Form.Group className="mb-3 text-start">
              <FloatingLabel controlId="floatingInput" label="Imagen:" className="mb-4">
              <Form.Control
              placeholder='Imagen:'
                type="file"
                accept="image/*"
                capture="environment"
                name="foto"
                onChange={handleImagenChange}
              />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3 text-start">
              <FloatingLabel controlId="floatingInput" label="Email:" className="mb-4">
              <Form.Control placeholder="Email:" value={email} type="email" onChange={(e) => setEmail(e.target.value)} required />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3 text-start">
              <FloatingLabel controlId="floatingInput" label="Contraseña:" className="mb-4">
              <Form.Control placeholder='Contraseña:' value={password} type="password" onChange={(e) => setPassword(e.target.value)} required />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3 text-start">
              <FloatingLabel controlId="floatingInput" label="Nombres:" className="mb-4">
              <Form.Control placeholder='Nombres:' value={name} type="text" onChange={(e) => setName(e.target.value)} required />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3 text-start">
              <FloatingLabel controlId="floatingInput" label="Edad:" className="mb-4">
              <Form.Control placeholder='Edad:' value={age} type="number" onChange={(e) => setAge(e.target.value)} />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3 text-start">
              <FloatingLabel controlId="floatingInput" label="País:" className="mb-4">
              <Form.Control placeholder='País:' value={country} type="text" onChange={(e) => setCountry(e.target.value)} />
              </FloatingLabel>
            </Form.Group>
            <Button className='me-4 mb-3 w-100' variant="primary"  type='submit'>Registrarse</Button>
            <span className='color-registro'>¿Ya tienes cuenta?</span><Link className='text-registro' to={'/'}> Inicia Sesión</Link>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Registrarse;
