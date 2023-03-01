import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import currencyService from "../../features/currency/currencyService";

const DeleteCurrency = ({ show, setShow, loadData, currency }) => {
    const [pending, setPending] = useState(false)
    const { user } = useSelector((state) => state.auth)

    const handleClose = () => {
        setShow(false);
    };

    const handleDeleteCurrency = async(e) => {
        e.preventDefault();
        setPending(true)
        try {
            await currencyService.deleteCurrency(currency._id, user.token)
            toast.success("Currency Deleted", {
                position: toast.POSITION.TOP_CENTER
            })
            handleClose()
            loadData()
        } catch (error) {
            toast.error("Cannot Delete this Currency", {
                position: toast.POSITION.TOP_CENTER
            })
        }
        setPending(false)
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Delete Currency</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    currency &&
                    <h3 className="align-middle">
                        Do you want to delete <br />
                        <img src={currency.image} width="32" alt="currency" style={{marginBottom: '5px'}} /> {" "}
                        { currency.name } ({currency.symbol}) ?
                    </h3>
                }
                <p className="text-danger">This action cannot be reveresed</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="default" onClick={handleClose}>
                    Close
                </Button>
                {
                    pending ?
                    <Button variant="danger" disabled>
                        Deleting Currency {" "} <Spinner size="sm" />
                    </Button> :
                    <Button variant="danger" onClick={handleDeleteCurrency}>
                        Delete Currency
                    </Button>
                }
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteCurrency;
