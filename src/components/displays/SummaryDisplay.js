import React from 'react';
import { Icon, Table, Grid, Label } from 'semantic-ui-react';
import _ from 'lodash';

class SummaryDisplay extends React.Component {
  state = {
    data: [],
    grandTotal: 0
  };

  componentDidMount() {
    const { attendance } = this.props;
    this.generateAttendance(attendance.primary, attendance.students);
  }

  generateAttendance = (primary, students) => {
    let present = 0;
    let late = 0;
    let absent = 0;
    let mc = 0;
    let na = 0;
    let total = 0;
    let subTotalPresent = 0;
    let subTotalNA = 0;
    let subTotalLate = 0;
    let subTotalAbsent = 0;
    let subTotalMC = 0;
    const list = [];

    primary.forEach(primaryLevel => {
      students.forEach(student => {
        if (primaryLevel === student.Primary) {
          if (student.Status === 'Present') present += 1;
          else if (student.Status === 'Late') late += 1;
          else if (student.Status === 'Absent') absent += 1;
          else if (student.Status === 'MC') mc += 1;
          else na += 1;
          // Total Student of the primary
          total += 1;
        }
      });

      const studentStat = {
        primary: primaryLevel,
        present,
        late,
        absent,
        mc,
        na,
        total
      };
      list.push(studentStat);

      // Calculate the sub total of individual status
      subTotalPresent += present;
      subTotalLate += late;
      subTotalAbsent += absent;
      subTotalMC += mc;
      subTotalNA += na;
      // Reset
      present = 0;
      late = 0;
      absent = 0;
      mc = 0;
      na = 0;
      total = 0;
    });

    const gtotal = {
      tp: subTotalPresent,
      tl: subTotalLate,
      ta: subTotalAbsent,
      tmc: subTotalMC,
      tna: subTotalNA
    };
    this.setState({ data: list, grandTotal: gtotal });
  };

  render() {
    const { attendance } = this.props;
    const { data, grandTotal } = this.state;
    const displayClass = _.join(attendance.classNo, ' & ');

    const displayStatisticsRow = data.map(p => (
      <Table.Row key={p.primary}>
        <Table.Cell>
          Primary {p.primary}{' '}
          {attendance.branch === 'Fernvale' && p.primary === '5'
            ? `Class ${displayClass}`
            : ''}
        </Table.Cell>
        <Table.Cell>{p.present}</Table.Cell>
        <Table.Cell>{p.late}</Table.Cell>
        <Table.Cell>{p.absent}</Table.Cell>
        <Table.Cell>{p.mc}</Table.Cell>
        <Table.Cell>{p.na}</Table.Cell>
      </Table.Row>
    ));

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Label as="a" color="black" size="huge" ribbon>
              Basic Information:
            </Label>

            <Table stackable size="large" color="black" key="black">
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    Teacher{attendance.relief ? ' (Relief)' : ''}:
                  </Table.Cell>
                  <Table.Cell>
                    <b>{attendance.teacher}</b>{' '}
                    <i>{attendance.relief ? '(Yes)' : ''}</i>
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    Branch{attendance.batch ? ' (Batch)' : ''}:
                  </Table.Cell>
                  <Table.Cell>
                    <b>{attendance.branch}</b> <i>{attendance.batch || ''}</i>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Subject:</Table.Cell>
                  <Table.Cell>
                    <b>{attendance.subject}</b>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Date & Time:</Table.Cell>
                  <Table.Cell>
                    <b>{attendance.timestamp}</b>
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
              stackable
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
                  <Table.HeaderCell>{`M.C.`}</Table.HeaderCell>
                  <Table.HeaderCell>{`N.A.`}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {displayStatisticsRow}
                <Table.Row>
                  <Table.Cell positive>
                    <b>Grand Total</b>
                  </Table.Cell>
                  <Table.Cell positive>
                    <b>{grandTotal.tp}</b>
                  </Table.Cell>
                  <Table.Cell positive>
                    <b>{grandTotal.tl}</b>
                  </Table.Cell>
                  <Table.Cell positive>
                    <b>{grandTotal.ta}</b>
                  </Table.Cell>
                  <Table.Cell positive>
                    <b>{grandTotal.tmc}</b>
                  </Table.Cell>
                  <Table.Cell positive>
                    <b>{grandTotal.tna}</b>
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
            <Table stackable size="large" color="red" key="red">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    Are the classroom setup properly?{' '}
                    {attendance.classroomSetup === 'Yes' ? (
                      <Icon color="green" name="checkmark" size="large" />
                    ) : (
                      <Icon color="red" name="close" size="large" />
                    )}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              {attendance.feedback ? (
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>{attendance.feedback}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ) : null}
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default SummaryDisplay;
