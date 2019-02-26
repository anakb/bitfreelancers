const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/FreelancerFactory.json');

process.env.ETHEREUM_NETWORK = process.env.ETHEREUM_NETWORK || 'http://127.0.0.1:8545';
console.log('ETHEREUM_NETWORK =', process.env.ETHEREUM_NETWORK);
process.env.ETHEREUM_MNEMONIC = process.env.ETHEREUM_MNEMONIC || 'arctic market penalty various glue runway cliff rose shrimp ticket drop home';
console.log('ETHEREUM_MNEMONIC =', process.env.ETHEREUM_MNEMONIC);

const provider = new HDWalletProvider(
  'arctic market penalty various glue runway cliff rose shrimp ticket drop home',
  //'http://127.0.0.1:8545'
  //'https://rinkeby.infura.io/v3/ac438bab1dea49479c947908f8c2ced5'
  process.env.ETHEREUM_NETWORK
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '5000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);

  var s = `// ${new Date().toISOString()} Automatically created by "node deploy.js"

let FreelancerFactoryDeployedAddress;
FreelancerFactoryDeployedAddress = "${result.options.address}";
export default FreelancerFactoryDeployedAddress;
`;

  const fs = require('fs');
  fs.writeFile('FreelancerFactoryDeployedAddress.js', s, function (err) {
    if (!err) {
      console.log('\nWrote data to "FreelancerFactoryDeployedAddress.js" file');
    }
    else
    {
      throw err;
    }
  })
};
deploy();

