import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const GuestRoute = ({ user, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (JSON.stringify(user) === JSON.stringify({})) === true ? (
        <Component {...props} />
      ) : !user.displayName ? (
        <Redirect to="/profile/update" />
      ) : (
        <Redirect to="/attendance" />
      )
    }
  />
);

GuestRoute.propTypes = {
  component: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(GuestRoute);
