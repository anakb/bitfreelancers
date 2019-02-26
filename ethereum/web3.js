import Web3 from 'web3';

process.env.ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK || 'http://127.0.0.1:8545';
console.log('ETHEREUM_NETWORK =', process.env.ETHEREUM_NETWORK);
process.env.ETHEREUM_MNEMONIC = process.env.ETHEREUM_MNEMONIC || 'arctic market penalty various glue runway cliff rose shrimp ticket drop home';
console.log('ETHEREUM_MNEMONIC =', process.env.ETHEREUM_MNEMONIC);

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and metamask is running.
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    //'http://127.0.0.1:8545'    
    //'https://rinkeby.infura.io/v3/ac438bab1dea49479c947908f8c2ced5'
    process.env.ETHEREUM_NETWORK
  );
  web3 = new Web3(provider);
}

export default web3;
