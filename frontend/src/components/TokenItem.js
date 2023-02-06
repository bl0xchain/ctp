import { useEffect, useState } from "react";
import ctpServices from "../services/ctp-services";
 
const TokenItem = ({index}) => {
    const [token, setToken] = useState(null);

    const getToken = async() => {
        const tokenDetails = await ctpServices.getComponent(index);
        setToken(tokenDetails);
    }

    useEffect(() => {
        getToken();
    }, [])
    return (
        <>
        {
            token &&
            <tr>
                <td>{token.index + 1}</td>
                <td>
                    <a href={"https://goerli.etherscan.io/token/"+token.address} target="_blank" rel="noreferrer">{token.name}</a>
                </td>
                <td>
                    {token.symbol}
                </td>
                <td className="text-end">
                    { token.composition / 100 }%
                </td>
            </tr>
        }
        </>
    )
}

export default TokenItem;