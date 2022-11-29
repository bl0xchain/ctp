import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="d-flex text-center align-items-center" style={{minHeight: '500px'}} >
            <div className="w-100 h-100">
                <h1 className="fs-1 fw-bold mb-3">404</h1>
                <h2 className="fs-4 mb-5">Page Not Found</h2>
                <Link to="/">
                    <a className="btn btn-dark btn-lg">Back to Home</a>
                </Link>
            </div>
        </div>
    );
}

export default NotFound;