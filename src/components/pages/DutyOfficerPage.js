import React from 'react';
//import { connect } from "react-redux";
import UpdateDutyOfficerFrom from '../forms/DutyOfficerForm';
import { updateProfile } from '../../actions/auth';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class DutyOfficerPage extends React.Component {
  submit = data =>
    this.props
      .updateProfile(data)
      .then(() => this.props.history.push('/addAttendance'));

  render() {
    return (
      <div>
        <h1>Duty Officer Form</h1>
        <UpdateDutyOfficerFrom
          submit={this.submit}
          currentUser={this.props.currentUser}
        />
      </div>
    );
  }
}

DutyOfficerPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  updateProfile: PropTypes.func.isRequired
  //isAuth: PropTypes.bol.isRequired
};

function mapStateToProps(state) {
  return {};
}

export default connect(null, { updateProfile })(DutyOfficerPage);
