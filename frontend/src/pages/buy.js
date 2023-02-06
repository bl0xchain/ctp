import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Badge, Button, Container, Form, InputGroup, Nav, Navbar, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import { Link } from "react-router-dom";
import { FaUnlink } from "react-icons/fa";
import TokenItem from "../components/TokenItem";
import ctpServices, { ctpContractAddress } from "../services/ctp-services";

const Buy = () => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [chainId, setChainId] = useState('');
    const [ctpBalance, setCtpBalance] = useState(0);
    const [ctpValue, setCtpValue] = useState(0);
    const [usdcAmount, setUsdcAmount] = useState("");
    const [ctpAmount, setCtpAmount] = useState("");
    const [buying, setBuying] = useState(false);
    const [componentCount, setComponentCount] = useState(0);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    
    const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert("Get MetaMask -> https://metamask.io/");
				return;
			}
			const accounts = await ethereum.request({ method: "eth_requestAccounts" });
			setCurrentAccount(accounts[0]);
            const chainID = await ethereum.request({ method: 'eth_chainId' });
		    setChainId(chainID);
		} catch (error) {
			console.log(error)
		}
	}
    
    const checkIfWalletIsConnected = async () => {
		const { ethereum } = window;

		if (!ethereum) {
			console.log("Make sure you have MetaMask!");
			return;
		}
		const accounts = await ethereum.request({ method: 'eth_accounts' });
		if (accounts.length !== 0) {
			const account = accounts[0];
			setCurrentAccount(account);
		}

		const chainID = await ethereum.request({ method: 'eth_chainId' });
		setChainId(chainID);

		ethereum.on('chainChanged', handleChainChanged);
		
		function handleChainChanged(_chainId) {
			window.location.reload();
		}
	}

    const getCtpBalance = async() => {
        const balance = await ctpServices.getCtpBalance(currentAccount);
        setCtpBalance(balance);
    }

    const buyCtp = async() => {
        setError("");
        setMessage("");
        if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
            setBuying(true);
            const response = await ctpServices.buyctp(currentAccount, usdcAmount);
            if(response.code === 200) {
                setMessage("CTP10 buy successful.");
                setUsdcAmount("");
                setCtpAmount("");
                setError("");
                getCtpBalance();
            } else {
                setError("Problem with buying CTP10.");
                setMessage("");
            }
            setBuying(false);
        }
    }

    const getCtpValue = async() => {
        const ctpPrice = await ctpServices.getCtpPrice();
        setCtpValue(ethers.utils.formatUnits(ctpPrice, 6));
    }

    const onUsdcChange = (e) => {
        setUsdcAmount(e.target.value);
        setCtpAmount((e.target.value) / ctpValue);
    }

    const getShortAddress = (address) => {
        return String(address).substring(0, 6) + "..." + String(address).substring(38)
    }

    const getComponentCount = async() => {
        const count = await ctpServices.getComponentCount();
        setComponentCount(count);
    }

    useEffect(() => {
		if(currentAccount !== "" && chainId === "0x5") {
            getCtpBalance();
        }
	}, [currentAccount, chainId]);

    useEffect(() => {
		checkIfWalletIsConnected();
        getCtpValue();
        getComponentCount();
	}, [])


    
    return (
        <>
        <header className="mb-0">
            <Navbar variant="light" className="ff-satoshi">
                <Container>
                    <Link to="/" className="navbar-brand">
                        <h2 className={"text-success ff-satoshi-black"}>
                            CTP
                            <span className="ff-sf-pro">Index</span>
                        </h2>
                    </Link>
                    <Nav className="d-flex">
                    {
                        currentAccount === "" ?
                        <Button onClick={connectWallet}>Connect Wallet</Button> :
                        <>
                        {
                            chainId === '0x5' ?
                            <>Connected: {getShortAddress(currentAccount)}</> :
                            <OverlayTrigger
                                placement="bottom"
                                overlay={<Tooltip>Connect to Goerli Testnet</Tooltip>}
                            >
                                <Badge pill bg="danger" text="light">
                                    <FaUnlink /> { " " }
                                    Wrong Network
                                </Badge>
                            </OverlayTrigger>
                        }
                        </>
                    }
                    </Nav>
                </Container>
            </Navbar>
        </header>
        <Container className="py-5" style={{minHeight: 'calc(100vh - 221px)'}}>
            <h1 className="text-center mb-5">BUY CTP10</h1>
            {
                ctpValue &&
                <h2 className="text-center mb-4 text-primary ff-satoshi-black fs-1">
                    <NumericFormat 
                    value={ctpValue} 
                    displayType={'text'} thousandSeparator={true} prefix={'$'} 
                    decimalScale="6" decimalSeparator="." />
                </h2>
            }
            
            <div className="text-center">
            {
                currentAccount === "" ?
                <>
                    <h3 className="mb-4">Connect wallet to Buy and Manage CTP10</h3>
                    <Button onClick={connectWallet}>Connect Wallet</Button>
                </> :
                <>
                    {
                        chainId === '0x5' ?
                        <>
                        <p className="mb-5">Your CTP Balance: {ctpBalance}</p>
                        <InputGroup className="mb-3" style={{maxWidth: '500px', margin: '0 auto'}}>
                            <InputGroup.Text>USDC</InputGroup.Text>
                            <Form.Control
                                placeholder="Amount in USDC"
                                aria-label="Amount in USDC"
                                value={usdcAmount}
                                onChange={onUsdcChange}
                            />
                            {
                                buying ?
                                <Button variant="outline-primary" disabled>
                                    BUYING {ctpAmount && ctpAmount.toFixed(4)} CTP10 {" "}
                                    <Spinner size="sm" animation="border" />
                                </Button> :
                                <Button variant="outline-primary" onClick={buyCtp}>
                                    BUY {ctpAmount && ctpAmount.toFixed(4)} CTP10
                                </Button>
                            }
                            
                        </InputGroup>
                        <p className="text-success">{message}</p>
                        <p className="text-danger">{error}</p>
                        </> :
                        <p className="text-danger mb-4">Please change the network to Goerli TestNet</p>
                    }
                    
                </>
            }
            </div>
            <div className="fs-5" style={{margin: '0 auto', maxWidth: '450px'}}>
                <p>1 CTP10 is composed of the following token</p>
                <table className="table">
                    { componentCount > 0 &&
                        [...Array(componentCount)].map((x, i) => <TokenItem key={i} index={i} />)
                    }
                </table>
            </div>
            <p className="text-center fs-6 mt-5">
                You are interacting with contract {" "}
                <a href={"https://goerli.etherscan.io/address/"+ctpContractAddress} target="_blank" rel="noreferrer">{ctpContractAddress}</a>
            </p>
        </Container>
        </>
    )
}

export default Buy;