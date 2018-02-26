import React from "react";
import PropTypes from "prop-types";
import { Grid, Form, Button, TextArea } from "semantic-ui-react";
import InlineError from "../../messages/InlineError";
import { firebaseDb } from "../../../firebase";
import { retrieveBranch } from "../../../actions/attendances";

class AttendanceForm extends React.Component {
  state = {
    data: {
      dutyOfficer: this.props.currentUser.displayName,
      branch: "",
      subject: "English",
      classroomSetup: "Yes",
      feedback: "",
      students: [],
      teachers: [],
      timestamp: ""
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
    this.onChangeBatch = this.onChangeBatch.bind(this);
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
    if (JSON.stringify(this.props.attendance) !== JSON.stringify({})) {
      const { attendance } = this.props;
      this.retrieveTeacherList(attendance.branch);
      this.retrieveStudentList(attendance.branch, attendance.batch);

      this.setState({
        data: {
          ...this.state.data,
          dutyOfficer: attendance.dutyOfficer,
          branch: attendance.branch,
          batch: attendance.batch ? attendance.batch : undefined,
          subject: attendance.subject,
          classroomSetup: attendance.classroomSetup,
          feedback: attendance.feedback,
          students: attendance.students,
          teachers: attendance.teachers
        }
      });
    }
  }

  retrieveBranchList = () => {
    const list = retrieveBranch();
    this.setState({ branches: list });
  };

  retrieveStatusList = () => {
    const list = [];
    const StatesRef = firebaseDb.ref("States").orderByKey();
    StatesRef.on("value", data => {
      const states = data.val();
      const keys = Object.keys(states);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const statusName = states[k].status;
        list.push(statusName);
      }
    });
    this.setState({ statusList: list });
  };

