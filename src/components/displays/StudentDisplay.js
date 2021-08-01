import React from 'react';
import { Icon, Table, Grid } from 'semantic-ui-react';
import { formatStudentName } from '../../utils/util';

class StudentDisplay extends React.Component {
  displayState = status => {
    if (status === 'Present')
      return <Icon color="green" name="checkmark" size="large" />;
    else if (status === 'Late')
      return <Icon color="red" name="checkmark" size="large" />;
    else if (status === 'Absent')
      return <Icon color="red" name="close" size="large" />;
    return <Icon color="orange" name="hashtag" size="large" />;
  };

  render() {
    const { students } = this.props.attendance;
    let checkBatch = false;
    let id = 1;

    const displayStudentRow = students.map(student => {
      const studentName = _.trim(student.Name);
      const newStudentName = formatStudentName(studentName);

      if (student.Batch) checkBatch = true;

      return (
        <Table.Row key={student.Id}>
          <Table.Cell>{id++}</Table.Cell>
          <Table.Cell>{newStudentName}</Table.Cell>
          <Table.Cell>Primary {student.Primary}</Table.Cell>
          {student.Batch ? (
            <Table.Cell>Batch {student.Batch}</Table.Cell>
          ) : (
            <Table.Cell />
          )}
          <Table.Cell>
            {this.displayState(student.Status)} {student.Status}
          </Table.Cell>
        </Table.Row>
      );
    });

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Table stackable size="large" color="yellow" key="yellow">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>S.N.</Table.HeaderCell>
                  <Table.HeaderCell>Student Name</Table.HeaderCell>
                  <Table.HeaderCell>Primary</Table.HeaderCell>
                  <Table.HeaderCell>Batch</Table.HeaderCell>
                  <Table.HeaderCell>Attendance Status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>{displayStudentRow}</Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default StudentDisplay;
