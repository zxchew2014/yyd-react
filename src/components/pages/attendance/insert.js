import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AttendanceForm from '../../forms/attendance/insert';
import * as attendances from '../../../actions/attendances';

class AddAttendancePage extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onBack = () => {
    const { history, clearAttendance } = this.props;
    clearAttendance();
    history.push(`/attendance`);
  };

  submit = data => {
    const { submitAttendance, addAttendance, history } = this.props;

    data.timestamp = new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Singapore'
    });

    addAttendance(data);
    /*
      Let the page to refresh from initial stage
      Explaination: This method takes an optional parameter which by default is set to false.
      If set to true, the browser will do a complete page refresh from the server and not from the cached version of the page.
       */
    history.push(`/attendance`);
    //window.location.reload(false);
  };

  render() {
    const { user, attendance } = this.props;

    return [
      <div>
        <h1>Add Class Attendance</h1>
        <AttendanceForm
          submit={this.submit}
          onBack={this.onBack}
          currentUser={user}
          attendance={attendance}
        />
      </div>
    ];
  }
}

const mapStateToProps = ({ user, attendance }) => ({
  user,
  attendance
});

AttendancePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  submitAttendance: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.object).isRequired,
  attendance: PropTypes.objectOf(PropTypes.object).isRequired
};

export default connect(mapStateToProps, attendances)(AddAttendancePage);
