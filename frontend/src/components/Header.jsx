import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="container mb-4">
            <nav className="navbar navbar-expand-lg">
                <Link to="/" className="navbar-brand">
                    <img src="/logo.png" height={60} alt="CTP Index Logo"/>
                </Link>
            </nav>
        </header>
    )
}

export default Header;