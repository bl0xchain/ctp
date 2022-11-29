import { Col, Container, Nav, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="bg-dark text-light pt-5 pb-5">
            <Container>
                
                <Row>
                    <Col md="6">
                        <Nav className="">
                            <Nav.Item>
                                <Link to="/" className="nav-link text-light ps-0">Home</Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link to="/about" className="nav-link text-light">About</Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link to="/research" className="nav-link text-light">Research</Link>
                            </Nav.Item> 
                            <Nav.Item>
                                <Link to="/privacy" className="nav-link text-light">Privacy Policy</Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link to="/terms-conditions" className="nav-link text-light">Terms & Conditions</Link>
                            </Nav.Item>                    
                        </Nav>
                    </Col>
                    <Col md="6">
                        <p className="text-end mt-2 mb-0">
                            © {(new Date().getFullYear())} CTP Index. All Rights Reserved.
                        </p>
                    </Col>
                </Row>
                
            </Container>
        </div>
    )
}

export default Footer;