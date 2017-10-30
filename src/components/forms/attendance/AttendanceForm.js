import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Form, Button, TextArea } from 'semantic-ui-react';
import InlineError from '../../messages/InlineError';
import { firebaseDb } from '../../../firebase';

class AttendanceForm extends React.Component {
  state = {
    data: {
      dutyOfficer: this.props.currentUser.displayName,
      branch: '',
      subject: 'English',
      classroomSetup: 'Yes',
      feedback: '',
      students: [],
      primarys: [],
      timestamp: ''
    },
    studentList: [],
    statusList: [],
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
    this.onChangeStudent = this.onChangeStudent.bind(this);
    this.onChangeRelief = this.onChangeRelief.bind(this);
    this.onChangePrimary = this.onChangePrimary.bind(this);
    this.filterStudentList = this.filterStudentList.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.retrieveBranchList();
    this.retrieveSubjectList();
    this.retrieveStatusList();
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

  retrieveStatusList = () => {
    var list = [];
    let StatesRef = firebaseDb.ref('States').orderByKey();
    StatesRef.on('value', data => {
      var states = data.val();
      var keys = Object.keys(states);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var statusName = states[k].status;
        list.push(statusName);
      }
    });
    this.setState({ statusList: list });
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

      this.setState({ studentList: list });
      this.setState({
        data: { ...this.state.data, primarys: getPrimaryListBE, students: list }
      });
      this.setState({ primaryLevels: getPrimaryList });
    });
  };

  onChangePrimary = e => {
    var list = [];
    var studentsList = [];

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

      var studentFinalList = primaryLevel.checked
        ? this.filterStudentList(studentsList, pri, currentCheck)
        : studentFinalList;

      list.push(primaryLevel);
    }

    this.setState({
      data: {
        ...this.state.data,
        primarys: list,
        students: studentFinalList ? studentFinalList : []
      }
    });
  };

  filterStudentList = (studentlist, primaryLvl, check1st) => {
    var currentStudentList = this.state.data.students;
    var originalStudentList = this.state.studentList;

    var keysOfCSL = Object.keys(currentStudentList);
    var keysOfOSL = Object.keys(originalStudentList);

    if (check1st) {
      for (var i = 0; i < keysOfCSL.length; i++) {
        var id = keysOfCSL[i];
        var primary = currentStudentList[id].primary;
        if (primary === primaryLvl) {
          var ids = currentStudentList[id].id;
          var student = {
            id: ids,
            name: currentStudentList[id].name,
            primary: primary,
            status: currentStudentList[id].status
          };
          studentlist.push(student);
        }
      }
    } else {
      for (var i = 0; i < keysOfOSL.length; i++) {
        var id = keysOfOSL[i];
        var primary = originalStudentList[id].primary;
        if (primary === primaryLvl) {
          var ids = originalStudentList[id].id;
          var student = {
            id: ids,
            name: originalStudentList[id].name,
            primary: primary,
            status: originalStudentList[id].status
          };
          studentlist.push(student);
        }
      }
    }

    return studentlist;
  };

  onChange = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
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

  onChangeStudent = e => {
    var list = [];
    var getStudentList = this.state.data.students;
    var keys = Object.keys(getStudentList);

    for (var i = 0; i < keys.length; i++) {
      var id = keys[i];

      var ids = getStudentList[id].id;
      var studentName = getStudentList[id].name;
      var priLvl = getStudentList[id].primary;
      var status = getStudentList[id].status;

      var checked = 'status_' + studentName;

      var student = {};
      student = {
        id: ids,
        name: studentName,
        status: checked === e.target.name ? e.target.value : status,
        primary: priLvl
      };
      list.push(student);
    }

    this.setState({
      data: {
        ...this.state.data,
        students: list
      }
    });
  };

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
          relief: e.target.value === 'Other' ? true : false
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
      this.setState({
        data: { ...this.state.data, timestamp: new Date().toLocaleString() }
      });

      this.setState({ loading: true });
      this.props.submit(this.state.data);
      // .catch(err =>
      //   this.setState({ errors: err.response.data.errors, loading: false })
      // );
    }
  };

  validate = data => {
    const errors = {};
    if (!data.branch) errors.branch = "Branch can't be blank";

    if (data.branch) {
      var primary = false;
      data.primarys.map(p => {
        if (p.checked) {
          primary = p.checked;
          if (p.relief) {
            if (!p.teacher) {
              errors['p' + p.primary + 'Rteacher'] =
                'P' + p.primary + " Relief Teacher can't be blank";
              errors['p' + p.primary + 'teacher'] = null;
            }
          } else {
            if (!p.teacher)
              errors['p' + p.primary + 'teacher'] =
                'P' + p.primary + " Teacher can't be blank";
          }
        }
      });
      if (!primary) {
        errors.primary = 'At least select 1 primary';
      }
    }

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

  render() {
    const {
      data,
      errors,
      loading,
      teachers,
      subjects,
      branches,
      primaryLevels,
      statusList
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

    var counter = 1;
    //ORIGINAL CODE
    let studentList = data.students.map(s => {
      const studentlist = (
        <Form.Field>
          <label htmlFor={s.name}>
            {counter++ + '. ' + s.name + ' - P' + s.primary}
          </label>
          <Form.Group>
            {statusList.map(st => {
              return (
                <Form.Field
                  key={st}
                  label={st}
                  control="input"
                  type="radio"
                  name={'status_' + s.name}
                  value={st}
                  checked={st === s.status}
                  onChange={this.onChangeStudent}
                />
              );
            })}
          </Form.Group>
        </Form.Field>
      );
      return studentlist;
    });

    let teacherInput = data.primarys.map(p => {
      var primary = p.primary;
      const teacherDisplay = p.checked ? (
        <Form.Field error={!!errors['p' + primary + 'teacher']}>
          <label htmlFor={'P' + primary + 'teacher'}>
            {'P' + primary + ' '}Teacher
          </label>
          <select
            ref={'P' + primary + 'teacher'}
            id={'P' + primary + 'teacher'}
            name={primary}
            onChange={this.onChangeTeacher}
          >
            {p.teacher && !p.relief ? (
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
          {errors['p' + primary + 'teacher'] && (
            <InlineError text={errors['p' + primary + 'teacher']} />
          )}
        </Form.Field>
      ) : null;

      return teacherDisplay;
    });

    let reliefTeacherInput = data.primarys.map(p => {
      var primary = p.primary;
      const reliefTeacherTB = p.relief ? (
        <Form.Field error={!!errors['p' + primary + 'Rteacher']}>
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
          {errors['p' + primary + 'Rteacher'] && (
            <InlineError text={errors['p' + primary + 'Rteacher']} />
          )}
        </Form.Field>
      ) : null;

      return reliefTeacherTB;
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
              {data.branch ? (
                <Form.Field error={!!errors.primary}>
                  <label htmlFor="primary">Primary</label>
                  <Form.Group>{primaryOptions}</Form.Group>
                  {errors.primary && <InlineError text={errors.primary} />}
                </Form.Field>
              ) : null}
              {teacherInput}
              {reliefTeacherInput}
              <Button primary>Submit</Button>
            </Grid.Column>

            <Grid.Column>
              <Form.Field>
                <label htmlFor="studentList">
                  <u>Student List</u>
                </label>
                {studentList}
              </Form.Field>
              <br />
              {data.branch ? <Button primary>Submit</Button> : null}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}

AttendanceForm.propTypes = {
  submit: PropTypes.func.isRequired
};

export default AttendanceForm;
