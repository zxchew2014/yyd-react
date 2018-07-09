import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AttendanceForm from '../forms/attendance';
import * as attendances from '../../actions/attendances';

class AttendancePage extends React.Component {
  submit = data => {
    const { submitAttendance } = this.props;
    data.timestamp = new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Singapore'
    });
    submitAttendance(data);
    this.props.history.push('/summary');
  };

  render() {
    const { user, attendance } = this.props;

    return (
      <div>
        <h1>Add Class Attendance</h1>
        <AttendanceForm
          submit={this.submit}
          currentUser={user}
          attendance={attendance}
        />
      </div>
    );
  }
}

function mapStateToProps({ user, attendance }) {
  return {
    user,
    attendance
  };
}

AttendancePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  submitAttendance: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  attendance: PropTypes.object.isRequired
};

export default connect(mapStateToProps, attendances)(AttendancePage);
