import React from "react";
import PropTypes from "prop-types";
import AttendanceForm from "../forms/attendance/attendance";
import { connect } from "react-redux";
import { submitattendance } from "../../actions/attendances";

class AttendancePage extends React.Component {
  submit = data => {
    this.props.submitattendance(data);
    this.props.history.push("/summary");
  };

  render() {
    return (
      <div>
        <h1>Add Attendance(New List)</h1>
        <AttendanceForm
          submit={this.submit}
          currentUser={this.props.user}
          attendance={this.props.attendance}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    attendance: state.attendance
  };
}

AttendancePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  submitattendance: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  attendance: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { submitattendance })(AttendancePage);
