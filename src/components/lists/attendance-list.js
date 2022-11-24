import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Icon, Table, Label, Popup } from 'semantic-ui-react';

class AttendanceList extends React.Component {
  render() {
    const { attendances } = this.props;

    const renderAttendanceRow = () => {
      return Object.keys(attendances).map(key => {
        const attendanceObj = attendances[key];
        let primaryStr = '';
        const primaryLevel = attendanceObj.primary.forEach(value => {
          primaryStr += 'P' + value + ', ';
        });

        return (
          <Table.Row key={key}>
            <Table.Cell onClick={() => this.props.onEdit(attendanceObj)}>
              {attendanceObj.branch}
            </Table.Cell>
            <Table.Cell onClick={() => this.props.onEdit(attendanceObj)}>
              {attendanceObj.teacher}{' '}
              {attendanceObj.relief && (
                <Icon fitted color="green" name="registered outline" />
              )}
            </Table.Cell>
            <Table.Cell onClick={() => this.props.onEdit(attendanceObj)}>
              {attendanceObj.subject}
            </Table.Cell>
            <Table.Cell onClick={() => this.props.onEdit(attendanceObj)}>
              {primaryStr.substring(0, primaryStr.length - 2)}
            </Table.Cell>
            <Table.Cell onClick={() => this.props.onDelete(attendanceObj)}>
              <Icon circular name="close" color="red" />
              Remove
            </Table.Cell>
          </Table.Row>
        );
      });
    };

    return (
      <Table striped celled unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Branch</Table.HeaderCell>
            <Table.HeaderCell>Teacher</Table.HeaderCell>
            <Table.HeaderCell>Subject</Table.HeaderCell>
            <Table.HeaderCell>Primary</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{renderAttendanceRow()}</Table.Body>
        <Table.Footer>
          <Table.Row textAlign="center">
            <Table.HeaderCell colSpan="5">
              {new Date().toDateString()}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}

AttendanceList.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

const mapStateToProps = ({ attendances }) => ({
  attendances
});

export default connect(mapStateToProps, null)(AttendanceList);
