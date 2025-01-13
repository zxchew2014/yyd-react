import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Table } from 'semantic-ui-react';

class AttendanceList extends React.Component {
  render() {
    const { attendances } = this.props;
    const firstAttendance = attendances[Object.keys(attendances)[0]];

    const renderAttendanceRow = () => {
      return Object.keys(attendances).map(key => {
        const attendanceObj = attendances[key];

        let primaryStr = '';
        let groupStr = '';
        if(attendanceObj.level === "Primary") {
            attendanceObj.primary.forEach(value => {
                primaryStr += 'P' + value + ', ';
            });
        }
        else{
            attendanceObj.group.forEach(value => {
                groupStr += value + ", ";
            });
        }
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
              {
                  attendanceObj.level === 'Primary' ?
                      <Table.Cell onClick={() => this.props.onEdit(attendanceObj)}>
                          {primaryStr.substring(0, primaryStr.length - 2)}
                      </Table.Cell>
                      :
                      [
                          <Table.Cell onClick={() => this.props.onEdit(attendanceObj)}>
                              {attendanceObj.secondary}
                          </Table.Cell>,
                          <Table.Cell onClick={() => this.props.onEdit(attendanceObj)}>
                              {groupStr.substring(0, groupStr.length - 2)}
                          </Table.Cell>
                      ]
              }

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
              {
                  firstAttendance.level === 'Primary' ?  <Table.HeaderCell>Primary</Table.HeaderCell> :
                      [
                          <Table.HeaderCell>Secondary</Table.HeaderCell>,
                          <Table.HeaderCell>Group</Table.HeaderCell>
                      ]
              }

            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{renderAttendanceRow()}</Table.Body>
        <Table.Footer>
          <Table.Row textAlign="center">
            <Table.HeaderCell colSpan={firstAttendance.level === 'Primary' ? "5" : "6"}>
                * Click on the row to edit * <br/>
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
