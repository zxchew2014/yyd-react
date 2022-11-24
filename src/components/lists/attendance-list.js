import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Icon, Table, Label } from 'semantic-ui-react';

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
          <Table.Row key={key} onClick={() => this.props.onEdit(attendanceObj)}>
            <Table.Cell>{attendanceObj.branch}</Table.Cell>
            <Table.Cell>
              {attendanceObj.teacher}{' '}
              {attendanceObj.relief && (
                <Icon fitted color="green" name="registered outline" />
              )}
            </Table.Cell>
            <Table.Cell>{attendanceObj.subject}</Table.Cell>
            <Table.Cell>
              {primaryStr.substring(0, primaryStr.length - 2)}
            </Table.Cell>
          </Table.Row>
        );
      });
    };

    return (
      <Table striped unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Branch</Table.HeaderCell>
            <Table.HeaderCell>Teacher</Table.HeaderCell>
            <Table.HeaderCell>Subject</Table.HeaderCell>
            <Table.HeaderCell>Primary</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{renderAttendanceRow()}</Table.Body>
        <Table.Footer>
          <Table.Row textAlign="center">
            <Table.HeaderCell colSpan="4">
              {new Date().toDateString()}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}

AttendanceList.propTypes = {
  onEdit: PropTypes.func
};

const mapStateToProps = ({ attendances }) => ({
  attendances
});

export default connect(mapStateToProps, null)(AttendanceList);
