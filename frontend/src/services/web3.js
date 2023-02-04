import Web3 from "web3";

let web3;

// const web3 = new Web3(
//     new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_INFURA_HTTP)
// );
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // we are in the browser and meta mask is installed
    web3 = new Web3(window.web3.currentProvider);
} else {
    // we are on the server *OR* meta mask is not running
    // creating our own provider
    const provider = new Web3.providers.HttpProvider(process.env.INFURA_HTTP);
    web3 = new Web3(provider);
}

export default web3;
