import web3 from "./web3";
import ctpTokenABI from "../abis/ctptoken-abi.json";
import erc20ABI from "../abis/erc20-abi.json";
import { ethers } from "ethers";

export const ctpContractAddress = '0x97b779BCA5b963D19eBD936f2e2A9Fdf710b81e7';
export const usdcContractAddress = '0x98339D8C260052B7ad81c28c16C0b98420f2B46a';

export const ctpContract = new web3.eth.Contract(
    ctpTokenABI, ctpContractAddress
);

export const usdcContract = new web3.eth.Contract(
    erc20ABI, usdcContractAddress
);

class CtpServices {

    getTokenContract(tokenAddress) {
        return new web3.eth.Contract(
            erc20ABI,
            tokenAddress
        );
    }

    async getComponentCount() {
        const count = await ctpContract.methods.componentCount().call();
        console.log(count);
        return parseInt(count);
    }

    async getCtpPrice() {
        return await ctpContract.methods.ctpPrice().call();
    }

    async getCtpBalance(address) {
        const balance = await ctpContract.methods.balanceOf(address).call();
        return parseFloat(ethers.utils.formatEther(balance));
    }

    async getComponent(index) {
        const tokenAddress = await ctpContract.methods.components(index).call();
        const tokenDetails = {};
        const tokenContract = this.getTokenContract(tokenAddress);
        tokenDetails.index = index;
        tokenDetails.address = tokenAddress;
        tokenDetails.name = await tokenContract.methods.name().call();
        tokenDetails.symbol = await tokenContract.methods.symbol().call();
        tokenDetails.composition = await ctpContract.methods.units(index).call();
        return tokenDetails;
    }

    async allowUsdc(address, amount) {
        try {
            await usdcContract.methods.approve(ctpContractAddress, ethers.utils.parseUnits(amount, 6)).send({
                from: address,
                value: 0
            });
            return {
                code: 200
            }
        } catch (error) {
            console.log(error)
            return {
                code: 403
            };
        }
    }

    async buyctp(address, amount) {
        try {
            await this.allowUsdc(address, amount);
            await ctpContract.methods.buy(ethers.utils.parseUnits(amount, 6)).send({
                from: address,
                value: 0
            });
            return {
                code: 200
            }
        } catch (error) {
            console.log(error)
            return {
                code: 403
            };
        }
    }
}

export default new CtpServices();