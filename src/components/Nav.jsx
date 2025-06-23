import { Link } from "react-router-dom";
import Logo from "../assets/img/Logo_Jovenes+26.jpeg"
import { Button, Container,Nav, Navbar, NavbarBrand, NavbarOffcanvas, NavbarToggle, NavLink, OffcanvasBody, OffcanvasHeader, OffcanvasTitle } from 'react-bootstrap'
import '../styles/Navegacion.css'


const Navegacion = () => {
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
                        <Nav.Link href="#" >Home</Nav.Link>
                        <Nav.Link href="#" className='nav-link me-auto'>Nosotros</Nav.Link>
                        <NavLink href="#" className='nav-link'>Usuarios</NavLink>
                        <Nav.Link href="#" className='me-auto nav-link'>Agregar Productos</Nav.Link>
                        <Nav.Link href="#" as={Link} to={'/'} className='mx-o nav-link'><Button size="sm" variant="outline-light" className="border-0 " ><i className="fa-solid fa-user fa-xl" style={{color:"#ffffff"}}></i> </Button></Nav.Link>
                        {/*<i className="fa-solid fa-user" style={{color:"#ffffff"}}></i>*/}
                        </Nav>
                    </OffcanvasBody>
                </NavbarOffcanvas>
            </Container>
        </Navbar>
    )
}

export default Navegacion;
