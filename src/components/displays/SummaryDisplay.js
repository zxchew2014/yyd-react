import React from 'react';
import { Icon, Table, Segment } from 'semantic-ui-react';

class SummaryDisplay extends React.Component {
  state = {
    data: [],
    grandTotal: 0
  };

  componentDidMount() {
    this.generateAttendance(
      this.props.attendance.teachers,
      this.props.attendance.students
    );
  }

  generateAttendance = (teachers, students) => {
    console.log(teachers);
    var present = 0;
    var absent = 0;
    var mc = 0;
    var total = 0;
    var subTotalPresent = 0;
    var subTotalAbsent = 0;
    var subTotalMC = 0;
    var primary = '';
    var list = [];

    teachers.map(p => {
      if (p.checked) {
        primary = p.primary;

        for (var i = 0; i < students.length; i++) {
          if (primary === students[i].primary) {
            if (students[i].status === 'Present') present++;
            else if (students[i].status === 'Absent') absent++;
            else mc++;
            //Total Student of the primary
            total++;
          }
        }
        var studentStat = {
          primary: primary,
          present: present,
          absent: absent,
          mc: mc,
          total: total
        };
        list.push(studentStat);

        //Calucate the sub total of individual status
        subTotalPresent += present;
        subTotalAbsent += absent;
        subTotalMC += mc;
        //Reset
        present = absent = mc = total = 0;
      }
    });
    var gtotal = {
      tp: subTotalPresent,
      ta: subTotalAbsent,
      tmc: subTotalMC
    };
    this.setState({ data: list, grandTotal: gtotal });
  };

  render() {
    const {
      dutyOfficer,
      subject,
      branch,
      feedback,
      classroomSetup
    } = this.props.attendance;

    const { data, grandTotal } = this.state;
    var id = 1;
    let displayStatisticsRow = data.map(p => {
      return (
        <Table.Row>
          <Table.Cell>{id++}</Table.Cell>
          <Table.Cell>Primary {p.primary}</Table.Cell>
          <Table.Cell>{p.present}</Table.Cell>
          <Table.Cell>{p.absent}</Table.Cell>
          <Table.Cell>{p.mc}</Table.Cell>
          <Table.Cell>{p.total}</Table.Cell>
        </Table.Row>
      );
    });

    return (
      <div>
        <Segment.Group size="huge">
          <Segment.Group horizontal>
            <Segment color="black">
              Duty Officer: <b>{dutyOfficer}</b>
            </Segment>
            <Segment color="black">
              Branch: <b>{branch}</b>
            </Segment>
            <Segment color="black">
              Subject: <b>{subject}</b>
            </Segment>
            <Segment color="black">
              Date & Time: <b>{new Date().toLocaleString('en-GB')}</b>
            </Segment>
          </Segment.Group>
          <Segment>
            Student Attendance Statistics: <b>{grandTotal.tp}</b>/<b>{grandTotal.ta}</b>/<b>{grandTotal.tmc}</b>{' '}
            Students
          </Segment>
          <Segment.Group>
            <Segment color="yellow">
              <Table celled textAlign="center">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>SN.</Table.HeaderCell>
                    <Table.HeaderCell>Primary</Table.HeaderCell>
                    <Table.HeaderCell>Number of Present</Table.HeaderCell>
                    <Table.HeaderCell>Number of Absent</Table.HeaderCell>
                    <Table.HeaderCell>Number of MC</Table.HeaderCell>
                    <Table.HeaderCell>Total Students</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>{displayStatisticsRow}</Table.Body>
              </Table>
            </Segment>
          </Segment.Group>
          <Segment>Feedback:</Segment>
          <Segment.Group>
            <Segment color="yellow">
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      Are the classroom setup properly?
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      {classroomSetup === 'Yes' ? (
                        <Icon color="green" name="checkmark" size="large" />
                      ) : (
                        <Icon color="red" name="close" size="large" />
                      )}
                      {feedback}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Segment>
          </Segment.Group>
        </Segment.Group>
      </div>
    );
  }
}

export default SummaryDisplay;
