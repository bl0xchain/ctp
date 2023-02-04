import web3 from "./web3";
import ctpTokenABI from "../abis/ctptoken-abi.json";
import erc20ABI from "../abis/erc20-abi.json";

export const ctpContractAddress = '0xaCF1421e0BABb9C0Da6eBA904224B0AeCeCd1084';

export const ctpContract = new web3.eth.Contract(
    ctpTokenABI, ctpContractAddress
);

class CtpServices {

    getTokenContract(tokenAddress) {
        return new web3.eth.Contract(
            erc20ABI,
            tokenAddress
        );
    }

    async getComponent(index) {
        const tokenAddress = await ctpContract.methods.components(index).call();
        console.log(tokenAddress);
        const tokenDetails = {};
        const tokenContract = this.getTokenContract(tokenAddress);
        tokenDetails.index = index;
        tokenDetails.address = tokenAddress;
        tokenDetails.name = await tokenContract.methods.name().call();
        tokenDetails.symbol = await tokenContract.methods.symbol().call();
        tokenDetails.composition = await ctpContract.methods.units(index).call();
        return tokenDetails;
    }
}

export default new CtpServices();