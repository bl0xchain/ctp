import axios from "axios";
import { useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import currencyService from "../../features/currency/currencyService";

const AddCurrency = ({ show, setShow, loadData }) => {
    const initialData = {
        coingecko_id: '',
        name: '',
        symbol: '',
        image: '',
        category: '',
        total_supply: '',
        ff_assumption: '',
        ctp_group: ''
    }
    const [formData, setFormData] = useState(initialData)
    const [pending, setPending] = useState(false)

    const { user } = useSelector((state) => state.auth)

    const handleDataChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const handleClose = () => {
        setShow(false);
    };

    const handleAddCurrency = async(e) => {
        e.preventDefault();
        if(formData.coingecko_id === "" || formData.name === "" || formData.symbol === "" || formData.image === "" || formData.category === "" || formData.total_supply === "" || formData.ff_assumption === "" || formData.ctp_group === "") {
            toast.error("All fields are compulsory", {
                position: toast.POSITION.TOP_CENTER
            })
            return false
        }
        setPending(true)
        try {
            await currencyService.createCurrency(formData, user.token)
            toast.success("New Currency Added", {
                position: toast.POSITION.TOP_CENTER
            })
            handleClose()
            setFormData(initialData)
            loadData()
        } catch (error) {
            toast.error("Cannot Add this Currecy", {
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
                <Modal.Title>Add Currency</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="fs-6">
                    <Form.Group as={Row} className="mb-3 align-items-center" controlId="coingecko-id">
                        <Form.Label column sm={4}>
                            Coingecko Id
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control type="text" name="coingecko_id" value={formData.coingecko_id} onChange={handleDataChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 align-items-center" controlId="name">
                        <Form.Label column sm={4}>
                            Name
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control type="text" name="name" value={formData.name} onChange={handleDataChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 align-items-center" controlId="symbol">
                        <Form.Label column sm={4}>
                            Symbol
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control type="text" name="symbol" value={formData.symbol} onChange={handleDataChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 align-items-center" controlId="image">
                        <Form.Label column sm={4}>
                            Image
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control type="url" name="image" value={formData.image} onChange={handleDataChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 align-items-center">
                        <Form.Label as="legend" column sm={4}>
                            Category
                        </Form.Label>
                        <Col sm={8} onChange={handleDataChange}>
                            <Form.Check type="radio" label="C" name="category" id="category-c" value="C" inline />
                            <Form.Check type="radio" label="T" name="category" id="category-t" value="T" inline />
                            <Form.Check type="radio" label="P" name="category" id="category-p" value="P" inline />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 align-items-center" controlId="total-supply">
                        <Form.Label column sm={4}>
                            Total Supply
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control type="number" name="total_supply" value={formData.total_supply} onChange={handleDataChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 align-items-center" controlId="ff-assumption">
                        <Form.Label column sm={4}>
                            FF Assumption
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control type="number" name="ff_assumption" value={formData.ff_assumption} onChange={handleDataChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 align-items-center">
                        <Form.Label as="legend" column sm={4}>
                            CTP Group
                        </Form.Label>
                        <Col sm={8} onChange={handleDataChange}>
                            <Form.Check type="radio" label="CTP10" name="ctp_group" id="category-ctp10" value="CTP10" inline />
                            <Form.Check type="radio" label="CTP50" name="ctp_group" id="category-ctp50" value="CTP50" inline />
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="default" onClick={handleClose}>
                    Close
                </Button>
                {
                    pending ?
                    <Button variant="primary" disabled>
                        Adding Currency {" "} <Spinner size="sm" />
                    </Button> :
                    <Button variant="primary" onClick={handleAddCurrency}>
                        Add Currency
                    </Button>
                }
            </Modal.Footer>
        </Modal>
    );
};

export default AddCurrency;
