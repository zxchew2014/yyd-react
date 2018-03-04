import React from 'react';
import { Icon, Table, Grid, Label } from 'semantic-ui-react';

class SummaryDisplay extends React.Component {
  state = {
    data: [],
    grandTotal: 0
  };

  componentDidMount() {
    this.generateAttendance(
      this.props.attendance.primary,
      this.props.attendance.students
    );
  }

  generateAttendance = (primary, students) => {
    var present = 0;
    var late = 0;
    var absent = 0;
    var mc = 0;
    var total = 0;
    var subTotalPresent = 0;
    var subTotalLate = 0;
    var subTotalAbsent = 0;
    var subTotalMC = 0;
    var primaryLevel = '';
    var list = [];

    for (var p = 0; p < primary.length; p++) {
      primaryLevel = primary[p];

      for (var i = 0; i < students.length; i++) {
        if (primaryLevel === students[i].primary) {
          if (students[i].status === 'Present') present++;
          else if (students[i].status === 'Late') late++;
          else if (students[i].status === 'Absent') absent++;
          else mc++;
          //Total Student of the primary
          total++;
        }
      }
      var studentStat = {
        primary: primaryLevel,
        present: present,
        late: late,
        absent: absent,
        mc: mc,
        total: total
      };
      list.push(studentStat);

      //Calucate the sub total of individual status
      subTotalPresent += present;
      subTotalLate += late;
      subTotalAbsent += absent;
      subTotalMC += mc;
      //Reset
      present = late = absent = mc = total = 0;
    }
    var gtotal = {
      tp: subTotalPresent + subTotalLate,
      ta: subTotalAbsent,
      tmc: subTotalMC
    };
    this.setState({ data: list, grandTotal: gtotal });
  };

  render() {
    const {
      teacher,
      subject,
      branch,
      feedback,
      relief,
      batch,
      classroomSetup
    } = this.props.attendance;

    const { data, grandTotal } = this.state;

    let displayStatisticsRow = data.map(p => {
      return (
        <Table.Row>
          <Table.Cell>Primary {p.primary}</Table.Cell>
          <Table.Cell>{p.present}</Table.Cell>
          <Table.Cell>{p.late}</Table.Cell>
          <Table.Cell>{p.absent}</Table.Cell>
          <Table.Cell>{p.mc}</Table.Cell>
        </Table.Row>
      );
    });

    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Label as="a" color="black" size="huge" ribbon>
                Basic Information:
              </Label>
              <Table unstackable size="large" color="black" key="black">
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      Teacher{' ('}Relief{')'}:
                    </Table.Cell>
                    <Table.Cell>
                      <b>{teacher}</b> <i>{relief ? '(Yes)' : ''}</i>
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>
                      Branch{' ('}Batch{')'}:
                    </Table.Cell>
                    <Table.Cell>
                      <b>{branch}</b> <i>{batch ? batch : ''}</i>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Subject:</Table.Cell>
                    <Table.Cell>
                      <b>{subject}</b>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Date & Time:</Table.Cell>
                    <Table.Cell>
                      <b>{new Date().toLocaleString('en-GB')}</b>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Label as="a" color="teal" size="huge" ribbon>
                Student Attendance Statistics:
              </Label>
              <Table
                unstackable
                textAlign="center"
                size="large"
                color="teal"
                key="teal"
              >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Primary</Table.HeaderCell>
                    <Table.HeaderCell>Present</Table.HeaderCell>
                    <Table.HeaderCell>Late</Table.HeaderCell>
                    <Table.HeaderCell>Absent</Table.HeaderCell>
                    <Table.HeaderCell>M.C.</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {displayStatisticsRow}
                  <Table.Row>
                    <Table.Cell positive>
                      <b>Grand Total</b>
                    </Table.Cell>
                    <Table.Cell colSpan="2" positive>
                      <b>{grandTotal.tp}</b>
                    </Table.Cell>
                    <Table.Cell positive>
                      <b>{grandTotal.ta}</b>
                    </Table.Cell>
                    <Table.Cell positive>
                      <b>{grandTotal.tmc}</b>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Label as="a" color="red" size="huge" ribbon>
                Feedback:
              </Label>
              <Table unstackable size="large" color="red" key="red">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      Are the classroom setup properly?{' '}
                      {classroomSetup === 'Yes' ? (
                        <Icon color="green" name="checkmark" size="large" />
                      ) : (
                        <Icon color="red" name="close" size="large" />
                      )}
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                {feedback ? (
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>{feedback}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ) : null}
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default SummaryDisplay;
