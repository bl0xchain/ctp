import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
    const [logoColor, setLogoColor] = useState("")
    const [show, setShow] = useState(true);

    const getCtpChange = async() => {
        const ctpResponse = await axios.get('api/currencies/ctp-stats/', {params: {duration: 14}});
        if(ctpResponse.data) {
            const ctp24ago = (ctpResponse.data.length > 24) ? ctpResponse.data[ctpResponse.data.length - 25] : ctpResponse.data[0];
            const ctp24now = ctpResponse.data[ctpResponse.data.length - 1];
            const diff10 = ctp24now.CTP10 - ctp24ago.CTP10;
            setLogoColor((diff10 > 0) ? 'text-success' : 'text-danger');
        }
    }

    useEffect(() => {
        getCtpChange();
        const timer = setTimeout(() => {
            setShow(false)
        }, 10000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <header className="mb-0">
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
                                <span className="tip"></span>
                                {/* <Spinner animation="grow" size="sm" variant="warning" /> {" "} */}
                                <span className="text-success">Green</span> indicates up market <FaArrowUp className="text-success" /> <br />
                                <span className="text-danger">Red</span> indicates down market <FaArrowDown className="text-danger" />
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