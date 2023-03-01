import { useEffect, useState } from "react"
import { Alert, Button, Col, Container, Form, Row, Table } from "react-bootstrap"
import Header from "../components/Header"
import currencyService from "../features/currency/currencyService"
import { useSelector } from "react-redux"
import Login from "../components/Login"
import NotAllowed from "../components/NotAllowed"
import AddCurrency from "../components/currency/AddCurrency"
import { FaEdit, FaTrashAlt } from "react-icons/fa"
import EditCurrency from "../components/currency/EditCurrency"
import DeleteCurrency from "../components/currency/DeleteCurrency"

const ManageCurrencies = () => {
    const [data, setData] = useState(null)
    const [filteredData, setFilteredData] = useState(null)
    const [filter, setFilter] = useState({
        name: "",
        group: ""
    })
    const [addShow, setAddShow] = useState(false)
    const [editShow, setEditShow] = useState(false)
    const [deleteShow, setDeleteShow] = useState(false)
    const [activeCurrency, setActiveCurrency] = useState(null)
    const [ctp10Count, setCtp10Count] = useState(11)
    const [ctp50Count, setCtp50Count] = useState(40)

    const { user } = useSelector((state) => state.auth)

    const handleChange = (e) => {
        setFilter((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const handleEdit = (index) => {
        setActiveCurrency(filteredData[index])
        setEditShow(true)
    }

    const handleDelete = (index) => {
        setActiveCurrency(filteredData[index])
        setDeleteShow(true)
    }

    const loadCurrencies = async () => {
        setActiveCurrency(null)
        setAddShow(false)
        setEditShow(false)
        setDeleteShow(false)
        const currencies = await currencyService.getCurrencies()
        setData(currencies)
        let ctp10 = 0;
        let ctp50 = 0;
        currencies.forEach((currency) => {
            if(currency.ctp_group === 'CTP10') {
                ctp10++;
                // ctp50++;
            } else if(currency.ctp_group === 'CTP50') {
                ctp50++;
            }
        })
        setCtp10Count(ctp10)
        setCtp50Count(ctp50)
    }

    useEffect(() => {
        loadCurrencies()
    }, [])

    useEffect(() => {
        if(data) {
            let currencies = data.filter((item) => item.name.toLowerCase().includes(filter.name.toLowerCase()))
            if(filter.group !== "") {
                currencies = currencies.filter((item) => item.ctp_group === filter.group)
            }
            setFilteredData(currencies)
        }
    }, [filter, data])

    return (
        <>
            <Header />
            <Container className="py-5" style={{ minHeight: "calc(100vh - 221px)" }}>
                <h2 className="mb-4">Manage Currencies</h2>
                {
                    ctp10Count !== 10 &&
                    <Alert variant='danger'>
                        There should be 10 currencies belongs to group CTP10. But currently there are {ctp10Count} currencies in CTP10!
                    </Alert>
                }
                {
                    ctp50Count !== 40 &&
                    <Alert variant='danger'>
                        There should be 40 currencies belongs to group CTP50. But currently there are {ctp50Count} currencies in CTP50!
                    </Alert>
                }
                {
                    !user ?
                    <Login /> :
                    <>
                        {
                            user.isAdmin ? 
                            <>
                                {filteredData && <>
                                    <Row className="justify-content-between">
                                        <Col>
                                            <Form>
                                                <Row className="align-items-center mb-4">
                                                    <Col xs="auto">Filters: </Col>
                                                    <Col xs="auto">
                                                        <Form.Label htmlFor="filter-currency-name" visuallyHidden>
                                                            Currency Name
                                                        </Form.Label>
                                                        <Form.Control
                                                            id="filter-currency-name"
                                                            placeholder="Currency Name"
                                                            name="name"
                                                            onChange={handleChange}
                                                            value={filter.name}
                                                        />
                                                    </Col>
                                                    <Col xs="auto">
                                                        <Form.Label htmlFor="filter-ctp-group" visuallyHidden>
                                                            CTP Group
                                                        </Form.Label>
                                                        <Form.Select aria-label="CTP Group" id="filter-ctp-group" name="group" onChange={handleChange} value={filter.group}>
                                                            <option value="">Select CTP Group</option>
                                                            <option value="CTP10">CTP10</option>
                                                            <option value="CTP50">CTP50</option>
                                                        </Form.Select>
                                                    </Col>
                                                </Row>  
                                            </Form>
                                        </Col>
                                        <Col>
                                            <Button variant="outline-primary" className="float-end" onClick={() => setAddShow(true)}>Add New Currency</Button>
                                        </Col>
                                    </Row>
                                    <Table bordered >
                                        <thead>
                                            <tr>
                                                <th>coingecko_id</th>
                                                <th>name</th>
                                                <th>symbol</th>
                                                <th>image</th>
                                                <th>category</th>
                                                <th>total_supply</th>
                                                <th>ff_assumption</th>
                                                <th>ctp_group</th>
                                                <th>actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                filteredData.map((currency, index) => (
                                                    <tr key={currency._id}>
                                                        <td>{currency.coingecko_id}</td>
                                                        <td>{currency.name}</td>
                                                        <td>{currency.symbol}</td>
                                                        <td>
                                                            <img src={currency.image} alt="icon" width={24} />
                                                        </td>
                                                        <td>{currency.category}</td>
                                                        <td>{currency.total_supply}</td>
                                                        <td>{currency.ff_assumption}</td>
                                                        <td>{currency.ctp_group}</td>
                                                        <td>
                                                            <FaEdit className="currency-action" onClick={() => handleEdit(index)} /> {" "}
                                                            <FaTrashAlt className="currency-action" onClick={() =>handleDelete(index)} />
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                    <AddCurrency show={addShow} setShow={setAddShow} loadData={loadCurrencies} />
                                    <EditCurrency show={editShow} setShow={setEditShow} loadData={loadCurrencies} currency={activeCurrency} />
                                    <DeleteCurrency show={deleteShow} setShow={setDeleteShow} loadData={loadCurrencies} currency={activeCurrency} />
                                </>} 
                            </> :
                            <NotAllowed />
                        }
                    </>
                }
            </Container>
        </>
    )
}

export default ManageCurrencies