import { useState, useEffect } from "react";
import { Container, Form, Row, Col, Table, ButtonToolbar, ButtonGroup, Button, Spinner } from "react-bootstrap";
import axios from 'axios';
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts';
import format from 'number-format.js'

const Home = () => {
    const [ctpGroup, setCtpGroup] = useState('CTP10')
    const [batch, setBatch] = useState(null)
    const [currencyStats, setCurrencyStats] = useState([])
    const [ctpStats, setCtpStats] = useState([])
    const [duration, setDuration] = useState(14)
    const [loading, setLoading] = useState(false)
    const [ctpStatsLoading, setCtpStatsLoading] = useState(false)
    const [ctp24Change10, setCtp24Change10] = useState('')
    const [ctp24Change50, setCtp24Change50] = useState('')
    const [currencyComposition, setCurrencyComposition] = useState(null)
    const [ctpComposition, setCtpComposition] = useState(null)

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

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            const response = await axios.get('api/currencies/stats/'+ctpGroup)
            if(response.data) {
                setBatch(response.data.batch)
                setCurrencyStats(response.data.currencies)
                let currency_stats = {
                    Other: {
                        name: 'Other',
                        value: 0
                    }
                }
                let ctp_composition = {
                    C: {
                        name: 'Coin',
                        value: 0
                    },
                    T: {
                        name: 'Token',
                        value: 0
                    },
                    P: {
                        name: 'Protocol',
                        value: 0
                    }
                }
                response.data.currencies.forEach(currency => {
                    if(currency.weight > 5) {
                        currency_stats[currency.name] = {
                            name: currency.name,
                            value: currency.weight
                        }
                    } else {
                        currency_stats['Other'].value = currency_stats['Other'].value + currency.weight
                    }
                    ctp_composition[currency.category].value = ctp_composition[currency.category].value + currency.weight
                })

                ctp_composition = Object.values(ctp_composition);
                ctp_composition.map(item => {
                    item.value = Math.round(item.value * 100) / 100
                    return item
                })

                currency_stats = Object.values(currency_stats);
                currency_stats.map(item => {
                    item.value = Math.round(item.value * 100) / 100
                    return item
                })

                
                setCurrencyComposition(currency_stats)
                setCtpComposition(ctp_composition)
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
                const ctp24ago = (ctpResponse.data.length > 24) ? ctpResponse.data[ctpResponse.data.length - 25] : ctpResponse.data[0];
                const ctp24now = ctpResponse.data[ctpResponse.data.length - 1];
                const diff50 = ctp24now.ctp_value_50 - ctp24ago.ctp_value_50
                setCtp24Change50(diff50 / ctp24ago.ctp_value_50 * 100)
                const diff10 = ctp24now.ctp_value_10 - ctp24ago.ctp_value_10
                setCtp24Change10(diff10 / ctp24ago.ctp_value_10 * 100)
                
            }
            setCtpStatsLoading(false)
        }
        fetchStats()
    }, [duration])

    return (
        <Container>
            <div className="text-center compact">
                <Form className="ctp-group mb-2 fw-bold fs-4 text-secondary">
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
                                    
                                </Col>
                                <Col sm="4">
                                    <h5 className="text-secondary">Index Value</h5>
                                    <h2 className="fs-1">
                                        <NumberFormat 
                                            value={ctpGroup === 'CTP10' ? batch.ctp_value_10 : batch.ctp_value_50} 
                                            displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                            decimalScale="2" decimalSeparator="." />
                                    </h2>
                                    {
                                        ctpGroup === 'CTP10'?
                                        <h5 className={ctp24Change10 > 0 ? 'text-success' : 'text-danger'}>
                                        (<NumberFormat
                                            value={ctp24Change10} displayType={'text'}
                                            decimalScale="2" decimalSeparator="." suffix={'%'}/>)
                                        </h5>:
                                        <h5 className={ctp24Change50 > 0 ? 'text-success' : 'text-danger'}>
                                        (<NumberFormat
                                            value={ctp24Change50} displayType={'text'}
                                            decimalScale="2" decimalSeparator="." suffix={'%'}/>)
                                        </h5>
                                    }
                                    
                                </Col>
                                <Col sm="4">
                                    
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
                                            {
                                                ctpGroup === 'CTP10' ?
                                                <Line type="linear" dot={false} dataKey="ctp_value_10" stroke="#82ca9d" /> :
                                                <Line type="linear" dot={false} dataKey="ctp_value_50" stroke="#82ca9d" />
                                            }
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

                                <Row>
                                    <Col sm="6" style={{height: '350px'}}>
                                        <h4>CTP COMPOSITION</h4>
                                        {
                                            ctpComposition && 
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart width={400} height={400}>
                                                    <Pie
                                                        data={ctpComposition}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        outerRadius={120}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                        label
                                                    >
                                                        {ctpComposition.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                        <LabelList dataKey="name" position="insideTop" angle="0"  />
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        }
                                        
                                    </Col>
                                    <Col sm="6" style={{height: '350px'}}>
                                        { currencyComposition && 
                                        <>
                                            <h4>PORTFOLIO COMPOSITION</h4>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart width={400} height={400}>
                                                    <Pie
                                                        dataKey="value"
                                                        data={currencyComposition}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        outerRadius={120}
                                                        fill="#5b8aff"
                                                        label
                                                    >
                                                        {currencyComposition.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                            <LabelList dataKey="name" position="insideTop" angle="0"  />
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </>
                                        }
                                        
                                    </Col>
                                </Row>

                                <div className="mb-5">
                                    <Button size="lg" disabled className="rounded-pill">
                                        Buy CTP Index
                                    </Button>
                                    <p>Coming Soon</p>
                                </div>

                                <Table responsive className="ctp-stats-table mb-5">
                                    <thead>
                                        <tr>
                                            <th className="text-start">Currency Name</th>
                                            <th>Classification</th>
                                            <th>weight</th>
                                            <th>Market Cap</th>
                                            <th>Price</th>
                                            <th className="text-end">Price Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        currencyStats.map(currency => (
                                            <tr key={currency._id}>
                                                <td className="text-start">
                                                    <Link to={"/currency/"+currency.id}>
                                                        <img alt="logo" className="currency-logo" src={currency.image} width="25"/> {" "}
                                                        <span className="currency-name">{currency.name}</span> {" "}
                                                        <small className="text-muted text-uppercase">{currency.symbol}</small>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <span className="currency-type-tag">{currency.category}</span>
                                                </td>
                                                <td>
                                                    <NumberFormat value={currency.weight} displayType={'text'}
                                                        thousandSeparator={true} decimalScale="2"
                                                        decimalSeparator="." suffix={'%'} />
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
                                                <td className="text-end">
                                                    <NumberFormat
                                                        className={currency.price_change_24h > 0 ? 'text-success' : 'text-danger'}
                                                        value={currency.price_change_24h} displayType={'text'}
                                                        decimalScale="2" decimalSeparator="." suffix={'%'}/>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </Table>
                                
                                <Row className="mt-5">
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