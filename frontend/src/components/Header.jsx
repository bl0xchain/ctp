import { useEffect, useState } from "react";
import { Container, Nav, Navbar, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = ({ logoColor }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false)
        }, 10000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <header className="mb-4">
            <Navbar variant="light" className="ff-satoshi">
                <Container>
                    <Link to="/" className="navbar-brand">
                        {/* <img src="/logo.png" height={40} alt="CTP Index Logo"/> */}
                        <h2 className={logoColor+" ff-satoshi-black"}>
                            CTP
                            <span className="ff-sf-pro">Index</span>
                        </h2>
                        {
                            show &&
                            <div className="logo-notification">
                                <Spinner animation="grow" size="sm" variant="warning" /> {" "}
                                Red indicates down market and Green indicates up market
                            </div>
                        }
                    </Link>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll" className="justify-content-end fs-5">
                        <Nav className="d-flex">
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/about" className="nav-link">About</Link>
                            <Link to="/research" className="nav-link">Research</Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header;