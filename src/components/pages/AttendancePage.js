import React from 'react';
//import { Link } from "react-router-dom";
//import { connect } from "react-redux";
import AttendanceForm from '../forms/AttendanceForm';

class AttendancePage extends React.Component {
  render() {
    return (
      <div>
        <h1>Add Attendance</h1>
        <AttendanceForm submit={this.submit} />
      </div>
    );
  }
}

export default AttendancePage;
