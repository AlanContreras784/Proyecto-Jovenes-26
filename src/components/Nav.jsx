import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/img/Logo_Jovenes+26.jpeg"
import { Button, Container,Nav, Navbar, NavbarBrand, NavbarOffcanvas, NavbarToggle, NavLink, OffcanvasBody, OffcanvasHeader, OffcanvasTitle } from 'react-bootstrap'
import '../styles/Navegacion.css'
import { useAuthContext } from "../contexts/AuthContext";



const Navegacion = () => {

    const {admin,logout,user} = useAuthContext();
    const navigate= useNavigate();

    function obtenerUsername(token){
        const email = token.replace('fake-token-', '');
        return email.split('@')[0];
    }

    function handleNavigateLogin(){
        navigate('/login');
    }

    function handleLogout(){
        logout();
    }
    return (
        <Navbar collapseOnSelect expand='lg' className="fs-6 py-0" variant="ligth">
            <Container className="mt-1 mb-1" fluid>
                <NavbarBrand  href="#home"><img className="logo  me-auto" src={Logo} alt="" /></NavbarBrand>
                <h1 className="px-1 fs-5">JOVENES + 26</h1>
                <NavbarToggle aria-controls={`offcanvasNavbar-expand-lg`} />
                <NavbarOffcanvas
                id={`offcanvasNavbar-expand-lg`}
                aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
                placement="end"
                backdrop='static'
                className='ps-0 bg-OffCanvas'
                >
                    <OffcanvasHeader  closeButton>
                        <OffcanvasTitle id={`offcanvasNavbarLabel-expand-lg`} href="#home">
                        <img className="w-25 h-25 me-auto" src={Logo} alt="" />
                        </OffcanvasTitle>
                    </OffcanvasHeader>
                    <OffcanvasBody>
                        <Nav className="justify-content-end  flex-grow-1 pe-3">
                        {user? <Nav.Link href="#"  as={Link} to={'/listaEvangelismo'}>Registros</Nav.Link>: <></>}
                        { admin? <Nav.Link href="#" as={Link} to={'/admin/crud'} className=' nav-link'>Registrar Evangelismo</Nav.Link> : <></>}
                        { admin? <Nav.Link href="#" as={Link} to={'/admin/usuarios'} className=' nav-link'>Usuarios</Nav.Link> : <></>}
                        <Nav.Link href="#"  as={Link} to={'/personasfechas'}>Personas</Nav.Link>
                        <Nav.Link href="#" as={Link} to={'/'} className='mx-0 ms-0 nav-link'><Button size="sm" variant="outline-light" className="border-0 " onClick={ !user ? handleNavigateLogin : handleLogout}>{ !user ? <i className="fa-solid fa-user fa-xl" style={{color:"#000000"}}></i> : <span size="sm" variant="outline-light" className="border-boton p-1" style={{color:"#000000"}}><i className="fa-solid fa-user"></i> : {obtenerUsername(user)}</span>}</Button></Nav.Link>
                        </Nav>
                    </OffcanvasBody>
                </NavbarOffcanvas>
            </Container>
        </Navbar>
    )
}

export default Navegacion;
