import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class FreelancerNew extends Component {
  state = {
    precioContratacion: '',
    descripcionTarea: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createFreelancer(this.state.descripcionTarea)
        .send({
          from: accounts[0],
          value: web3.utils.toWei((2 * this.state.precioContratacion).toString(), 'ether')
        });

      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create a freelancer contract</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Descripcion tarea que oferta</label>
            <Input
              value={this.state.descripcionTarea}
              onChange={event =>
                this.setState({ descripcionTarea: event.target.value })}
            />
          </Form.Field>                    

          <Form.Field>
            <label>Precio de contratacion</label>
            <Input
              label="ether"
              labelPosition="right"
              value={this.state.precioContratacion}
              onChange={event =>
                this.setState({ precioContratacion: event.target.value })}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default FreelancerNew;
