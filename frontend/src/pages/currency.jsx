import axios from "axios";
import { useEffect, useState } from "react"
import { Container, Row, Col, ButtonToolbar, Button, ButtonGroup } from "react-bootstrap"
import { NumericFormat } from "react-number-format";
import { useParams } from "react-router-dom";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Line } from '@ant-design/plots';
import Header from "../components/Header";


const Currency = () => {
    let { id } = useParams();
    const [currencyStats, setCurrencyStats] = useState([])
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [latest, setLatest] = useState(null)
    const [duration, setDuration] = useState(14)

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            const response = await axios.get('/api/currencies/history/'+id, {params: {duration}})
            const respData = [];
            if(response.data) {
                setCurrencyStats(response.data)
                setLatest(response.data[response.data.length - 1])
                response.data.forEach(item => {
                    respData.push({
                        created: item.created,
                        price: item.price
                    });
                });
                setData(respData);
            }
            setLoading(false)
        }
        fetchStats()
    }, [id, duration])

    const config = {
        data,
        padding: 'auto',
        xField: 'created',
        yField: 'price',
        xAxis: {
            type: 'time',
            tickCount: 5,

        },
        smooth: true,
    };

    return (
        <>
        <Header />
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
                            <Col md="7">
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
                                <div className="ctp-graph-container">
                                    { currencyStats.length > 0 && <Line {...config} /> }
                                </div>
                            </Col>
                        </Row>
                    </div> :
                    <div style={{minHeight: '100vh' }}></div>
                }
            </>
            }
        </Container>
        </>
    )
}

export default Currency