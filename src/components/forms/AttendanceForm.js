import React from 'react';
//import PropTypes from "prop-types";
import { Grid, Form, Button, TextArea } from 'semantic-ui-react';
//import Validator from "validator";
import InlineError from '../messages/InlineError';
import { firebaseDb } from '../../firebase';

//ar currentBranch = "";

class AttendanceForm extends React.Component {
  state = {
    data: {
      dutyOfficer: '',
      branch: '',
      teacher: [],
      subject: '',
      classroomSetup: 'Yes',
      feedback: '',
      students: [],
      timestamp: ''
    },
    reliefTeacher: '',
    studentList: [],
    branches: [],
    subjects: [],
    primaryLevels: [],
    teachers: [],
    loading: false,
    errors: {}
  };

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeTeacher = this.onChangeTeacher.bind(this);
    this.onChangeBranch = this.onChangeBranch.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.retrieveBranchList();
    this.retrieveSubjectList();
    this.retrieveTeacherList();
  }

  retrieveBranchList = () => {
    let BranchesRef = firebaseDb.ref('Branches');
    BranchesRef.on('value', data => {
      var branches = data.val();
      var keys = Object.keys(branches);

      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var branchName = branches[k].Branch_Name;
        this.setState({ branches: this.state.branches.concat([branchName]) });
      }
    });
  };

  retrieveSubjectList = () => {
    let SubjectsRef = firebaseDb.ref('Subjects');
    SubjectsRef.on('value', data => {
      var subjects = data.val();
      var keys = Object.keys(subjects);

      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var subjectName = subjects[k].Subject_Name;
        this.setState({ subjects: this.state.subjects.concat([subjectName]) });
      }
    });
  };
  retrieveTeacherList = () => {
    let TeacherRef = firebaseDb.ref('Teachers');
    TeacherRef.on('value', data => {
      var teachers = data.val();
      var keys = Object.keys(teachers);

      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var teacher = teachers[k].Name;
        this.setState({ teachers: this.state.teachers.concat([teacher]) });
      }
    });
  };

  retrieveStudentList = branch => {
    this.setState({
      data: {
        ...this.state.data,
        branch: branch
      }
    });

    let studentsRef = firebaseDb
      .ref('Students')
      .orderByChild('Branch')
      .equalTo(branch);

    studentsRef.on('value', data => {
      var studentList = data.val();
      var keys = Object.keys(studentList);

      for (var i = 0; i < keys.length; i++) {
        var id = keys[i];
        var student = {
          id: id,
          name: studentList[id].Name,
          primary: studentList[id].Primary,
          status: 'Present'
        };

        this.setState({
          data: {
            ...this.state.data,
            students: this.state.data.students.concat([student])
          }
        });
      }
    });
  };

  onChange = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });
  };

  onChangeBranch = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });

    if (e.target.name === 'branch' && e.target.value.length > 0) {
      this.retrieveStudentList(e.target.value);
    } else {
      this.setState({
        data: {
          ...this.state.data,
          students: []
        }
      });
    }
  };

  onChangeTeacher = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });

    if (e.target.value === 'Other') {
    } else {
    }
  };

  onSubmit = e => {
    e.preventDefault();
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.setState({ loading: true });
      this.props
        .submit(this.state.data)
        .catch(err =>
          this.setState({ errors: err.response.data.errors, loading: false })
        );
      // const AttendanceRef = firebaseDb.ref("Attendance");
      //
      // let datas = { ...this.state.data };
      // datas.timestamp = new Date();
      // this.setState({ datas });
      //
      // console.log(this.state.data.timestamp);
      //
      // const attendance = {
      //   dutyOfficer: this.state.data.dutyOfficer,
      //   branch: this.state.data.branch,
      //   teacher: this.state.data.teacher,
      //   subject: this.state.data.subject,
      //   classroomSetup: this.state.data.classroomSetup,
      //   feedback: this.state.data.feedback,
      //   timestamp: this.state.data.timestamp
      // };

      // AttendanceRef.push(attendance);
      // this.setState(prevState => ({
      //   data: {
      //     ...prevState.data,
      //     dutyOfficer: "",
      //     branch: "",
      //     teacher: "",
      //     subject: "",
      //     classroomSetup: "",
      //     feedback: "",
      //     timestamp: ""
      //   }
      // }));
    }
  };

  validate = data => {
    const errors = {};
    if (!data.branch) errors.branch = "Branch can't be blank";
    if (!data.teacher) errors.teacher = "Teacher can't be blank";
    if ((data.teacher === 'Other') & !this.state.reliefTeacher)
      errors.reliefTeacher = "Can't be blank";
    if (!data.subject) errors.subject = "Subject can't be blank";
    return errors;
  };

  render() {
    const { data, errors, loading } = this.state;

    let teacherOptions = this.state.teachers.map(t => {
      return (
        <option key={t} value={t}>
          {t}
        </option>
      );
    });

    let subjectOptions = this.state.subjects.map(s => {
      return (
        <Form.Field
          key={s}
          label={s}
          control="input"
          type="radio"
          name="subject"
          value={s}
          onChange={this.onChange}
        />
      );
    });

    let branchOptions = this.state.branches.map(b => {
      return (
        <option key={b} value={b}>
          {b}
        </option>
      );
    });

    return (
      <Form onSubmit={this.onSubmit} loading={loading} size="huge" key="huge">
        <Grid divided="horizontally" relaxed>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Form.Field error={!!errors.dutyOfficer}>
                <label htmlFor="dutyOfficer">Duty Officer</label>
                <input
                  type="text"
                  id="dutyOfficer"
                  name="dutyOfficer"
                  placeholder="Name of Duty Officer"
                  value={data.dutyOfficer}
                  onChange={this.onChange}
                />
              </Form.Field>
              <Form.Field error={!!errors.branch}>
                <label htmlFor="branch">Branch</label>
                <select
                  ref="branch"
                  name="branch"
                  id="branch"
                  onChange={this.onChangeBranch}
                >
                  <option key="" value="" />
                  {branchOptions}
                </select>
                {errors.branch && <InlineError text={errors.branch} />}
              </Form.Field>
              <Form.Field error={!!errors.subject}>
                <label htmlFor="subject">Subject</label>
                <Form.Group>{subjectOptions}</Form.Group>
              </Form.Field>
              <Form.Field error={!!errors.teacher}>
                <label htmlFor="teacher">Teacher</label>
                <select
                  ref="teacher"
                  id="teacher"
                  name="teacher"
                  onChange={this.onChangeTeacher}
                >
                  <option key="" value="" />
                  {teacherOptions}
                  <option key="Other:Relief_Teacher" value="Other">
                    Other: Relief Teacher
                  </option>
                </select>
              </Form.Field>

              <Form.Field error={!!errors.refliefTeacher}>
                <label htmlFor="reliefTeacher">Relief Teacher</label>
                <input
                  type="text"
                  id="reliefTeacher"
                  name="reliefTeacher"
                  placeholder="Name of Relief Teacher"
                  value={this.state.reliefTeacher}
                  onChange={this.onChange}
                />
              </Form.Field>

              <Form.Field>
                <label htmlFor="classroomSetup">
                  Are the classroom setup properly?
                </label>
                <Form.Group inline>
                  <Form.Field
                    label="Yes"
                    control="input"
                    type="radio"
                    name="classroomSetup"
                    value="Yes"
                    checked={data.classroomSetup === 'Yes'}
                    onChange={this.onChange}
                  />
                  <Form.Field
                    label="No"
                    control="input"
                    type="radio"
                    name="classroomSetup"
                    value="No"
                    checked={data.classroomSetup === 'No'}
                    onChange={this.onChange}
                  />
                </Form.Group>
              </Form.Field>
              <Form.Field>
                <label htmlFor="feebback">Comment/Feedback</label>
                <TextArea
                  id="feedback"
                  name="feedback"
                  value={data.feedback}
                  placeholder="Comment/Feedback"
                  onChange={this.onChange}
                />
              </Form.Field>

              <Button primary>Submit</Button>
            </Grid.Column>

            <Grid.Column>
              <Form.Field>
                <label htmlFor="studentList">Student List</label>
              </Form.Field>

              {JSON.stringify(data)}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}
export default AttendanceForm;
