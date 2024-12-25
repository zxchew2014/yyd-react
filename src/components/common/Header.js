import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import * as actions from '../../actions/auth';
import { VERSION_DATE, VERSION_NO } from '../../utils/common';

function Header({ user, logout }) {
  function renderUserData() {
    return [
      <Menu.Menu position="left" key={'menu-user-left'}>
        <Menu.Item name="version" active>
          Updated since {VERSION_DATE} {VERSION_NO}
        </Menu.Item>
      </Menu.Menu>,
      <Menu.Menu position="right" key={'menu-user-right'}>
        {user.displayName ? (
          <Menu.Item name={user.displayName} />
        ) : (
          <Menu.Item name={user.phoneNumber} />
        )}

        <Menu.Item
          name="logout"
          active
          onClick={() => {
            logout();
          }}
        />
      </Menu.Menu>
    ];
  }

  function renderLoginButton() {
    return [
      <Menu.Menu position="left" key={'menu-login-left'}>
        <Menu.Item name="version" active>
          Updated since {VERSION_DATE} {VERSION_NO}
        </Menu.Item>
      </Menu.Menu>,
      <Menu.Menu position="right" key={'menu-login-right'}>
        <Menu.Item name="login" active />
      </Menu.Menu>
    ];
  }

  return (
    <Menu pointing secondary key={'main-menu'}>
      {JSON.stringify(user) === JSON.stringify({})
        ? renderLoginButton()
        : renderUserData()}
    </Menu>
  );
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

Header.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { logout: actions.logout })(Header);
