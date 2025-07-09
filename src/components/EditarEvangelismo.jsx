import React from 'react'
import { Container } from 'react-bootstrap'

const EditarEvangelismo = () => {

  const {admin}= useAuthContext();
  const {evangelismoSeleccionado, obtenerUnevangelismoFirebase, editarevangelismoFirebase} = useevangelismosContext();
  const { id } = useParams();
  //const [evangelismo, setevangelismo] = useState({id:'',email: '', name: '',imagen: '',age: '',country: ''});
  const [evangelismo, setevangelismo] = useState(evangelismoSeleccionado);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

  if(!admin){
    return(
        <Navigate to='/login' replace />
    )
      
  }

  useEffect(() => {
    obtenerUnevangelismoFirebase(id).then((evangelismoSeleccionado) => {
      setevangelismo({ id, ...evangelismoSeleccionado });
      setCargando(false);
    }).catch((error) => {
        setError('Hubo un problema al cargar los evangelismos.');
        setCargando(false);
    });
  }, [id]);

  const emailEsValido = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarFormulario = () => {

  
    if (!evangelismo.name.trim()) {
    return("El nombre es obligatorio.")
    }
    if(!emailEsValido(evangelismo.email)){
    return("El formato del Email  es incorrecto. ejemplo@correo.com")
    }
    if(!evangelismo.imagen){
    return("La url de la imagen no debe estar vacía")
    }
    if (!evangelismo.age || evangelismo.age <= 18) {
    return("La edad debe ser mayor a 18.")
    }
    if (!evangelismo.country.trim() ) {
    return("el país es obligatorio")
    }
    else{
    return true
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setevangelismo({ ...evangelismo, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validarForm = validarFormulario()
      if (validarForm == true) {
      editarevangelismoFirebase(evangelismo).then((evangelismo) => {
        dispararSweetAlertBasico("OK", 'evangelismo actualizado correctamente.', "success", "Cerrar");
        navigate("/admin/evangelismos/"+id);
      }).catch((error) => {
          dispararSweetAlertBasico("Hubo un problema al agregar el evangelismo", error.message, "error", "Cerrar")
      })
      } else{
          dispararSweetAlertBasico("Error en la carga de evangelismo", validarForm, "error", "Cerrar")
          setError(validarForm);
      }
  };

  return (
    <Container>
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
                value={form.comentarios}
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
  )
}

export default EditarEvangelismo
