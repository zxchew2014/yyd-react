import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FBLoginForm from '../forms/FBForm';
import { login } from '../../actions/auth';

class FBLoginPage extends React.Component {
  submit = () => {
    this.props.login();
  };

  render() {
    return (
      <div>
        <FBLoginForm submit={this.submit} />
      </div>
    );
  }
}

FBLoginPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  login: PropTypes.func.isRequired
};

export default connect(null, { login })(FBLoginPage);
