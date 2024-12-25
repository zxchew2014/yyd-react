import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as action_attendance from '../../../actions/attendances';
import EditAttendanceForm from '../../forms/attendance/edit';

class EditAttendancePage extends React.Component {
  onBack = () => {
    const { history, clearAttendance } = this.props;
    clearAttendance();
    history.push(`/attendance`);
  };

  render() {
    const { attendance, history } = this.props;
    if (attendance === null) {
      this.onBack();
    }

    return (
      <div key={`edit-${attendance.id}`} className="edit-attendance-container">
        <h1>Edit Class Attendance</h1>
        <EditAttendanceForm onBack={this.onBack} />
        <hr />
      </div>
    );
  }
}

EditAttendancePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

const mapStateToProps = ({ attendance }) => ({
  attendance
});

export default connect(mapStateToProps, action_attendance)(EditAttendancePage);
