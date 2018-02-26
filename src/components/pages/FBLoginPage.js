import React from "react";
import FBLoginForm from "../forms/FBForm";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

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
