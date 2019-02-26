const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/FreelancerFactory.json');
const compiledFreelancer = require('../ethereum/build/Freelancer.json');

let accounts;
let factory;
let freelancerAddress;
let freelancer;
let valuePassedToCreateFreelancer;
let saldoSellerInicial;
let saldoSeller;
let saldoBuyerInicial;
let saldoBuyer;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '5000000'
   });

  saldoSellerInicial = await web3.eth.getBalance(accounts[0]);
  saldoBuyerInicial = await web3.eth.getBalance(accounts[1]);

  valuePassedToCreateFreelancer = '2';
  await factory.methods.createFreelancer('nombre de tarea').send({
    from: accounts[0],
    gas: '5000000',
    value: web3.utils.toWei(valuePassedToCreateFreelancer, 'ether')
  });

  [freelancerAddress] = await factory.methods.getDeployedFreelancers().call();
  freelancer = await new web3.eth.Contract(
    JSON.parse(compiledFreelancer.interface),
    freelancerAddress
  );
});

describe('Freelancers', () => {
  it('deploys a FreelancerFactory', () => {
    // el trabajo de hacer un deploy de FreelancerFactory se hace en el beforeEach (para cada test)
    assert.ok(factory.options.address);
  });

  it('deploys a Freelancer using FreelancerFactory', () => {
    // el trabajo de hacer un deploy de Freelancer usando FreelancerFactory.createFreelancer se hace en el beforeEach (para cada test)
    assert.ok(freelancer.options.address);
  });

  it('marks FreelancerFactory.createFreelancer caller as Freelancer creator (seller)', async () => {
    const seller = await freelancer.methods.seller().call();
    assert.equal(accounts[0], seller);
  });

  it('marks FreelancerFactory.createFreelancer msg.value call set Freelancer value as (msg.value/2)', async () => {
    const value = await freelancer.methods.value().call();
    assert.equal(web3.utils.toWei(valuePassedToCreateFreelancer, 'ether') / 2, value);
  });

  it('check initial state for Freelancer contract is status=0(Created)', async () => {
    const state = await freelancer.methods.state().call();
    assert.equal(0, state);
  });

  it('allows people to call confirmPurchase, then status=1(Locked) and buyer set to caller', async () => {
    await freelancer.methods.confirmPurchase().send({
      from: accounts[1],
      value: web3.utils.toWei(valuePassedToCreateFreelancer, 'ether')
    });
    const state = await freelancer.methods.state().call();
    assert.equal(1, state);
    const buyer = await freelancer.methods.buyer().call();    
    assert.equal(accounts[1], buyer);
  });

  it('buyer can call confirmReceived, then status=2(Inactive) and seller&buyer receive their money back', async () => {
    await freelancer.methods.confirmPurchase().send({
      from: accounts[1],
      value: web3.utils.toWei(valuePassedToCreateFreelancer, 'ether')
    });
    const stateAfterConfirmPurchase = await freelancer.methods.state().call();
    assert.equal(1, stateAfterConfirmPurchase);
    const buyer = await freelancer.methods.buyer().call();    
    assert.equal(accounts[1], buyer);

    await freelancer.methods.confirmReceived().send({
      from: accounts[1]
    });
    const stateAfterConfirmReceived = await freelancer.methods.state().call();
    assert.equal(2, stateAfterConfirmReceived);

    // aqui compruebo que seller y buyer tienen su dinero de vuelta (a grosso modo)
    saldoSeller = await web3.eth.getBalance(accounts[0]);
    saldoBuyer = await web3.eth.getBalance(accounts[1]);
    assert(saldoSeller > saldoSellerInicial);
    assert(saldoBuyer < saldoBuyerInicial);
  });

  it('allows seller to call abort when status=0(Created), then status=2(Inactive)', async () => {
    await freelancer.methods.abort().send({
      from: accounts[0]
    });
    const state = await freelancer.methods.state().call();
    assert.equal(2, state);
  });

  it('doesnt allow people to call confirmPurchase with msg.value less than required', async () => {
    try {
      await freelancer.methods.confirmPurchase().send({
        from: accounts[1],
        value: web3.utils.toWei('0', 'ether')
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('doesnt allow seller to call abort when status=1(Locked)', async () => {
    await freelancer.methods.confirmPurchase().send({
      from: accounts[1],
      value: web3.utils.toWei(valuePassedToCreateFreelancer, 'ether')
    });
    const state = await freelancer.methods.state().call();
    assert.equal(1, state);

    try {
      await freelancer.methods.abort().send({
        from: accounts[0]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('doesnt allow seller to call abort when status=2(Inactive)', async () => {
    await freelancer.methods.abort().send({
      from: accounts[0]
    });
    const state = await freelancer.methods.state().call();
    assert.equal(2, state);

    try {
      await freelancer.methods.abort().send({
        from: accounts[0]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('doesnt allow not seller to call abort whenever', async () => {
    try {
      await freelancer.methods.abort().send({
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }

    await freelancer.methods.confirmPurchase().send({
      from: accounts[1],
      value: web3.utils.toWei(valuePassedToCreateFreelancer, 'ether')
    });
    const stateAfterConfirmPurchase = await freelancer.methods.state().call();
    assert.equal(1, stateAfterConfirmPurchase);

    try {
      await freelancer.methods.abort().send({
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }

    await freelancer.methods.confirmReceived().send({
      from: accounts[1]
    });
    const stateAfterConfirmReceived = await freelancer.methods.state().call();
    assert.equal(2, stateAfterConfirmReceived);

    try {
      await freelancer.methods.abort().send({
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }    
  });
});
