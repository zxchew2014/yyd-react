import React from 'react';
import { Icon, Table, Segment } from 'semantic-ui-react';

class StudentDisplay extends React.Component {
  render() {
    const { students } = this.props.attendance;
    var id = 1;

    let displayStudentRow = students.map(p => {
      return (
        <Table.Row>
          <Table.Cell>{id++}</Table.Cell>
          <Table.Cell>{p.name}</Table.Cell>
          <Table.Cell>Primary {p.primary}</Table.Cell>
          <Table.Cell>
            {p.status === 'Present' ? (
              <Icon color="green" name="checkmark" size="large" />
            ) : p.status === 'Absent' ? (
              <Icon color="red" name="close" size="large" />
            ) : (
              <Icon color="orange" name="attention" size="large" />
            )}{' '}
            {p.status}
          </Table.Cell>
        </Table.Row>
      );
    });

    return (
      <div>
        <Segment color="blue" size="huge">
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>SN.</Table.HeaderCell>
                <Table.HeaderCell>Student Name</Table.HeaderCell>
                <Table.HeaderCell>Primary</Table.HeaderCell>
                <Table.HeaderCell>Attendance Status</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{displayStudentRow}</Table.Body>
          </Table>
        </Segment>
      </div>
    );
  }
}

export default StudentDisplay;
