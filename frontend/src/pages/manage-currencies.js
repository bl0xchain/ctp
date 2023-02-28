import { useEffect, useState } from "react"
import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap"
import Header from "../components/Header"
import currencyService from "../features/currency/currencyService"
import { useSelector } from "react-redux"
import Login from "../components/Login"
import NotAllowed from "../components/NotAllowed"
import AddCurrency from "../components/currency/AddCurrency"

const ManageCurrencies = () => {
    const [data, setData] = useState(null)
    const [filteredData, setFilteredData] = useState(null)
    const [filter, setFilter] = useState({
        name: "",
        group: ""
    })
    const [addShow, setAddShow] = useState(false)

    const { user } = useSelector((state) => state.auth)

    const handleChange = (e) => {
        setFilter((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const loadCurrencies = async () => {
        const currencies = await currencyService.getCurrencies()
        setData(currencies)
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
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                filteredData.map((currency) => (
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
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                    <AddCurrency show={addShow} setShow={setAddShow} loadData={loadCurrencies} />
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