import axios from "axios";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Moment from "react-moment";
import { useTheme } from '@table-library/react-table-library/theme';
import { Body, Cell, Header, HeaderCell, HeaderRow, Row, Table } from '@table-library/react-table-library/table';

const ReturnsComp = () => {
    const [updated, setUpdated] = useState("")
    const [data, setData] = useState(null)
    const theme = useTheme({
        Table: `
            --data-table-library_grid-template-columns: auto auto auto auto auto auto;
        `,
        BaseCell: `
            &:nth-of-type(1) {
            left: 0px;
            }
        `,
    });

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
                const data = response.data.data;
                console.log(data)
                setUpdated(data.current.created)
                const nodes = [];
                assets.forEach(asset => {
                    nodes.push({
                        name: codes[asset],
                        days: getDifference(data.current[asset], data.day[asset]),
                        month: getDifference(data.current[asset], data.month[asset]),
                        month3: getDifference(data.current[asset], data.month3[asset]),
                        month6: getDifference(data.current[asset], data.month6[asset]),
                        year: getDifference(data.current[asset], data.year[asset])
                    })
                });
                setData({ nodes })
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
                    updated &&
                    <Moment format="MMMM Do YYYY, h:mm:ss a">
                            { updated }
                    </Moment>
                }
            </small>
        {
            data &&
            <Table data={data} theme={theme} layout={{ custom: true }}>
                {(tableList) => (
                    <>
                    <Header>
                        <HeaderRow>
                            <HeaderCell resize pinLeft className="bg-white">&nbsp;</HeaderCell>
                            <HeaderCell resize className="text-center">15 days</HeaderCell>
                            <HeaderCell resize className="text-center">1 Month</HeaderCell>
                            <HeaderCell resize className="text-center">3 Month</HeaderCell>
                            <HeaderCell resize className="text-center">6 Month</HeaderCell>
                            <HeaderCell resize className="text-center">1 Year</HeaderCell>
                        </HeaderRow>
                    </Header>
                    <Body>
                        {tableList.map((item, i) => (
                            <Row key={i} item={item} >
                                <Cell pinLeft className="bg-white">
                                    { item.name }
                                </Cell>
                                <Cell className={ (item.days > 0) ? "text-center text-success" : "text-center text-danger" }>
                                    {item.days}%
                                </Cell>
                                <Cell className={ (item.month > 0) ? "text-center text-success" : "text-center text-danger" }>
                                    {item.month}%
                                </Cell>
                                <Cell className={ (item.month3 > 0) ? "text-center text-success" : "text-center text-danger" }>
                                    {item.month3}%
                                </Cell>
                                <Cell className={ (item.month6 > 0) ? "text-center text-success" : "text-center text-danger" }>
                                    {item.month6}%
                                </Cell>
                                <Cell className={ (item.year > 0) ? "text-center text-success" : "text-center text-danger" }>
                                    {item.year}%
                                </Cell>
                            </Row>
                        ))}
                    </Body>
                    </>
                )}
            </Table>
        }
        </Container>
    )
}

export default ReturnsComp;