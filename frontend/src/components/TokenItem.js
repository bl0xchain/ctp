import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ctpServices from "../services/ctp-services";
 
const TokenItem = ({index}) => {
    const [token, setToken] = useState(null);

    const getToken = async() => {
        const tokenDetails = await ctpServices.getComponent(index);
        console.log(tokenDetails);
        setToken(tokenDetails);
    }

    useEffect(() => {
        getToken();
    }, [])
    return (
        <>
        {
            token &&
            <Row>
                <Col>{token.index + 1}</Col>
                <Col>
                    <a href={"https://goerli.etherscan.io/token/"+token.address} target="_blank" rel="noreferrer">{token.name}</a>
                </Col>
                <Col>
                    {token.symbol}
                </Col>
                <Col>
                    { token.composition / 100 }%
                </Col>
            </Row>
        }
        </>
    )
}

export default TokenItem;