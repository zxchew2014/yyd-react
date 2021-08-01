import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import * as actions from '../../actions/auth';
import { VERSION_DATE, VERSION_NO } from '../../utils/common';

function Header({ user, logout }) {
  function renderUserData() {
    return [
      <Menu.Menu position="left">
        <Menu.Item name="version" active="version">
          Updated since {VERSION_DATE} {VERSION_NO}
        </Menu.Item>
      </Menu.Menu>,
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
    ];
  }

  function renderLoginButton() {
    return [
      <Menu.Menu position="left">
        <Menu.Item name="version" active="version">
          Updated since {VERSION_DATE} {VERSION_NO}
        </Menu.Item>
      </Menu.Menu>,
      <Menu.Menu position="right">
        <Menu.Item name="login" active="login" />
      </Menu.Menu>
    ];
  }

  return (
    <Menu pointing secondary>
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
