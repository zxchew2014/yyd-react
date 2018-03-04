import React from 'react';
import { Icon, Table, Grid } from 'semantic-ui-react';

class StudentDisplay extends React.Component {
  displayState = status => {
    if (status === 'Present')
      return <Icon color="green" name="checkmark" size="large" />;
    else if (status === 'Late')
      return <Icon color="red" name="checkmark" size="large" />;
    else if (status === 'Absent')
      return <Icon color="red" name="close" size="large" />;
    else return <Icon color="orange" name="hashtag" size="large" />;
  };

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
            {this.displayState(p.status)} {p.status}
          </Table.Cell>
        </Table.Row>
      );
    });

    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Table unstackable size="huge" color="yellow" key="yellow">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>S.N.</Table.HeaderCell>
                    <Table.HeaderCell>Student Name</Table.HeaderCell>
                    <Table.HeaderCell>Primary</Table.HeaderCell>
                    <Table.HeaderCell>Attendance Status</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>{displayStudentRow}</Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default StudentDisplay;
