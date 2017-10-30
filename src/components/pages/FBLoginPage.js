import React from 'react';
import FBLoginForm from '../forms/FBForm';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import { connect } from 'react-redux';

class FBLoginPage extends React.Component {
  submit = data => {
    this.props.login(data);
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
