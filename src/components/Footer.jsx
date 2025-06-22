import { Container, Row, Col, Nav, NavDropdown, Image } from "react-bootstrap";
import Logo from "../assets/img/Logo_Jovenes+26.jpeg"
import '../styles/Footer.css'

const Footer = () =>{
    return (
        <footer className="footer py-2 pt-4" >
            <Container fluid>
                <Row className="text-center text-md-start">
                    <Col xs={12} md={3} className="d-flex justify-content-center align-items-center mb-2 mb-md-0">
                        <Image className="img-footer" src={Logo} alt="Logo de Cero Huella" fluid />
                    </Col>

                    <Col xs={12} md={3} className="mb-4 mb-md-0 ">
                        <address>
                            <p className="mb-1 text-center text-md-center text-white">cerohuella@gmail.com</p>
                            <p className="mb-1 text-center text-md-center">11-12345678</p>
                            <p className="mb-0 text-center text-md-center">CABA - Argentina</p>
                        </address>
                    </Col>

                    <Col xs={6} md={3} className="mb-4 mb-md-0">
                        <h5 className="text-center">Contenido</h5>
                        <Nav className="flex-column align-items-center align-items-md-center">
                            <Nav.Link href="#home" className="py-0 text-white">Home</Nav.Link>
                            <Nav.Link href="#link" className="py-0 text-white">Link</Nav.Link>
                            <NavDropdown title="Dropdown" id="nav-dropdown" className="py-0 nav-link" style={{color:' #ffffff'}}>
                                <NavDropdown.Item href="#action/3.1">Acción</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Otra acción</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Algo más</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Enlace separado</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Col>

                    <Col xs={6} md={3}>
                        <h5 className="text-center mb-3">Redes Sociales</h5>
                        <Nav className="d-flex justify-content-center justify-content-md-center gx-1">
                            <Nav.Link href="#insta">
                                <i className="fa-brands fa-instagram fa-lg" style={{color:' #ffffff'}}></i>
                            </Nav.Link>
                            <Nav.Link href="#tiktok">
                                <i className="fa-brands fa-tiktok fa-lg" style={{color:' #ffffff'}}></i>
                            </Nav.Link>
                            <Nav.Link href="#facebook">
                                <i className="fa-brands fa-facebook fa-lg" style={{color:' #ffffff'}}></i>
                            </Nav.Link>
                            <Nav.Link href="#twitter">
                                <i className="fa-brands fa-x-twitter fa-lg" style={{color:' #ffffff'}}></i>
                            </Nav.Link>
                        </Nav>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col className="text-center">
                        <small>&copy; 2025 - Mi Aplicación React</small>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
