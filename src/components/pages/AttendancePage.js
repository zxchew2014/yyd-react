import React from 'react';
import PropTypes from 'prop-types';
import AttendanceForm from '../forms/attendance/AttendanceForm';
import { connect } from 'react-redux';

class AttendancePage extends React.Component {
  submit = data => {
    console.log(data);
    //window.location.reload();
    //window.location.href = "/summary";
    this.props.history.push('/summary');
  };

  render() {
    console.log('AP : ' + JSON.stringify(this.props.user));
    return (
      <div>
        <h1>Add Attendance</h1>
        <AttendanceForm submit={this.submit} currentUser={this.props.user} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

AttendancePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  addAttendance: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(AttendancePage);
