import web3 from './web3';
import FreelancerFactory from './build/FreelancerFactory.json';
import FreelancerFactoryDeployedAddress from './FreelancerFactoryDeployedAddress.js';

const instance = new web3.eth.Contract(
  JSON.parse(FreelancerFactory.interface),
  FreelancerFactoryDeployedAddress
);

export default instance;
