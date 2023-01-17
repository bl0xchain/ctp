import axios from "axios";
import { useEffect, useState } from "react"
import { Container, Row, Col, ButtonToolbar, Button, ButtonGroup } from "react-bootstrap"
import { NumericFormat } from "react-number-format";
import { useParams } from "react-router-dom";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import format from 'number-format.js'


const Currency = () => {
    let { id } = useParams();
    const [currencyStats, setCurrencyStats] = useState([])
    const [loading, setLoading] = useState(false)
    const [latest, setLatest] = useState(null)
    const [duration, setDuration] = useState(14)

    const formatPrice = (price) => {
        console.log(price);
        if(price < 1) {
            return format( "$#.###", price );
        } else {
            return format( "$#,###.##", price );
        }
        
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
            const response = await axios.get('/api/currencies/history/'+id, {params: {duration}})
            if(response.data) {
                setCurrencyStats(response.data)
                setLatest(response.data[response.data.length - 1])
            }
            setLoading(false)
        }
        fetchStats()
    }, [id, duration])
    return (
        <Container>
            {
                loading ?
                <div style={{minHeight: '100vh' }}>Loading...</div> :
            <>
                {
                    latest ?
                    <div className="text-center mb-5">
                        <h4 className="fw-bold mb-3">
                            <img alt="logo" className="currency-logo" src={latest.image} width="30"/> {" "}
                            {latest.name} {" "}
                            (<span className="text-uppercase">{latest.symbol}</span>)
                        </h4>
                        <h2 className="fs-1 ff-satoshi-black currency-price-details mb-5" >

                            <NumericFormat value={latest.price} displayType={'text'}
                                thousandSeparator={true} prefix={'$'} decimalScale="2"
                                decimalSeparator="."/> {" "}
                            <span 
                                    className={latest.price_change_percentage_24h > 0 ? 'text-success currency-price-percent' : 'text-danger currency-price-percent'}>
                                {
                                    latest.price_change_percentage_24h > 0 ? 
                                    <FaCaretUp /> : <FaCaretDown />
                                }
                                <NumericFormat
                                    value={latest.price_change_percentage_24h} displayType={'text'}
                                    decimalScale="2" decimalSeparator="." suffix={'%'}/>
                            </span>
                        </h2>
                        <Row className="mb-5">
                            <Col md="5">
                                <ul className="list-unstyled currency-details-list">
                                    <li>
                                        <span>Market Cap</span>
                                        <NumericFormat className="fw-bold" value={latest.market_cap} displayType={'text'}
                                            thousandSeparator={true} prefix={'$'} decimalScale="2"
                                            decimalSeparator="."/>
                                    </li>
                                    <li>
                                        <span>Volume</span>
                                        <NumericFormat className="fw-bold" value={latest.volume} displayType={'text'}
                                            thousandSeparator={true} prefix={'$'} decimalScale="2"
                                            decimalSeparator="."/>
                                    </li>
                                    <li>
                                        <span>Circulating Supply</span>
                                        <NumericFormat className="fw-bold" value={latest.circulating_supply} displayType={'text'}
                                            thousandSeparator={true} decimalScale="2"
                                            decimalSeparator="."/>
                                    </li>
                                    <li>
                                        <span>Total Supply</span>
                                        <NumericFormat className="fw-bold" value={latest.total_supply} displayType={'text'}
                                            thousandSeparator={true} decimalScale="2"
                                            decimalSeparator="."/>
                                    </li>
                                </ul>
                            </Col>
                            <Col md="7" className="ctp-graph-container">
                                <ButtonToolbar aria-label="Duration Selection" className="mb-2">
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
                                        data={currencyStats}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                        >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis tickFormatter={formatDate} dataKey="created" />
                                        <YAxis tickFormatter={formatPrice} />
                                        <Tooltip formatter={formatTooltip} labelFormatter={formatTooltipLabel} />
                                        <Legend />
                                        <Line type="linear" dot={false} dataKey="price" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Col>
                        </Row>
                    </div> :
                    <div style={{minHeight: '100vh' }}></div>
                }
            </>
            }
        </Container>
    )
}

export default Currency