import { useState, useEffect } from "react";
import { Container, Form, Row, Col, Table, ButtonToolbar, ButtonGroup, Button, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from 'axios';
import { NumericFormat } from "react-number-format";
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import { FaFilePdf } from "react-icons/fa";
import Returns from "../components/Returns";
import Share from "../components/Share";
import StatsChart from "../components/StatsChart";
import StatsPieChart from "../components/StatsPieChart";
import Header from "../components/Header";
import CurrencyPortfolio from "../components/CurrencyPortfolio";
import ReturnsComp from "../components/ReturnsComp";

const Home = () => {
    const [ctpGroup, setCtpGroup] = useState('CTP10')
    const [batch, setBatch] = useState(null)
    const [currencyStats, setCurrencyStats] = useState([])
    const [ctpStats, setCtpStats] = useState([])
    const [duration, setDuration] = useState(14)
    const [ctpStatsLoading, setCtpStatsLoading] = useState(false)
    const [ctp24Change10, setCtp24Change10] = useState('')
    const [ctp24Change50, setCtp24Change50] = useState('')
    const [currencyComposition, setCurrencyComposition] = useState(null)
    const [ctpComposition, setCtpComposition] = useState(null)

    useEffect(() => {
        const fetchStats = async () => {
            // setLoading(true)
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
                    item.value = Math.round(item.value * 10) / 10
                    return item
                })

                currency_stats = Object.values(currency_stats);
                currency_stats.map(item => {
                    item.value = Math.round(item.value * 10) / 10
                    return item
                })

                let totalStats = 0;
                currency_stats.forEach(element => {
                    if(element.name !== 'Other') {
                        totalStats += element.value;
                    }
                });
                currency_stats.map(item => {
                    if(item.name === 'Other') {
                        item.value = Math.round((100 - totalStats) * 10) / 10;
                    }
                    return item;
                });

                let totalcomp = 0;
                ctp_composition.forEach(element => {
                    if(element.name !== 'Token') {
                        totalcomp += element.value;
                    }
                });
                ctp_composition.map(item => {
                    if(item.name === 'Token') {
                        item.value = Math.round((100 - totalcomp) * 10) / 10;
                    }
                    return item;
                });

                setCurrencyComposition(currency_stats)
                setCtpComposition(ctp_composition)
            }
            // setLoading(false)
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
                const diff50 = ctp24now.CTP10 - ctp24ago.CTP50
                setCtp24Change50(diff50 / ctp24ago.CTP50 * 100)
                const diff10 = ctp24now.CTP10 - ctp24ago.CTP10
                setCtp24Change10(diff10 / ctp24ago.CTP10 * 100)
            }
            setCtpStatsLoading(false)
        }
        fetchStats()
    }, [duration])

    return (
        <>
        {/* <Header /> */}
        <Header />
        <div className="mb-5">
            <Container style={{minHeight: '400px'}}>
            {
                batch &&
                <Row className="pt-5 pb-5 align-items-center">
                    <Col md="4" className="text-center text-md-start mb-5">
                        
                        <h3 className="">index value</h3>
                        <h2 className="main-index ff-satoshi-black mb-4">
                            <NumericFormat 
                                value={ctpGroup === 'CTP10' ? batch.ctp_value_10 : batch.ctp_value_50} 
                                displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                decimalScale="2" decimalSeparator="." />
                        </h2>
                        <div className="fs-4 mb-5">
                            <p className="d-inline-block me-4">
                            {
                                ctpGroup === 'CTP10'?
                                
                                <NumericFormat
                                    value={ctp24Change10} displayType={'text'}
                                    decimalScale="2" decimalSeparator="." suffix={'%'}
                                    className={ctp24Change10 > 0 ? 'text-success' : 'text-danger'} />
                                :
                                
                                <NumericFormat
                                    value={ctp24Change50} displayType={'text'}
                                    decimalScale="2" decimalSeparator="." suffix={'%'}
                                    className={ctp24Change50 > 0 ? 'text-success' : 'text-danger'} />
                            }
                            </p>
                            <p className="text-secondary d-inline-block">24 hrs</p>
                        </div>
                        <OverlayTrigger
                            overlay={
                                <Tooltip id="button-tooltip">
                                    Coming Soon
                                </Tooltip>
                            }
                        >
                            <Button className="fw-bold" size="lg">BUY CTP</Button>
                        </OverlayTrigger>
                        {/* <Link to="/buy" className="btn btn-primary btn-lg">BUY CTP10</Link> */}
                        <div className="my-3 ">
                            <Share />
                        </div>
                    </Col>
                    <Col md="8">
                        <Form className="ff-satoshi-black ctp-group mb-2 fs-2 mb-4 text-center">
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
                        <ButtonToolbar aria-label="Duration Selection" className="mb-4">
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
                            <StatsChart ctpStats={ctpStats} ctpGroup={ctpGroup} />
                            {
                                ctpStatsLoading &&
                                <div className="loading-container">
                                    <Spinner animation="grow" variant="primary" /> {" "}
                                    <Spinner animation="grow" variant="primary" /> {" "}
                                    <Spinner animation="grow" variant="primary" /> {" "}
                                </div>
                            }
                        </div>
                    </Col>
                </Row>
            }
                
            </Container>
        </div>
        <div className="bg-light">
            <Container className="pt-5 pb-5">
                <Row>
                    <Col md="6">
                        <h2 className="mb-3 fs-5">Ticker <span className="fs-2 ms-1 ff-satoshi-black">CTP</span></h2>
                        <p className="pe-3">
                        The CTP is the index of the top cryptocurrencies based on deep research of the currencies in the emerging industry. CTP is an abbreviation for Coins, Tokens and Protocol which are the main elements for Cryptocurrencies. We update CTP with new elements as and when the market changes.
                        </p>
                    </Col>
                    <Col md="6">
                        <h2 className="mb-4">Documents</h2>
                        <ul className="list-inline">
                            <li className="list-inline-item mb-3">
                                <OverlayTrigger
                                    overlay={
                                        <Tooltip id="button-tooltip1">
                                            Coming Soon
                                        </Tooltip>
                                    }
                                >
                                    <Button variant="outline-dark" size="lg" href="#" target="_blank">
                                        <FaFilePdf /> Fact Sheet
                                    </Button>
                                </OverlayTrigger>
                            </li>
                            <li className="list-inline-item mb-3">
                                <OverlayTrigger
                                    overlay={
                                        <Tooltip id="button-tooltip2">
                                            Coming Soon
                                        </Tooltip>
                                    }
                                >
                                    <Button variant="outline-dark" size="lg" href="#" target="_blank">
                                        <FaFilePdf /> Methodology
                                    </Button>
                                </OverlayTrigger>
                                
                            </li>
                            <li className="list-inline-item mb-3">
                                <OverlayTrigger
                                    overlay={
                                        <Tooltip id="button-tooltip3">
                                            Coming Soon
                                        </Tooltip>
                                    }
                                >
                                    <Button variant="outline-dark" size="lg" href="#" target="_blank">
                                        <FaFilePdf /> Additional Info
                                    </Button>
                                </OverlayTrigger>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </div>
        <div>
            <ReturnsComp ctpStats={ctpStats} ctpStatsLoading={ctpStatsLoading} />
        </div>
        <div className="bg-light text-center">
            <Container className="pt-5 pb-5">
            {
                currencyStats &&
                <Row className="mb-5">
                    <Col sm="6" style={{height: '350px'}} className="mb-5 mb-md-0">
                        <h4>CTP COMPOSITION</h4>
                        {
                            ctpComposition &&
                            <StatsPieChart statsData={ctpComposition} />
                        }
                    </Col>
                    <Col sm="6" style={{height: '350px'}}>
                        { currencyComposition && 
                        <>
                            <h4>PORTFOLIO COMPOSITION</h4>
                            <StatsPieChart statsData={currencyComposition} />
                        </>
                        }
                    </Col>
                </Row>
            }
            </Container>
        </div>
        <CurrencyPortfolio currencies={currencyStats} />
        <Container className="pt-5 pb-5">
            <Row className="mt-0">
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
        </Container>
        </>
    )
}

export default Home;