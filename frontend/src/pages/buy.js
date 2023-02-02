import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ctpTokenABI from "../abis/ctptoken-abi.json";
import erc20ABI from "../abis/erc20-abi.json";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import axios from "axios";
import { NumericFormat } from "react-number-format";
import format from "number-format.js";

const CONTRACT_ADDRESS = '0xaCF1421e0BABb9C0Da6eBA904224B0AeCeCd1084';
const USDC_ADDRESS = '0x98339D8C260052B7ad81c28c16C0b98420f2B46a';

const Buy = () => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [chainId, setChainId] = useState('');
    const [ctpBalance, setCtpBalance] = useState(0);
    const [ctpValue, setCtpValue] = useState(0);
    const [usdcAmount, setUsdcAmount] = useState("");
    const [ctpAmount, setCtpAmount] = useState("");
    const [buying, setBuying] = useState(false);
    
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

    const getContract = async () => {
        if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
            // const provider = new ethers.providers.Web3Provider(ethereum);
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner();
            return new ethers.Contract(CONTRACT_ADDRESS, ctpTokenABI, signer);
        } else {
            return false;
        }
    }

    const getCtpBalance = async() => {
        const contract = await getContract();
        const balance = await contract.balanceOf(currentAccount);
        setCtpBalance(ethers.utils.formatUnits(balance, 18));
    }

    const buyCtp = async() => {
        if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
            setBuying(true);
            const contract = await getContract();
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner();
            const usdcContract = new ethers.Contract(USDC_ADDRESS, erc20ABI, signer);
            let tx = await usdcContract.approve(CONTRACT_ADDRESS, ethers.utils.parseUnits(usdcAmount, 6));
            await tx.wait();
            tx = await contract.buy(ethers.utils.parseUnits(usdcAmount, 6));
            await tx.wait();
            setUsdcAmount("");
            setCtpAmount("");
            setBuying(false);

        }
    }

    const getCtpValue = async() => {
        const response = await axios.get('api/currencies/stats/CTP10')
        if(response.data) {
            setCtpValue(response.data.batch.ctp_value_10);
        }
    }

    const onUsdcChange = (e) => {
        setUsdcAmount(e.target.value);
        setCtpAmount((e.target.value) / ctpValue);
    }

    useEffect(() => {
		if(currentAccount !== "" && chainId === "0x5") {
            getCtpBalance();
        }
	}, [currentAccount, chainId]);

    useEffect(() => {
		checkIfWalletIsConnected();
        getCtpValue();
	}, [])
    
    return (
        <Container className="py-5" style={{minHeight: 'calc(100vh - 221px)'}}>
            <h1 className="text-center mb-5">BUY CTP</h1>
            {
                ctpValue &&
                <h2 className="text-center mb-4 text-primary ff-satoshi-black">
                    <NumericFormat 
                    value={ctpValue} 
                    displayType={'text'} thousandSeparator={true} prefix={'$'} 
                    decimalScale="2" decimalSeparator="." />
                </h2>
            }
            
            <div className="text-center">
            {
                currentAccount === "" ?
                <>
                    <h3 className="mb-4">Connect wallet to Buy and Manage CTP</h3>
                    <Button onClick={connectWallet}>Connect Wallet</Button>
                </> :
                <>
                    <p className="mb-4">Connected: {currentAccount}</p>
                    {
                        chainId === '0x5' ?
                        <>
                        <p className="mb-5">Your CTP Balance: {ctpBalance}</p>
                        <InputGroup className="mb-3" style={{maxWidth: '500px', margin: '0 auto'}}>
                            <InputGroup.Text>USDC</InputGroup.Text>
                            <Form.Control
                                placeholder="Amount in USDC"
                                aria-label="Amount in USDC"
                                onChange={onUsdcChange}
                            />
                            <Button variant="outline-secondary" onClick={buyCtp}>
                                BUY {ctpAmount && ctpAmount.toFixed(4)} CTP
                            </Button>
                        </InputGroup>
                        </> :
                        <p className="text-danger mb-4">Please change the network to Goerli TestNet</p>
                    }
                    
                </>
            }
            </div>  
        </Container>
    )
}

export default Buy;