import React, { Component } from 'react';
import web3 from '../ethereum/web3';

class AccountSelectedInfo extends Component {
  state = {
    balance: 0,
    account: undefined
  };


  async componentDidMount() {

    var account = (await web3.eth.getAccounts())[0];

    web3.currentProvider.publicConfigStore.on('update', async function (event) {
        this.setState({
            account: event.selectedAddress.toLowerCase()
        }, () => {
            this.load();
        });
    }.bind(this));

    this.setState({
        account: account.toLowerCase()
    }, () => {
        this.load();
    });
  }

  async getBalance() {
    let weiBalance = await web3.eth.getBalance(this.state.account);
    this.setState({
        balance: weiBalance
    });
  }  

  async load() {
    this.getBalance();
  }

  render() {
    return (
      <div>
          <p>Your current account info:</p>
          <p>Address: <strong>{this.state.account}</strong></p>
          <p>Balance: <strong>{this.state.balance} wei</strong></p>
      </div>
    );
  }
}

export default AccountSelectedInfo;
