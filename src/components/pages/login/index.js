import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FirebaseLogin from '../../forms/login/index';
import { login } from '../../../actions/auth';

class FirebaseLoginPage extends React.Component {
  submit = () => {
    this.props.login();
  };

  render() {
    return (
      <div>
        <FirebaseLogin submit={this.submit} />
      </div>
    );
  }
}

FirebaseLoginPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  login: PropTypes.func.isRequired
};

export default connect(null, { login })(FirebaseLoginPage);