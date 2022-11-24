import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Icon, Table, Label } from 'semantic-ui-react';
import * as action_attendance from '../../actions/attendances';
import { Redirect } from 'react-router-dom';
import AttendanceList from '../lists/attendance-list';

class ViewAttendancePage extends React.Component {
  UNSAFE_componentWillMount() {
    const { fetchAttendances } = this.props;
    fetchAttendances();
  }

  onCreate = () => {
    const { history } = this.props;
    history.push(`/attendance/add`);
  };

  onEdit = data => {
    const { history, fetchAttendance } = this.props;
    fetchAttendance(data);
    history.push(`/attendance/edit`);
  };

  render() {
    const { attendances } = this.props;
    if (attendances === null) {
      return <Redirect to="/attendance/add" />;
    } else {
      return (
        <div>
          <Button attached="top" color="green" onClick={() => this.onCreate()}>
            <Icon name="plus" />
            Mark Attendance
          </Button>
          <AttendanceList onEdit={this.onEdit} />
        </div>
      );
    }
  }
}

ViewAttendancePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  fetchAttendances: PropTypes.func.isRequired
};

const mapStateToProps = ({ attendances }) => ({
  attendances
});

export default connect(mapStateToProps, action_attendance)(ViewAttendancePage);