  retrieveSubjectList = () => {
    const list = [];
    const SubjectsRef = firebaseDb.ref("Subjects");
    SubjectsRef.on("value", data => {
      const subjects = data.val();
      const keys = Object.keys(subjects);

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const subjectName = subjects[k].Subject_Name;
        list.push(subjectName);
      }
      list.sort();
      this.setState({ subjects: list });
    });
  };

  retrieveTeacherList = branch => {
    const list = [];
    const TeacherRef = firebaseDb
      .ref(`Teacher_Allocation/${  branch}`)
      .orderByChild("Name");

    TeacherRef.on("value", data => {
      const teachers = data.val();
      const keys = Object.keys(teachers);

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const teacher = teachers[k].Name;
        list.push(teacher);
      }
      list.sort();
      this.setState({ teachers: list });
    });
  };

  retrieveStudentList = (branch, batch = null) => {
    const list = [];
    const getPrimaryList = [];
    const getPrimaryListBE = [];

    const studentsRef = firebaseDb
      .ref("Students")
      .orderByChild("Branch")
      .equalTo(branch);

    studentsRef.on("value", data => {
      const studentList = data.val();
      let keys = [];

      if (studentList === null) {
        this.setState({ errors: this.validateWithBranch(branch) });
      } else {
        this.setState({ errors: {} });
        keys = Object.keys(studentList);

        let batchCheck = false;
        for (let i = 0; i < keys.length; i++) {
          const id = keys[i];
          if (batch === studentList[id].Batch || batch === null) {
            batchCheck = true;
          } else {
            batchCheck = false;
          }

          if (batchCheck) {
            const pri = studentList[id].Primary;
            const student = {
              id,
              name: studentList[id].Name,
              primary: pri,
              status: "Present"
            };
            list.push(student);

            // Push Unique Primary Level
            const primaryLevel = {
              primary: studentList[id].Primary,
              checked: true,
              teacher_Name: "",
              relief: false
            };

            if (getPrimaryList.indexOf(studentList[id].Primary) === -1) {
              getPrimaryList.push(studentList[id].Primary);
              getPrimaryListBE.push(primaryLevel);
            }
          }
        }

        this.setState({
          primaryLevels: getPrimaryList,
          studentList: list,
          data: {
            ...this.state.data,
            teachers: getPrimaryListBE,
            students: list,
            branch,
            batch: batch === null ? undefined : batch
          }
        });
      }
    });
  };

  onChangePrimary = e => {
    const list = [];
    const studentsList = [];

    const getPriStatus = this.state.data.teachers;
    const keys = Object.keys(getPriStatus);

    for (let i = 0; i < keys.length; i++) {
      const id = keys[i];
      const pri = getPriStatus[id].primary;
      const currentCheck = getPriStatus[id].checked;

      const primaryLevel = {
        primary: pri,
        // Once is click from checked to uncheck and vice versa
        checked: pri === e.target.name ? !currentCheck : currentCheck
      };

      primaryLevel.teacher_Name = primaryLevel.checked
        ? getPriStatus[id].teacher_Name
        : "";
      primaryLevel.relief = primaryLevel.checked
        ? getPriStatus[id].relief
        : false;

      var studentFinalList = primaryLevel.checked
        ? this.filterStudentList(studentsList, pri, currentCheck)
        : studentFinalList;

      list.push(primaryLevel);
    }

    this.setState({
      data: {
        ...this.state.data,
        teachers: list,
        students: studentFinalList || []
      }
    });
  };

  filterStudentList = (studentlist, primaryLvl, check1st) => {
    const currentStudentList = this.state.data.students;
    const originalStudentList = this.state.studentList;

    const keysOfCSL = Object.keys(currentStudentList);
    const keysOfOSL = Object.keys(originalStudentList);

    if (check1st) {
      for (var i = 0; i < keysOfCSL.length; i++) {
        var id = keysOfCSL[i];
        var primary = currentStudentList[id].primary;
        if (primary === primaryLvl) {
          var ids = currentStudentList[id].id;
          var student = {
            id: ids,
            name: currentStudentList[id].name,
            primary,
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
            primary,
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
    const list = [];
    const getPriStatus = this.state.data.primarys;
    const keys = Object.keys(getPriStatus);

    for (let i = 0; i < keys.length; i++) {
      const id = keys[i];
      const pri = getPriStatus[id].primary;
      const refliefCheck = getPriStatus[id].relief;

      let primaryLevel = {};

      if (pri === e.target.name) {
        primaryLevel = {
          primary: pri,
          checked: getPriStatus[id].checked,
          teacher_Name: e.target.value,
          relief: refliefCheck
        };
      } else {
        primaryLevel = {
          primary: pri,
          checked: getPriStatus[id].checked,
          teacher_Name: getPriStatus[id].teacher,
          relief: refliefCheck
        };
      }

      list.push(primaryLevel);
    }

    this.setState({
      data: {
        ...this.state.data,
        teachers: list
      }
    });

    // if (e.target.name === "reliefTeacher") {
    //   this.setState({
    //     data: { ...this.state.data, teacher_Name: e.target.value }
    //   });
    // } else {
    //   this.setState({
    //     data: { ...this.state.data, [e.target.name]: e.target.value }
    //   });
    // }
  };

  onChangeBranch = e => {
    if (e.target.value.length > 0) {
      this.setState({
        data: {
          ...this.state.data,
          students: [],
          teachers: [],
          dutyOfficer: this.props.currentUser.displayName,
          branch: e.target.value
        },
        teachers: []
      });

      if (e.target.value === "Punggol") {
        this.retrieveStudentList(e.target.value, "1"); // Default batch: 1
      } else {
        this.retrieveStudentList(e.target.value); // Default batch: null
      }

      this.retrieveTeacherList(e.target.value);
    }
  };

  onChangeBatch = e => {
    this.setState({
      data: {
        ...this.state.data,
        students: [],
        teachers: []
      },
      teachers: []
    });
    this.retrieveStudentList("Punggol", e.target.value); // Default branch: "Punggol"
    this.retrieveTeacherList("Punggol");
  };

  onChangeStudent = e => {
    const list = [];
    const getStudentList = this.state.data.students;
    const keys = Object.keys(getStudentList);

    for (let i = 0; i < keys.length; i++) {
      const id = keys[i];

      const ids = getStudentList[id].id;
      const studentName = getStudentList[id].name;
      const priLvl = getStudentList[id].primary;
      const status = getStudentList[id].status;

      const checked = `status_${  studentName}`;

      let student = {};
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
    const list = [];
    const getPriStatus = this.state.data.teachers;
    const keys = Object.keys(getPriStatus);

    for (let i = 0; i < keys.length; i++) {
      const id = keys[i];
      const pri = getPriStatus[id].primary;
      const refliefCheck = getPriStatus[id].relief;

      let primaryLevel = {};

      if (pri === e.target.name) {
        primaryLevel = {
          primary: pri,
          checked: getPriStatus[id].checked,
          teacher_Name: e.target.value === "Other" ? "" : e.target.value,
          relief: e.target.value === "Other"
        };
      } else {
        primaryLevel = {
          primary: pri,
          checked: getPriStatus[id].checked,
          teacher_Name: getPriStatus[id].teacher_Name,
          relief: refliefCheck
        };
      }

      list.push(primaryLevel);
    }

    this.setState({
      data: {
        ...this.state.data,
        teachers: list
      }
    });
  };

  onChangeRelief = e => {
    const list = [];
    const getPriStatus = this.state.data.teachers;
    const keys = Object.keys(getPriStatus);

    for (let i = 0; i < keys.length; i++) {
      const id = keys[i];
      const pri = getPriStatus[id].primary;
      const refliefCheck = getPriStatus[id].relief;

      let primaryLevel = {};

      if (pri === e.target.name) {
        primaryLevel = {
          primary: pri,
          checked: getPriStatus[id].checked,
          teacher_Name: e.target.value,
          relief: refliefCheck
        };
      } else {
        primaryLevel = {
          primary: pri,
          checked: getPriStatus[id].checked,
          teacher_Name: getPriStatus[id].teacher_Name,
          relief: refliefCheck
        };
      }

      list.push(primaryLevel);
    }

    this.setState({
      data: {
        ...this.state.data,
        teachers: list
      }
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.setState({
        loading: true
      });

      this.props.submit(this.state.data);
    }
  };

  validate = data => {
    const errors = {};
    if (!data.branch) errors.branch = "Branch can't be blank";
    if (data.branch) {
      let primary = false;
      data.teachers.map(p => {
        if (p.checked) {
          primary = p.checked;
          if (p.relief) {
            if (!p.teacher_Name) {
              errors[`p${  p.primary  }Rteacher`] =
                `P${  p.primary  } Relief Teacher can't be blank`;
              errors[`p${  p.primary  }teacher`] = null;
            }
          } else if (!p.teacher_Name)
              errors[`p${  p.primary  }teacher`] =
                `P${  p.primary  } Teacher can't be blank`;
        }
      });
      if (!primary) {
        errors.primary = "At least select 1 primary";
      }
    }

    if (!data.subject) errors.subject = "Subject can't be blank";
    return errors;
  };

  validateWithBranch = branch => {
    const errors = {};
    errors.students = `No student data in ${  branch  } branch`;
    return errors;
  };

  getPrimaryChecked = primary => {
    const getPriStatus = this.state.data.teachers;
    let checked = true;
    const keys = Object.keys(getPriStatus);
    for (let i = 0; i < keys.length; i++) {
      const id = keys[i];
      const pri = getPriStatus[id].primary;
      const currentCheck = getPriStatus[id].checked;
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

    const teacherOptions = teachers.map(t => (
        <option key={t} value={t}>
          {t}
        </option>
      ));

    const subjectOptions = subjects.map(s => (
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
      ));

    const branchOptions = branches.map(b => (
        <option key={b} value={b}>
          {b}
        </option>
      ));

    const primaryOptions = primaryLevels.map(p => (
        <Form.Field
          key={p}
          label={`P${  p}`}
          control="input"
          type="checkbox"
          name={p}
          value={p}
          checked={this.getPrimaryChecked(p)}
          onChange={this.onChangePrimary}
        />
      ));

    let counter = 1;
    // ORIGINAL CODE
    const studentList = data.students.map(s => {
      const studentlist = (
        <Form.Field>
          <label htmlFor={s.name}>
            {`${counter++  }. ${  s.name  } - P${  s.primary}`}
          </label>
          <Form.Group>
            {statusList.map(st => (
                <Form.Field
                  key={st}
                  label={st}
                  control="input"
                  type="radio"
                  name={`status_${  s.name}`}
                  value={st}
                  checked={st === s.status}
                  onChange={this.onChangeStudent}
                />
              ))}
          </Form.Group>
        </Form.Field>
      );
      return studentlist;
    });

    const teacherInput = errors.students
      ? null
      : data.branch
        ? data.teachers.map(p => {
            const primary = p.primary;
            const teacherDisplay = p.checked ? (
              <Form.Field error={!!errors[`p${  primary  }teacher`]}>
                <label htmlFor={`P${  primary  }teacher`}>
                  {`P${  primary  } `}Teacher
                </label>
                <select
                  ref={`P${  primary  }teacher`}
                  id={`P${  primary  }teacher`}
                  name={primary}
                  onChange={this.onChangeTeacher}
                >
                  {p.teacher_Name && !p.relief ? (
                    <option key={p.teacher_Name} value={p.teacher_Name}>
                      {p.teacher_Name}
                    </option>
                  ) : !p.relief ? (
                    <option key="" value="" />
                  ) : (
                    <option key="Other:Relief_Teacher" value="Other">
                      Other: Relief Teacher
                    </option>
                  )}
                  {teacherOptions}
                  <option key="Other:Relief_Teacher" value="Other">
                    Other: Relief Teacher
                  </option>
                </select>
                {errors[`p${  primary  }teacher`] && (
                  <InlineError text={errors[`p${  primary  }teacher`]} />
                )}
              </Form.Field>
            ) : null;

            return teacherDisplay;
          })
        : null;

    const reliefTeacherInput = errors.students
      ? null
      : data.branch
        ? data.teachers.map(p => {
            const primary = p.primary;
            const reliefTeacherTB = p.relief ? (
              <Form.Field error={!!errors[`p${  primary  }Rteacher`]}>
                <label htmlFor="reliefTeacher">
                  {`P${  primary  } Relief Teacher`}
                </label>
                <input
                  type="text"
                  id={`P${  primary  }reliefTeacher`}
                  name={primary}
                  placeholder="Name of Relief Teacher"
                  value={p.teacher_Name}
                  onChange={this.onChangeRelief}
                />
                {errors[`p${  primary  }Rteacher`] && (
                  <InlineError text={errors[`p${  primary  }Rteacher`]} />
                )}
              </Form.Field>
            ) : null;

            return reliefTeacherTB;
          })
        : null;

    return (
      <Form onSubmit={this.onSubmit} loading={loading} size="huge" key="huge">
        <Grid divided="horizontally" relaxed>
          <Grid.Row columns={2}>
            <Grid.Column>
              {data.dutyOfficer ? (
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
              ) : null}
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
              {data.branch === "Punggol" ? (
                <Form.Field>
                  <label htmlFor="batch">Batch</label>
                  <Form.Group inline>
                    <Form.Field
                      label="Batch 1"
                      control="input"
                      type="radio"
                      name="batch"
                      value="1"
                      checked={data.batch === "1"}
                      onChange={this.onChangeBatch}
                    />
                    <Form.Field
                      label="Batch 2"
                      control="input"
                      type="radio"
                      name="batch"
                      value="2"
                      checked={data.batch === "2"}
                      onChange={this.onChangeBatch}
                    />
                  </Form.Group>
                </Form.Field>
              ) : null}
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
                    checked={data.classroomSetup === "Yes"}
                    onChange={this.onChange}
                  />
                  <Form.Field
                    label="No"
                    control="input"
                    type="radio"
                    name="classroomSetup"
                    value="No"
                    checked={data.classroomSetup === "No"}
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
              {errors.students ? null : data.branch ? (
                <Form.Field error={!!errors.primary}>
                  <label htmlFor="primary">Primary</label>
                  <Form.Group>{primaryOptions}</Form.Group>
                  {errors.primary && <InlineError text={errors.primary} />}
                </Form.Field>
              ) : null}
              {teacherInput}
              {reliefTeacherInput}
              {errors.students ? null : data.branch ? (
                <Button primary>Submit</Button>
              ) : null}
            </Grid.Column>

            <Grid.Column>
              <Form.Field error={!!errors.students}>
                <label htmlFor="studentList">
                  <u>Student List</u>
                </label>
                {errors.students && <InlineError text={errors.students} />}
                {studentList}
              </Form.Field>
              {errors.students ? null : data.branch ? (
                <Button primary>Submit</Button>
              ) : null}
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
