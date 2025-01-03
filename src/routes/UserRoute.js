import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const UserRoute = ({ user, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (JSON.stringify(user) === JSON.stringify({})) === false ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      )
    }
  />
);

UserRoute.propTypes = {
  component: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

function mapStateToProps({ user }) {
  return {
    user
  };
}

export default connect(mapStateToProps)(UserRoute);
