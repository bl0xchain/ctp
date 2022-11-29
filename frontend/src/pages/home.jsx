import { useState, useEffect } from "react";
import { Container, Form, Row, Col, Table, ButtonToolbar, ButtonGroup, Button, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from 'axios';
import { NumericFormat } from "react-number-format";
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import format from 'number-format.js'
import { FaFilePdf } from "react-icons/fa";
import Returns from "../components/Returns";
import Share from "../components/Share";
import StatsChart from "../components/StatsChart";
import StatsPieChart from "../components/StatsPieChart";

const Home = ({ setLogoColor }) => {
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
            // setLoading(false)
        }
        fetchStats()
    }, [ctpGroup])

    useEffect(() => {
        if(ctpGroup === 'CTP10') {
            setLogoColor((ctp24Change10 > 0) ? 'text-success' : 'text-danger');
        } else {
            setLogoColor((ctp24Change50 > 0) ? 'text-success' : 'text-danger');
        }
    }, [ctp24Change10, ctp24Change50, ctpGroup])

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

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Simple tooltip
        </Tooltip>
      );

    return (
        <>
        
        <div className="mb-5">
            <Container style={{minHeight: '400px'}}>
            {
                batch &&
                <Row className="pt-5 pb-5 align-items-center">
                    <Col md="3">
                        
                        <h5 className="text-secondary">index value</h5>
                        <h2 className="fs-1 fw-bold text-dark mb-4">
                            <NumericFormat 
                                value={ctpGroup === 'CTP10' ? batch.ctp_value_10 : batch.ctp_value_50} 
                                displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                decimalScale="2" decimalSeparator="." />
                        </h2>
                        <div className="fs-5 mb-5">
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
                        <div className="mt-3">
                            <Share />
                        </div>
                    </Col>
                    <Col md="9" className="ctp-graph-container mb-5">
                        <Form className="ff-hoefler ctp-group mb-2 fs-3 text-secondary mb-4 text-center">
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
                            <StatsChart ctpStats={ctpStats} ctpGroup={ctpGroup} />
                        {
                            ctpStatsLoading &&
                            <div className="loading-container">
                                <Spinner animation="grow" variant="primary" /> {" "}
                                <Spinner animation="grow" variant="primary" /> {" "}
                                <Spinner animation="grow" variant="primary" /> {" "}
                            </div>
                        }
                        <div className="pb-5 clearfix"></div>
                    </Col>
                </Row>
            }
                
            </Container>
        </div>
        <div className="bg-light">
            <Container className="pt-5 pb-5">
                <Row>
                    <Col md="6">
                        <h2 className="mb-3 fs-5 text-secondary">Ticker <span className="fs-2 ms-1  ff-hoefler-black text-dark">CTP</span></h2>
                        <p className="pe-3">
                        The CTP is the index of the top cryptocurrencies based on deep research of the currencies in the emerging industry. CTP is an abbreviation for Coins, Tokens and Protocol which are the main elements for Cryptocurrencies. We update CTP with new elements as and when the market changes.
                        </p>
                    </Col>
                    <Col md="6">
                        <h2 className="mb-4">Documents</h2>
                        <ul className="list-inline">
                            <li className="list-inline-item">
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
                            <li className="list-inline-item">
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
                            <li className="list-inline-item">
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
            <Returns ctpStats={ctpStats} ctpStatsLoading={ctpStatsLoading} />
        </div>
        <div className="bg-light text-center">
            <Container className="pt-5 pb-5">
            {
                currencyStats &&
                <Row>
                    <Col sm="6" style={{height: '350px'}}>
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
                <div className="mt-5">
                    <Button size="lg" disabled className="rounded-pill">
                        Buy CTP Index
                    </Button>
                    <p>Coming Soon</p>
                </div>
            </Container>
        </div>
        <Container className="pt-5 pb-5">
            <h2 className="mb-4">Portfolio Construction</h2>
            {
                currencyStats &&
                <Table responsive className="ctp-stats-table mb-5 text-center text-secondary">
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
                            <tr key={currency.id}>
                                <td className="text-start">
                                    <Link to={"/currency/"+currency.id}>
                                        <img alt="logo" className="currency-logo" src={currency.image} width="25"/> {" "}
                                        <span className="currency-name">{currency.name}</span> {" "}
                                        <small className="text-muted text-uppercase">{currency.symbol}</small>
                                    </Link>
                                </td>
                                <td>
                                    <span className={"currency-type-tag "+ currency.category}>{currency.category}</span>
                                </td>
                                <td>
                                    <NumericFormat value={currency.weight} displayType={'text'}
                                        thousandSeparator={true} decimalScale="2"
                                        decimalSeparator="." suffix={'%'} />
                                </td>
                                <td>
                                    <NumericFormat value={currency.market_cap} displayType={'text'}
                                        thousandSeparator={true} prefix={'$'} decimalScale="2"
                                        decimalSeparator="."/>
                                </td>
                                <td>
                                    <NumericFormat value={currency.price} displayType={'text'}
                                        thousandSeparator={true} prefix={'$'} decimalScale="2"
                                        decimalSeparator="."/>
                                </td>
                                <td className="text-end">
                                    <NumericFormat
                                        className={currency.price_change_24h > 0 ? 'text-success' : 'text-danger'}
                                        value={currency.price_change_24h} displayType={'text'}
                                        decimalScale="2" decimalSeparator="." suffix={'%'}/>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
            }
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