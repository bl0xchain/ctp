import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Body, Cell, Header, HeaderCell, HeaderRow, Row, Table } from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { Link } from "react-router-dom";
import { NumericFormat } from "react-number-format";

const CurrencyPortfolio = ({ currencies }) => {
    const [data, setData] = useState(null);
    const theme = useTheme({
        Table: `
          --data-table-library_grid-template-columns:  minmax(120px, 300px) 150px auto auto auto auto;
        `,
        BaseCell: `
            &:nth-of-type(1) {
            left: 0px;
            }
        `,
    });

    useEffect(() => {
        if(currencies) {
            setData({nodes: currencies})
        }
    }, [currencies])
    return (
        <Container className="py-5">
            <h2 className="mb-4">Portfolio Construction</h2>
            {
                data && 
                <Table data={data} theme={theme} layout={{ custom: true }}>
                    {(tableList) => (
                        <>
                        <Header>
                            <HeaderRow>
                                <HeaderCell resize pinLeft className="bg-white">Currency Name</HeaderCell>
                                <HeaderCell resize className="text-center">Classification</HeaderCell>
                                <HeaderCell resize className="text-center">Weight</HeaderCell>
                                <HeaderCell resize className="text-center">Market Cap</HeaderCell>
                                <HeaderCell resize className="text-center">Price</HeaderCell>
                                <HeaderCell resize className="text-end">Price Change</HeaderCell>
                            </HeaderRow>
                        </Header>
                        <Body>
                            {tableList.map(currency => (
                                <Row key={currency._id} item={currency} >
                                    <Cell pinLeft className="bg-white">
                                        <Link to={"/currency/"+currency.id}>
                                            <img alt="logo" className="currency-logo" src={currency.image} width="25"/> {" "}
                                            <span className="currency-name">{currency.name}</span> {" "}
                                            <small className="text-muted text-uppercase">{currency.symbol}</small>
                                        </Link>
                                    </Cell>
                                    <Cell className="text-center">
                                        <span className={"currency-type-tag "+ currency.category}>{currency.category}</span>
                                    </Cell>
                                    <Cell className="text-center">
                                        <NumericFormat value={currency.weight} displayType={'text'}
                                            thousandSeparator={true} decimalScale="2"
                                            decimalSeparator="." suffix={'%'} />
                                    </Cell>
                                    <Cell className="text-center">
                                        <NumericFormat value={currency.market_cap} displayType={'text'}
                                            thousandSeparator={true} prefix={'$'} decimalScale="2"
                                            decimalSeparator="."/>
                                    </Cell>
                                    <Cell className="text-center">
                                        <NumericFormat value={currency.price} displayType={'text'}
                                            thousandSeparator={true} prefix={'$'} decimalScale="2"
                                            decimalSeparator="."/>
                                    </Cell>
                                    <Cell className="text-end">
                                        <NumericFormat
                                            className={currency.price_change_24h > 0 ? 'text-success' : 'text-danger'}
                                            value={currency.price_change_24h} displayType={'text'}
                                            decimalScale="2" decimalSeparator="." suffix={'%'}/>
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

export default CurrencyPortfolio;