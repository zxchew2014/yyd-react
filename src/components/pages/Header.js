import React from 'react';
import { Menu } from 'semantic-ui-react';
import * as actions from '../../actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function Header({ user, logout }) {
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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { logout: actions.logout })(Header);
