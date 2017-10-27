import React from 'react';
//import PropTypes from "prop-types";
import { Grid, Form, Button, TextArea, Dropdown } from 'semantic-ui-react';
import InlineError from '../../messages/InlineError';
import { firebaseDb } from '../../../firebase';

class AttendanceForm extends React.Component {
  state = {
    data: {
      dutyOfficer: this.props.currentUser.displayName,
      branch: '',
      teacher: '',
      subject: 'English',
      classroomSetup: 'Yes',
      feedback: '',
      students: [],
      primarys: [],
      timestamp: ''
    },

    reliefTeacher: false,
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
    //this.getPrimaryChecked = this.getPrimaryChecked.bind(this);
    this.onChangeTeacher = this.onChangeTeacher.bind(this);
    this.onChangeRelief = this.onChangeRelief.bind(this);
    this.onChangePrimary = this.onChangePrimary.bind(this);
    this.onChange = this.onChange.bind(this);
    //this.reliefTeacherTB = this.reliefTeacherTB.bind(this);
  }

  componentDidMount() {
    this.retrieveBranchList();
    this.retrieveSubjectList();
  }

  retrieveBranchList = () => {
    var list = [];
    let BranchesRef = firebaseDb.ref('Branches');
    BranchesRef.on('value', data => {
      var branches = data.val();
      var keys = Object.keys(branches);

      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var branchName = branches[k].Branch_Name;
        list.push(branchName);
      }
      this.setState({ branches: list });
    });
  };

  retrieveSubjectList = () => {
    var list = [];
    let SubjectsRef = firebaseDb.ref('Subjects');
    SubjectsRef.on('value', data => {
      var subjects = data.val();
      var keys = Object.keys(subjects);

      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var subjectName = subjects[k].Subject_Name;
        list.push(subjectName);
      }
      this.setState({ subjects: list });
    });
  };

  retrieveTeacherList = branch => {
    var list = [];
    var TeacherRef = firebaseDb
      .ref('Teachers')
      .orderByChild('Branch')
      .equalTo(branch);
    TeacherRef.on('value', data => {
      var teachers = data.val();
      var keys = Object.keys(teachers);

      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var teacher = teachers[k].Name;
        list.push(teacher);
      }
      this.setState({ teachers: list });
    });
  };

  retrieveStudentList = branch => {
    var list = [];
    var getPrimaryList = [];
    var getPrimaryListBE = [];

    var studentsRef = firebaseDb
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
        list.push(student);

        //Push Unique Primary Level
        var primaryLevel = {
          primary: studentList[id].Primary,
          checked: true,
          teacher: '',
          relief: false
        };

        if (getPrimaryList.indexOf(studentList[id].Primary) === -1) {
          getPrimaryList.push(studentList[id].Primary);
          getPrimaryListBE.push(primaryLevel);
        }
      }

      this.setState({ data: { ...this.state.data, students: list } });
      this.setState({
        data: { ...this.state.data, primarys: getPrimaryListBE }
      });
      this.setState({ primaryLevels: getPrimaryList });
    });
  };

  onChange = e => {
    if (e.target.name === 'reliefTeacher') {
      this.setState({
        data: { ...this.state.data, teacher: e.target.value }
      });
    } else {
      this.setState({
        data: { ...this.state.data, [e.target.name]: e.target.value }
      });
    }
  };

  onChangeRelief = e => {
    var list = [];
    var getPriStatus = this.state.data.primarys;
    var keys = Object.keys(getPriStatus);

    for (var i = 0; i < keys.length; i++) {
      var id = keys[i];
      var pri = getPriStatus[id].primary;
      var refliefCheck = getPriStatus[id].relief;

      var primaryLevel = {};

      if (pri === e.target.name) {
        primaryLevel = {
          primary: pri,
          checked: getPriStatus[id].checked,
          teacher: e.target.value,
          relief: refliefCheck
        };
      } else {
        primaryLevel = {
          primary: pri,
          checked: getPriStatus[id].checked,
          teacher: getPriStatus[id].teacher,
          relief: refliefCheck
        };
      }

      list.push(primaryLevel);
    }

    this.setState({
      data: {
        ...this.state.data,
        primarys: list
      }
    });

    if (e.target.name === 'reliefTeacher') {
      this.setState({
        data: { ...this.state.data, teacher: e.target.value }
      });
    } else {
      this.setState({
        data: { ...this.state.data, [e.target.name]: e.target.value }
      });
    }
  };

  onChangePrimary = e => {
    var list = [];
    var getPriStatus = this.state.data.primarys;
    var keys = Object.keys(getPriStatus);

    for (var i = 0; i < keys.length; i++) {
      var id = keys[i];
      var pri = getPriStatus[id].primary;
      var currentCheck = getPriStatus[id].checked;

      var primaryLevel = {
        primary: pri,
        //Once is click from checked to uncheck and vice versa
        checked: pri === e.target.name ? !currentCheck : currentCheck,
        teacher: currentCheck ? '' : getPriStatus[id].teacher,
        relief: currentCheck ? false : getPriStatus[id].relief
      };

      list.push(primaryLevel);
    }

    this.setState({
      data: {
        ...this.state.data,
        primarys: list
      }
    });
  };

  onChangeBranch = e => {
    this.setState({
      data: {
        ...this.state.data,
        students: [],
        teacher: '',
        branch: e.target.value
      },
      teachers: []
    });

    if (e.target.value.length > 0) {
      this.retrieveStudentList(e.target.value);
      this.retrieveTeacherList(e.target.value);
    }
  };

  // onChangeTeacher = e => {
  //   if (e.target.value === "Other") {
  //     this.setState({
  //       data: { ...this.state.data, [e.target.name]: "" }
  //     });
  //
  //     this.setState({
  //       reliefTeacher: true
  //     });
  //   } else {
  //     this.setState({
  //       data: { ...this.state.data, [e.target.name]: e.target.value }
  //     });
  //     this.setState({
  //       reliefTeacher: false
  //     });
  //   }
  // };

  onChangeTeacher = e => {
    var list = [];
    var getPriStatus = this.state.data.primarys;
    var keys = Object.keys(getPriStatus);

    for (var i = 0; i < keys.length; i++) {
      var id = keys[i];
      var pri = getPriStatus[id].primary;
      var refliefCheck = getPriStatus[id].relief;

      var primaryLevel = {};

      if (pri === e.target.name) {
        primaryLevel = {
          primary: pri,
          checked: getPriStatus[id].checked,
          teacher: e.target.value === 'Other' ? '' : e.target.value,
          relief: e.target.value === 'Other' ? !refliefCheck : refliefCheck
        };
      } else {
        primaryLevel = {
          primary: pri,
          checked: getPriStatus[id].checked,
          teacher: getPriStatus[id].teacher,
          relief: refliefCheck
        };
      }

      list.push(primaryLevel);
    }

    this.setState({
      data: {
        ...this.state.data,
        primarys: list
      }
    });
  };

  onChangeRelief = e => {
    var list = [];
    var getPriStatus = this.state.data.primarys;
    var keys = Object.keys(getPriStatus);

    for (var i = 0; i < keys.length; i++) {
      var id = keys[i];
      var pri = getPriStatus[id].primary;
      var refliefCheck = getPriStatus[id].relief;

      var primaryLevel = {};

      if (pri === e.target.name) {
        primaryLevel = {
          primary: pri,
          checked: getPriStatus[id].checked,
          teacher: e.target.value,
          relief: refliefCheck
        };
      } else {
        primaryLevel = {
          primary: pri,
          checked: getPriStatus[id].checked,
          teacher: getPriStatus[id].teacher,
          relief: refliefCheck
        };
      }

      list.push(primaryLevel);
    }

    this.setState({
      data: {
        ...this.state.data,
        primarys: list
      }
    });
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
    }
  };

  validate = data => {
    const errors = {};
    if (!data.branch) errors.branch = "Branch can't be blank";

    //if (!data.teacher) errors.teacher = "Teacher can't be blank";

    //if ((data.teacher === "Other") & !this.state.reliefTeacher)
    //  errors.reliefTeacher = "Can't be blank";

    if (!data.subject) errors.subject = "Subject can't be blank";
    return errors;
  };

  getPrimaryChecked = primary => {
    var getPriStatus = this.state.data.primarys;
    var checked = true;
    var keys = Object.keys(getPriStatus);
    for (var i = 0; i < keys.length; i++) {
      var id = keys[i];
      var pri = getPriStatus[id].primary;
      var currentCheck = getPriStatus[id].checked;
      if (pri === primary) {
        checked = currentCheck;
      }
    }
    return checked;
  };

  reliefTeacherTB = p => {
    const reliefDisplay =
      p.relief || p.checked ? (
        <Form.Field>
          <label htmlFor={'P' + p.primary + 'reliefTeacher'}>
            {'P' + p.primary + ' '} Relief Teacher
          </label>
          <input
            type="text"
            id={'P' + p.primary + 'reliefTeacher'}
            name={p.primary}
            placeholder={'Name of P ' + p.primary + ' Relief Teacher'}
            value={p.teacher}
            onChange={this.onChangeRelief}
          />
        </Form.Field>
      ) : null;

    return reliefDisplay;
  };

  render() {
    const {
      data,
      errors,
      loading,
      teachers,
      subjects,
      branches,
      primaryLevels
    } = this.state;

    let teacherOptions = teachers.map(t => {
      return (
        <option key={t} value={t}>
          {t}
        </option>
      );
    });

    let subjectOptions = subjects.map(s => {
      return (
        <Form.Field
          key={s}
          label={s}
          control="input"
          type="radio"
          name="subject"
          value={s}
          checked={s === this.state.data.subject}
          onChange={this.onChange}
        />
      );
    });

    let branchOptions = branches.map(b => {
      return (
        <option key={b} value={b}>
          {b}
        </option>
      );
    });

    let primaryOptions = primaryLevels.map(p => {
      return (
        <Form.Field
          key={p}
          label={'P' + p}
          control="input"
          type="checkbox"
          name={p}
          value={p}
          checked={this.getPrimaryChecked(p)}
          onChange={this.onChangePrimary}
        />
      );
    });

    let teacherInput = data.primarys.map(p => {
      var primary = p.primary;
      const teacherDisplay = p.checked ? (
        <Form.Field>
          <label htmlFor={'P' + primary + 'teacher'}>
            {'P' + primary + ' '}Teacher
          </label>
          <select
            ref={'P' + primary + 'teacher'}
            id={'P' + primary + 'teacher'}
            name={primary}
            onChange={this.onChangeTeacher}
          >
            {p.teacher ? (
              <option key={p.teacher} value={p.teacher}>
                {p.teacher}
              </option>
            ) : (
              <option key="" value="" />
            )}
            {teacherOptions}
            <option key="Other:Relief_Teacher" value="Other">
              Other: Relief Teacher
            </option>
          </select>
        </Form.Field>
      ) : null;

      return teacherDisplay;
    });

    let reliefTeacherInput = data.primarys.map(p => {
      var primary = p.primary;
      const reliefTeacherTB = p.relief ? (
        <Form.Field>
          <label htmlFor="reliefTeacher">
            {'P' + primary + ' Relief Teacher'}
          </label>
          <input
            type="text"
            id={'P' + primary + 'reliefTeacher'}
            name={primary}
            placeholder="Name of Relief Teacher"
            value={p.teacher}
            onChange={this.onChangeRelief}
          />
        </Form.Field>
      ) : null;

      return reliefTeacherTB;
    });

    // const reliefTeacherTB = this.state.reliefTeacher ? (
    //   <Form.Field error={!!errors.refliefTeacher}>
    //     <label htmlFor="reliefTeacher">Relief Teacher</label>
    //     <input
    //       type="text"
    //       id="reliefTeacher"
    //       name="reliefTeacher"
    //       placeholder="Name of Relief Teacher"
    //       value={data.teacher}
    //       onChange={this.onChange}
    //     />
    //   </Form.Field>
    // ) : null;

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
                  readOnly
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
                  {data.branch ? (
                    <option key={data.branch} value={data.branch}>
                      {data.branch}
                    </option>
                  ) : (
                    <option key="" value="" />
                  )}
                  {branchOptions}
                </select>
                {errors.branch && <InlineError text={errors.branch} />}
              </Form.Field>

              <Form.Field error={!!errors.subject}>
                <label htmlFor="subject">Subject</label>
                <Form.Group>{subjectOptions}</Form.Group>
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
                <label htmlFor="feedback">Comment/Feedback</label>
                <TextArea
                  id="feedback"
                  name="feedback"
                  value={data.feedback}
                  placeholder="Comment/Feedback"
                  onChange={this.onChange}
                />
              </Form.Field>

              <Form.Field>
                <label htmlFor="primary">Primary</label>
                <Form.Group>{primaryOptions}</Form.Group>
              </Form.Field>

              {teacherInput}
              {reliefTeacherInput}

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
