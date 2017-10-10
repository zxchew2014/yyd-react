import React from 'react';
import { Menu } from 'semantic-ui-react';
import { logout } from '../../actions/auth';

function Header({ appName, user, onLogout }) {
  function renderUserData() {
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
