import React from 'react';
import { Icon, Table, Grid } from 'semantic-ui-react';

class TeacherDisplay extends React.Component {
  render() {
    const { teachers } = this.props.attendance;
    let id = 1;

    const displayTeacherRow = teachers.map(
      p =>
        p.checked ? (
          <Table.Row>
            <Table.Cell>{id++}</Table.Cell>
            <Table.Cell>{p.teacher_Name}</Table.Cell>
            <Table.Cell>Primary {p.primary}</Table.Cell>
            <Table.Cell>
              {p.relief ? (
                <Icon color="green" name="checkmark" size="large" />
              ) : (
                <Icon color="red" name="close" size="large" />
              )}
              {p.relief ? 'Yes' : 'No'}
            </Table.Cell>
          </Table.Row>
        ) : null
    );

    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Table unstackable size="large" color="orange" key="orange">
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
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default TeacherDisplay;
