import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import Moment from "react-moment";

const Returns = () => {
    const [data, setData] = useState(null)

    const getDifference = (value, current) => {
        return ((value - current) / current * 100).toFixed(2);
    } 

    const assets = ['CTP10', 'CTP50', 'Bitcoin', 'Ethereum'];
    const codes = {
        'CTP10': 'CTP10', 
        'CTP50': 'CTP50', 
        'Bitcoin': 'BTC', 
        'Ethereum': 'ETH'
    }

    useEffect(() => {
        const fetchData = async() => {
            const response = await axios.get('api/currencies/ctp-returns')
            if(response.data) {
                setData(response.data.data);
            }
        }
        fetchData()
    }, [])

    return (
        <Container className="pt-5 pb-5">
            <h2 className="mb-0">Returns Comparison</h2>
            <small className="text-muted mb-3 d-block">
                As of: &nbsp;
                {
                    data &&
                    <Moment format="MMMM Do YYYY, h:mm:ss a">
                            { data.current.created }
                    </Moment>
                }
            </small>
        {
            data &&
            <Table responsive>
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>15 days</th>
                        <th>1 Month</th>
                        <th>3 Month</th>
                        <th>6 Month</th>
                        <th>1 Year</th>
                    </tr>
                </thead>
                <tbody>
                {
                    assets.map(asset => {
                        return (
                            <tr key={asset}>
                                <td>{codes[asset]}</td>
                                <td className={(data.current[asset] - data.day[asset] > 0) ? 'text-success' : 'text-danger'}>
                                    {getDifference(data.current[asset], data.day[asset])}%
                                </td>
                                <td className={(data.current[asset] - data.month[asset] > 0) ? 'text-success' : 'text-danger'}>
                                    {getDifference(data.current[asset], data.month[asset])}%
                                </td>
                                <td className={(data.current[asset] - data.month3[asset] > 0) ? 'text-success' : 'text-danger'}>
                                    {getDifference(data.current[asset], data.month3[asset])}%
                                </td>
                                <td className={(data.current[asset] - data.month6[asset] > 0) ? 'text-success' : 'text-danger'}>
                                    {getDifference(data.current[asset], data.month6[asset])}%
                                </td>
                                <td className={(data.current[asset] - data.year[asset] > 0) ? 'text-success' : 'text-danger'}>
                                    {getDifference(data.current[asset], data.year[asset])}%
                                </td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </Table>
        }
        </Container>
    )
}

export default Returns;