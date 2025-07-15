import { Container, Row, Col, Nav, NavDropdown, Image } from "react-bootstrap";
import Logo from "../assets/img/Logo_Jovenes+26.jpeg"
import '../styles/Footer.css'
import { Link } from "react-router-dom";

const Footer = () =>{
    return (
        <footer className="footer py-2 pt-4" >
            <Container fluid>
                <Row className="text-center text-md-start">
                    <Col xs={12} md={4} className="d-flex justify-content-center align-items-center mb-2 mb-md-0">
                        <Link to={'/listaEvangelismo'}><Image className="img-footer" src={Logo} alt="Logo de Cero Huella" fluid />
                        </Link> 
                    </Col>

                    <Col xs={12} md={4} className="mb-4 mb-md-0 ">
                        <address>
                            <p className="mb-1 text-center text-md-center text-white">cerohuella@gmail.com</p>
                            <p className="mb-1 text-center text-md-center">11-12345678</p>
                            <p className="mb-0 text-center text-md-center">CABA - Argentina</p>
                        </address>
                    </Col>

                    

                    <Col xs={6} md={4}>
                        <h5 className="text-center mb-3">Redes Sociales</h5>
                        <Nav className="d-flex justify-content-center justify-content-md-center gx-1">
                            <Nav.Link href="https://www.instagram.com/ccnviglesia/">
                                <i className="fa-brands fa-instagram fa-lg" style={{color:' #ffffff'}}></i>
                            </Nav.Link>
                            <Nav.Link href="https://www.tiktok.com/@ccnviglesia">
                                <i className="fa-brands fa-tiktok fa-lg" style={{color:' #ffffff'}}></i>
                            </Nav.Link>
                            <Nav.Link href="https://www.facebook.com/CCNViglesia/?locale=es_LA">
                                <i className="fa-brands fa-facebook fa-lg" style={{color:' #ffffff'}}></i>
                            </Nav.Link>
                            <Nav.Link href="https://x.com/ccnviglesia">
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
