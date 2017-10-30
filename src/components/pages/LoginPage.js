import React from 'react';
//import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import LoginForm from '../forms/LoginForm';
import { login } from '../../actions/auth';
import PropTypes from 'prop-types';

class LoginPage extends React.Component {
  submit = data => {
    console.log('Test : ' + data);
    this.props.login(data).then(() => this.props.history.push('/'));
  };

  //Parent of LoginForm
  render() {
    return (
      <div>
        <h1>Login Page</h1>
        <LoginForm submit={this.submit} />
      </div>
    );
  }
}

LoginPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  login: PropTypes.func.isRequired
};

export default connect(null, { login })(LoginPage);
