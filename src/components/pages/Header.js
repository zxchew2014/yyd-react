import React from 'react';
import { Menu } from 'semantic-ui-react';
import { logout } from '../../actions/auth';

function Header({ user }) {
  function renderUserData() {
    console.log('Logged IN');
    return (
      <Menu.Menu position="right">
        {user.displayName ? (
          <Menu.Item name={user.displayName} />
        ) : (
          <Menu.Item name={user.phoneNumber} />
        )}

        <Menu.Item
          name="logout"
          active="logout"
          onClick={() => {
            logout();
          }}
        />
      </Menu.Menu>
    );
  }

  function renderLoginButton() {
    console.log('Logged OUT');

    return (
      <Menu.Menu position="right">
        <Menu.Item name="login" active="login" />
      </Menu.Menu>
    );
  }

  return (
    <Menu pointing secondary>
      {user ? renderUserData() : renderLoginButton()}
    </Menu>
  );
}

export default Header;
