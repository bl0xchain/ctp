import { useState, useEffect } from "react";
import { Container, Form, Row, Col, Table, ButtonToolbar, ButtonGroup, Button, Spinner } from "react-bootstrap";
import axios from 'axios';
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import format from 'number-format.js'

const Home = () => {
    const [ctpGroup, setCtpGroup] = useState('CTP10')
    const [batch, setBatch] = useState(null)
    const [currencyStats, setCurrencyStats] = useState([])
    const [ctpStats, setCtpStats] = useState([])
    const [duration, setDuration] = useState(14)
    const [loading, setLoading] = useState(false)
    const [ctpStatsLoading, setCtpStatsLoading] = useState(false)

    const formatPrice = (price) => {
        return format( "$#,###.##", price );
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString()
    }

    const formatTooltip = (value, name, props) => {
        return formatPrice(value)
    }

    const formatTooltipLabel = (label) => {
        return new Date(label).toLocaleString()
    }

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            const response = await axios.get('api/currencies/stats/'+ctpGroup)
            if(response.data) {
                setBatch(response.data.batch)
                setCurrencyStats(response.data.currencies)
            }
            setLoading(false)
        }
        fetchStats()
    }, [ctpGroup])

    useEffect(() => {
        const fetchStats = async () => {
            setCtpStatsLoading(true)
            const ctpResponse = await axios.get('api/currencies/ctp-stats/', {params: {duration: duration}})
            if(ctpResponse.data) {
                setCtpStats(ctpResponse.data)
            }
            setCtpStatsLoading(false)
        }
        fetchStats()
    }, [duration])

    return (
        <Container>
            <div className="text-center">
                <Form className="ctp-group mb-5 fw-bold fs-4">
                    <Form.Check 
                        inline
                        label="CTP10"
                        name="ctp_group"
                        type="radio"
                        id="ctp-group-10"
                        onChange={(e) => setCtpGroup('CTP10')}
                        checked={ctpGroup === 'CTP10' ? 'checked': ''}
                        style={{marginRight: '35px'}}
                    />
                    <Form.Check 
                        inline
                        label="CTP50"
                        value="CTP50"
                        name="ctp_group"
                        type="radio"
                        id="ctp-group-50"
                        onChange={(e) => setCtpGroup('CTP50')}
                        checked={ctpGroup === 'CTP50' ? 'checked': ''}
                    />
                </Form>
                {
                    loading ? 
                    <div>Loading data</div> :
                    <>
                        {
                            batch ? 
                            <Row className="mb-5">
                                <Col sm="4">
                                    <h2>PRICE</h2>
                                    <h3>
                                        <NumberFormat 
                                            value={ctpGroup === 'CTP10' ? batch.total_price_10 : batch.total_price_50} 
                                            displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                            decimalScale="2" decimalSeparator="." />
                                    </h3>
                                </Col>
                                <Col sm="4">
                                    <h2>CTP Value</h2>
                                    <h3>
                                        <NumberFormat 
                                            value={ctpGroup === 'CTP10' ? batch.ctp_value_10 : batch.ctp_value_50} 
                                            displayType={'text'} thousandSeparator={true} prefix={''} 
                                            decimalScale="2" decimalSeparator="." />
                                    </h3>
                                </Col>
                                <Col sm="4">
                                    <h2>VOLUME</h2>
                                    <h3>
                                        <NumberFormat 
                                            value={ctpGroup === 'CTP10' ? batch.total_volume_10 : batch.total_volume_50} 
                                            displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                            decimalScale="2" decimalSeparator="." />
                                    </h3>
                                </Col>
                                <Col sm="12" className="mb-5 ctp-graph-container">
                                    <ButtonToolbar aria-label="Duration Selection" className="mb-2 mt-5">
                                        <ButtonGroup aria-label="Basic example" className="text-end">
                                            <Button variant={duration === 1 ? "secondary" : "light"} onClick={()=>setDuration(1)}>24h</Button>
                                            <Button variant={duration === 7 ? "secondary" : "light"}  onClick={()=>setDuration(7)}>7d</Button>
                                            <Button variant={duration === 14 ? "secondary" : "light"}  onClick={()=>setDuration(14)}>14d</Button>
                                            <Button variant={duration === 30 ? "secondary" : "light"}  onClick={()=>setDuration(30)}>30d</Button>
                                            <Button variant={duration === 90 ? "secondary" : "light"}  onClick={()=>setDuration(90)}>90d</Button>
                                            <Button variant={duration === 180 ? "secondary" : "light"}  onClick={()=>setDuration(180)}>180d</Button>
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            width={1200}
                                            height={800}
                                            data={ctpStats}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                            >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis tickFormatter={formatDate} dataKey="created" />
                                            <YAxis tickFormatter={formatPrice} label={{ value: 'Price in $', angle: -90, position: 'insideLeft' }} />
                                            <Tooltip formatter={formatTooltip} labelFormatter={formatTooltipLabel} />
                                            <Legend />
                                            <Line type="linear" dot={false} dataKey="ctp_value_10" stroke="#82ca9d" />
                                            <Line type="linear" dot={false} dataKey="bitcoin" stroke="#8884d8" />
                                            <Line type="linear" dot={false} dataKey="ethereum" stroke="#ffc658" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                    {
                                        ctpStatsLoading &&
                                        <div className="loading-container">
                                            <Spinner animation="grow" variant="primary" /> {" "}
                                            <Spinner animation="grow" variant="primary" /> {" "}
                                            <Spinner animation="grow" variant="primary" /> {" "}
                                        </div>
                                    }
                                    
                                </Col>
                                <Col sm="12" style={{height: '30px'}}></Col>
                            </Row> :
                            <div>No data</div>
                        }
                        {
                            currencyStats &&
                            <div className="mb-5">
                                <Table responsive striped className="ctp-stats-table">
                                    <thead>
                                        <tr>
                                            <th width="62"></th>
                                            <th></th>
                                            <th>Currency</th>
                                            <th>Market Cap</th>
                                            <th>Price</th>
                                            <th>Free Float</th>
                                            <th>Volume</th>
                                            <th>Price Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        currencyStats.map(currency => (
                                            <tr key={currency._id}>
                                                <td>
                                                    <img alt="logo" className="currency-logo" src={currency.currency.image} width="25"/>
                                                </td>
                                                <td>
                                                    <span className="currency-type-tag">{currency.currency.category}</span>
                                                </td>
                                                <td>
                                                    <Link to={"/currency/"+currency.currency._id}>
                                                        {currency.currency.name} <br/>
                                                        <small className="text-muted text-uppercase">{currency.currency.symbol}</small>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <NumberFormat value={currency.market_cap} displayType={'text'}
                                                        thousandSeparator={true} prefix={'$'} decimalScale="2"
                                                        decimalSeparator="."/>
                                                </td>
                                                <td>
                                                    <NumberFormat value={currency.price} displayType={'text'}
                                                        thousandSeparator={true} prefix={'$'} decimalScale="2"
                                                        decimalSeparator="."/>
                                                </td>
                                                <td>
                                                    <NumberFormat value={currency.free_float} displayType={'text'}
                                                        thousandSeparator={true} decimalScale="2"
                                                        decimalSeparator="."/>
                                                </td>
                                                <td>
                                                    <NumberFormat value={currency.volume} displayType={'text'}
                                                        thousandSeparator={true} prefix={'$'} decimalScale="2"
                                                        decimalSeparator="."/>
                                                </td>
                                                <td>
                                                    <NumberFormat
                                                        className={currency.price_change_percentage_24h > 0 ? 'text-success' : 'text-danger'}
                                                        value={currency.price_change_percentage_24h} displayType={'text'}
                                                        decimalScale="2" decimalSeparator="." suffix={'%'}/>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </Table>
                                
                                <Row>
                                    <Col className="text-start">
                                        Updated on : {" "}
                                        { batch && 
                                            <Moment format="MMMM Do YYYY, h:mm:ss a" className="fw-bold">
                                                { batch.created }
                                            </Moment>
                                        }
                                    </Col>
                                    <Col className="text-end">
                                        Data powered by <a href="https://www.coingecko.com/" rel="noreferrer" target="_blank">CoinGecko</a>
                                    </Col>
                                </Row>
                                
                            </div>
                        }
                    </>
                    
                }
                
            </div>
        </Container>
    )
}

export default Home;