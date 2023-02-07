import { useState } from "react";
import { Button, Collapse, Form, InputGroup, Spinner } from "react-bootstrap";
import ctpServices from "../services/ctp-services";

const Unwrap = ({currentAccount, ctpBalance, getCtpBalance}) => {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [unwrapping, setUnwapping] = useState(false);

    const handleUnwrap = async() => {
        setMessage("");
        setError("");
        if(amount === "") {
            setError("Please enter valid amount");
        }
        if(parseFloat(amount) > parseFloat(ctpBalance)) {
            setError("Unwrap amount should be less than CTP Balance");
        }
        setUnwapping(true);
        const response = await ctpServices.unwrap(currentAccount, amount);
        if(response.code === 200) {
            setMessage("Unwrap successful.");
            setAmount("");
            setError("");
            getCtpBalance();
        } else {
            setError("Problem with unwrapping CTP10.");
            setMessage("");
        }
        setUnwapping(false);
    }

    return (
        <div className="" style={{margin: '0 auto', maxWidth: '300px'}}>
            <Collapse in={open}>
                <div id="example-collapse-text">
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="CTP Amount"
                            aria-label="CTP Amount"
                            aria-describedby="ctp-amount-input"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        {
                            unwrapping ?
                            <Button variant="outline-primary" id="ctp-amount-input" disabled>
                                Unwraping {" "} <Spinner size="sm" animation="border" />
                            </Button> :
                            <Button variant="outline-primary" id="ctp-amount-input" onClick={handleUnwrap}>
                                Unwrap
                            </Button>
                        }
                    </InputGroup>
                    <p className="text-success">{message}</p>
                    <p className="text-danger">{error}</p>
                </div>
            </Collapse>
            <Button
                onClick={() => setOpen(!open)}
                aria-controls="example-collapse-text"
                aria-expanded={open}
                size="sm"
                variant="outline-primary"
            >
                {
                    open ?
                    'Cancel Unwrap' :
                    'Unwrap'
                }
            </Button>
        </div>
    )
}

export default Unwrap;