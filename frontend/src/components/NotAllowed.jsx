import { Link } from "react-router-dom";

const NotAllowed = () => {
    return (
        <div className="d-flex text-center align-items-center" style={{minHeight: '500px'}} >
            <div className="w-100 h-100">
                <h1 className="fs-1 fw-bold mb-3">401</h1>
                <h2 className="fs-4 mb-5">You are not allowed to access this page</h2>
                <Link to="/" className="btn btn-dark btn-lg">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default NotAllowed;