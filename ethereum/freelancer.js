import web3 from './web3';
import Freelancer from './build/Freelancer.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(Freelancer.interface), address);
};
