import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';
import AccountSelectedInfo from '../components/AccountSelectedInfo';

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link route="/">
        <a className="item">BitFreelancers</a>
      </Link>

      <Menu.Menu position="right">
        <p className="item"><AccountSelectedInfo /></p>
      </Menu.Menu>
    </Menu>
  );
};
