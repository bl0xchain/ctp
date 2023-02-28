import { useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import HeaderNav from "../components/Header"
import { useTheme } from "@table-library/react-table-library/theme"
import { getTheme } from "@table-library/react-table-library/baseline"
import { Body, Cell, Header, HeaderCell, HeaderRow, Row, Table } from "@table-library/react-table-library/table"
import currencyService from "../features/currency/currencyService"
import { useSelector } from "react-redux"
import Login from "../components/Login"
import NotAllowed from "../components/NotAllowed"

const ManageCurrencies = () => {
    const [data, setData] = useState(null)
    const { user } = useSelector( (state) => state.auth )

    const theme = useTheme(getTheme());

    const loadCurrencies = async() => {
        const currencies = await currencyService.getCurrencies()
        setData({ nodes: currencies })
    }

    useEffect(() => {
        loadCurrencies()
    })

    return (
        <>
            <HeaderNav />
            <Container className="py-5" style={{ minHeight: "calc(100vh - 221px)" }}>
                <h2>Manage Currencies</h2>
                {
                    ! user ?
                    <Login /> :
                    <>
                    {
                        user.isAdmin ? <>
                        { data && <Table data={data} theme={theme}>
                            {
                                (tableList) => (
                                    <>
                                        <Header>
                                            <HeaderRow>
                                                <HeaderCell>coingecko id</HeaderCell>
                                                <HeaderCell>name</HeaderCell>
                                                <HeaderCell>symbol</HeaderCell>
                                                <HeaderCell>image</HeaderCell>
                                                <HeaderCell>category</HeaderCell>
                                                <HeaderCell>total_supply</HeaderCell>
                                                <HeaderCell>ff_assumption</HeaderCell>
                                                <HeaderCell>ctp_group</HeaderCell>
                                            </HeaderRow>
                                        </Header>
                                        <Body>
                                            {tableList.map((item) => (
                                                <Row key={item._id} item={item}>
                                                    <Cell>{item.coingecko_id}</Cell>
                                                    <Cell>{item.name}</Cell>
                                                    <Cell>{item.symbol}</Cell>
                                                    <Cell>{item.image}</Cell>
                                                    <Cell>{item.category}</Cell>
                                                    <Cell>{item.total_supply}</Cell>
                                                    <Cell>{item.ff_assumption}</Cell>
                                                    <Cell>{item.ctp_group}</Cell>
                                                </Row>
                                            ))}
                                        </Body>
                                    </>
                                )
                            }
                        </Table> } </> :
                        <NotAllowed />
                    }
                    </>
                }
            </Container>
        </>
    )
}

export default ManageCurrencies