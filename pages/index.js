import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class FreelancerIndex extends Component {
  static async getInitialProps() {
    const freelancers = await factory.methods.getDeployedFreelancers().call();

    return { freelancers };
  }

  renderFreelancers() {
    const items = this.props.freelancers.map(address => {
      return {
        header: address,
        meta: (
          <Link route={`/freelancers/${address}`}>
            <a>View freelancer contract</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Freelancer contracts</h3>

          <Link route="/freelancers/new">
            <a>
              <Button
                floated="right"
                content="Create freelancer contract"
                icon="add circle"
                primary
              />
            </a>
          </Link>
          {this.renderFreelancers()}
        </div>
      </Layout>
    );
  }
}

export default FreelancerIndex;
