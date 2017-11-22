import React from 'react';
import { Icon, Table, Segment } from 'semantic-ui-react';

class TeacherDisplay extends React.Component {
  render() {
    const { teachers } = this.props.attendance;
    var id = 1;

    let displayTeacherRow = teachers.map(p => {
      return p.checked ? (
        <Table.Row>
          <Table.Cell>{id++}</Table.Cell>
          <Table.Cell>{p.teacher_Name}</Table.Cell>
          <Table.Cell>Primary {p.primary}</Table.Cell>
          <Table.Cell>
            {p.relief
              ? (<Icon color="green" name="checkmark" size="large" />, 'YES')
              : (<Icon color="red" name="close" size="large" />, 'NO')}
          </Table.Cell>
        </Table.Row>
      ) : null;
    });

    return (
      <div>
        <Segment color="red" size="huge">
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>SN.</Table.HeaderCell>
                <Table.HeaderCell>Teacher Name</Table.HeaderCell>
                <Table.HeaderCell>Incharge-Of</Table.HeaderCell>
                <Table.HeaderCell>Relief Teacher?</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{displayTeacherRow}</Table.Body>
          </Table>
        </Segment>
      </div>
    );
  }
}

export default TeacherDisplay;
