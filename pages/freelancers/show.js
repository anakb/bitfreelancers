import React, { Component } from 'react';
import { Card, Grid, Button, Form, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Freelancer from '../../ethereum/freelancer';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class FreelancerShow extends Component {
  state = {
    loading: false,
    errorMessage: ''
  };

  static async getInitialProps(props) {
    const freelancer = Freelancer(props.query.address);

    const summary = await freelancer.methods.getSummary().call();

    return {
      address: props.query.address,
      seller: summary[0],
      buyer: summary[1],
      tarea: summary[2],      
      value: summary[3],
      contractState: summary[4]
    };
  }

  onAbort = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const freelancer = Freelancer(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await freelancer.methods.abort().send({
        from: accounts[0]
      });

      Router.pushRoute(`/freelancers/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };  

  onConfirmPurchase = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const freelancer = Freelancer(this.props.address);
      const accounts = await web3.eth.getAccounts();
      const summary = await freelancer.methods.getSummary().call();
      await freelancer.methods.confirmPurchase().send({
        from: accounts[0],
        value: (2 * summary[3]).toString()
      });
   
      Router.pushRoute(`/freelancers/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  onConfirmReceived = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const freelancer = Freelancer(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await freelancer.methods.confirmReceived().send({
        from: accounts[0]
      });
     
      Router.pushRoute(`/freelancers/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  renderCards() {
    const {
      seller,
      buyer,
      tarea,
      value,
      contractState
    } = this.props;

    const items = [
      {
        header: seller,
        meta: 'Direccion del freelancer',
        description:
          'El freelancer crea un contrato como oferta de servicio profesional. Su direccion es la manera de ser identificado',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: buyer,
        meta: 'Direccion del cliente',
        description:
          'El cliente contrata al freelancer mediante un smart contract para que le haga un trabajo del tipo ofertado. Su direccion es la manera de ser identificado',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: tarea,
        meta: 'Tarea',
        description:
          'Descripcion de la tarea (servicio profesional) para la que el freelancer se ofrece'
      },
      {
        header: web3.utils.fromWei(value, 'ether'),
        meta: 'Precio (ether)',
        description:
          'Importe que el freelancer cobra por el trabajo que ofrece'
      },
      {
        header: contractState,
        meta: 'Estado del contrato',
        description:
          '0=Creado 1=Bloqueado 2=Inactivo'
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Freelancer Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderCards()}
            </Grid.Column>
            <Grid.Column width={6}>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Form onSubmit={this.onAbort} error={!!this.state.errorMessage}>
                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button loading={this.state.loading} primary>FREELANCER: Abortar contrato</Button>                
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Form onSubmit={this.onConfirmPurchase} error={!!this.state.errorMessage}>
                <Button loading={this.state.loading} primary>CLIENTE: Confirmar contratacion</Button>                
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Form onSubmit={this.onConfirmReceived} error={!!this.state.errorMessage}>
                <Button loading={this.state.loading} primary>CLIENTE: Dar conformidad trabajo recibido</Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default FreelancerShow;
