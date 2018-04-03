import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Form, Button, TextArea, Icon, Popup } from 'semantic-ui-react';
import InlineError from '../../messages/InlineError';
import { firebaseDb } from '../../../firebase';
import Select from 'react-select';
import _ from 'lodash';

class AttendanceForm extends React.Component {
  state = {
    data: {
      clock: 'Clock In',
      branch: '',
      teacher: '',
      subject: 'English',
      classroomSetup: 'Yes',
      feedback: '',
      primary: [],
      students: [],
      timestamp: ''
    },
    branchList: [],
    teacherList: [],
    allTeacherList: [],
    subjectList: [],
    primaryList: [],
    studentList: [],
    statesList: [],
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
    this.onChangeClassNo = this.onChangeClassNo.bind(this);
    this.filterStudentList = this.filterStudentList.bind(this);
    this.filterStudentListWithClassNo = this.filterStudentListWithClassNo.bind(
      this
    );
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.retrieveAllTeacherList();
    this.retrieveBranchList();
    this.retrieveSubjectList();
    this.retrieveStatesList();

    if (JSON.stringify(this.props.attendance) !== JSON.stringify({})) {
      const { attendance } = this.props;
      this.retrieveTeacherList(attendance.branch);
      this.retrieveStudentList(attendance.branch, attendance.batch);

      this.setState({
        data: {
          ...this.state.data,
          clock: attendance.clock,
          branch: attendance.branch,
          teacher: attendance.teacher,
          batch: attendance.batch ? attendance.batch : null,
          relief: attendance.relief,
          classNo: attendance.classNo ? attendance.classNo : null,
          subject: attendance.subject,
          classroomSetup: attendance.classroomSetup,
          feedback: attendance.feedback,
          students: attendance.students,
          primary: attendance.primary
        }
      });
    }
  }

  getPrimaryChecked = primary => {
    const arrayPrimary = this.state.data.primary || [];
    const index = arrayPrimary.indexOf(primary);
    return index !== -1;
  };

  getClassChecked = classNo => {
    const arrayClass = this.state.data.classNo || [];
    const index = arrayClass.indexOf(classNo);
    return index !== -1;
  };

  retrieveBranchList = () => {
    const list = [];
    const BranchesRef = firebaseDb.ref('Branches');
    BranchesRef.on('value', data => {
      const branches = [].concat(...Object.values(data.val()));
      // eslint-disable-next-line
      branches.map(branch => {
        list.push(branch.Branch_Name);
      });
      list.sort();
      this.setState({ branchList: list });
    });
  };

  retrieveTeacherList = branch => {
    const list = [];
    const TeacherRef = firebaseDb
      .ref(`Teacher_Allocation/${branch}`)
      .orderByChild('Name');

    TeacherRef.on('value', data => {
      const teachers = [].concat(...Object.values(data.val()));
      // eslint-disable-next-line
      teachers.map(teacher => {
        list.push(teacher.Name);
      });
      list.sort();
      this.setState({
        teacherList: list
      });
    });
  };

  retrieveAllTeacherList = () => {
    const list = [];
    const TeacherRef = firebaseDb.ref('Teacher_Allocation');
    const ClockInRef = firebaseDb.ref(`Attendances/Clock In`);

    TeacherRef.on('value', data => {
      const branches = data.val();
      const teachers = [].concat(...Object.values(branches));
      // eslint-disable-next-line
      teachers.map(teacher => {
        if (list.indexOf(teacher.Name) === -1) {
          list.push(teacher.Name);
        }
      });
    });

    ClockInRef.on('value', data => {
      const attendances = data.val();
      // eslint-disable-next-line
      Object.keys(attendances).map((key, index) => {
        const date = attendances[key];
        // eslint-disable-next-line
        Object.keys(date).map((key2, index2) => {
          const attendance = date[key2];
          if (attendance.relief) {
            if (list.indexOf(attendance.teacher) === -1) {
              list.push(attendance.teacher);
            }
          }
        });
      });
      list.sort();

      this.setState({
        allTeacherList: list
      });
    });
  };

  retrieveStatesList = () => {
    const list = [];
    const StatesRef = firebaseDb.ref('States').orderByKey();
    StatesRef.on('value', data => {
      const states = [].concat(...Object.values(data.val()));
      // eslint-disable-next-line
      states.map(stateInfo => {
        list.push(stateInfo.status);
      });
      this.setState({ statesList: list });
    });
  };

  retrieveStudentList = (branch, batch = null) => {
    const studentList = [];
    const primaryList = [];

    const studentsRef = firebaseDb
      .ref('Students')
      .orderByChild('Branch')
      .equalTo(branch);

    studentsRef.on('value', data => {
      let students = data.val();
      if (students === null) {
        this.setState({ errors: this.validateWithBranch(branch) });
      } else {
        let batchCheck;
        // eslint-disable-next-line
        Object.keys(students).map((key, index) => {
          const student = students[key];
          if (batch === student.Batch || batch === null) {
            batchCheck = true;
          } else {
            batchCheck = false;
          }

          if (batchCheck) {
            student.Id = key;
            student.Status = 'Present';
            studentList.push(student);

            if (primaryList.indexOf(student.Primary) === -1) {
              primaryList.push(student.Primary);
            }
          }
        });
        primaryList.sort();

        this.setState({
          errors: {},
          studentList: studentList,
          primaryList: primaryList
        });
      }
    });
  };

  retrieveSubjectList = () => {
    const list = [];
    const SubjectsRef = firebaseDb.ref('Subjects');
    SubjectsRef.on('value', data => {
      const subjects = [].concat(...Object.values(data.val()));
      // eslint-disable-next-line
      subjects.map(subject => {
        list.push(subject.Subject_Name);
      });
      list.sort();
      this.setState({ subjectList: list });
    });
  };

  filterStudentList = (primaryLvl, checked) => {
    let tempStudList = [];
    const currentStudentList = this.state.data.students;
    const originalStudentList = this.state.studentList;

    const keysOfCSL = Object.keys(currentStudentList);
    const keysOfOSL = Object.keys(originalStudentList);

    let key_id,
      primary,
      student_id = '';
    let student = {};

    if (checked) {
      //To remove students by primary level
      const NO_OF_PRIMARY = this.state.data.primary.length;

      if (NO_OF_PRIMARY === 0) {
        return [];
      } else {
        for (let i = 0; i < keysOfCSL.length; i++) {
          key_id = keysOfCSL[i];
          primary = currentStudentList[key_id].Primary;
          if (primary !== primaryLvl) {
            student_id = currentStudentList[key_id].Id;
            student = {
              Id: student_id,
              Name: currentStudentList[key_id].Name,
              Primary: primary,
              Class: currentStudentList[key_id].Class,
              Status: currentStudentList[key_id].Status
            };
            tempStudList.push(student);
          }
        }
      }
    } else {
      // To insert students by primary level
      for (let j = 0; j < keysOfOSL.length; j++) {
        key_id = keysOfOSL[j];
        primary = originalStudentList[key_id].Primary;
        if (primary === primaryLvl) {
          student_id = originalStudentList[key_id].Id;
          student = {
            Id: student_id,
            Name: originalStudentList[key_id].Name,
            Primary: primary,
            Status: originalStudentList[key_id].Status
          };
          tempStudList.push(student);
        }
      }
      tempStudList = currentStudentList.concat(tempStudList);
    }

    return tempStudList;
  };

  filterStudentListWithClassNo = (classNo, checked) => {
    let tempStudList = [];
    const currentStudentList = this.state.data.students;
    const originalStudentList = this.state.studentList;

    const keysOfCSL = Object.keys(currentStudentList);
    const keysOfOSL = Object.keys(originalStudentList);

    let key_id,
      student_id = '';
    let student = {};

    if (checked) {
      //To remove students by Class Number
      for (let i = 0; i < keysOfCSL.length; i++) {
        key_id = keysOfCSL[i];
        let currentStudent_ClassNo = currentStudentList[key_id].Class;
        if (currentStudent_ClassNo !== classNo) {
          student_id = currentStudentList[key_id].Id;
          student = {
            Id: student_id,
            Name: currentStudentList[key_id].Name,
            Primary: currentStudentList[key_id].Primary,
            Class: currentStudent_ClassNo,
            Status: currentStudentList[key_id].Status
          };
          tempStudList.push(student);
        }
      }
    } else {
      // To insert students by Class Number
      for (let j = 0; j < keysOfOSL.length; j++) {
        key_id = keysOfOSL[j];
        let originalStudent_ClassNo = originalStudentList[key_id].Class;
        if (originalStudent_ClassNo === classNo) {
          student_id = originalStudentList[key_id].Id;
          student = {
            Id: student_id,
            Name: originalStudentList[key_id].Name,
            Primary: originalStudentList[key_id].Primary,
            Class: originalStudent_ClassNo,
            Status: originalStudentList[key_id].Status
          };
          tempStudList.push(student);
        }
      }
      tempStudList = currentStudentList.concat(tempStudList);
    }

    return tempStudList;
  };

  onChange = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });
  };

  onChangeBranch = e => {
    this.retrieveTeacherList(e.target.value);
    if (e.target.value === 'Punggol') {
      this.retrieveStudentList(e.target.value, '1'); // Default batch: 1
    } else {
      this.retrieveStudentList(e.target.value); // Default batch: null
    }

    this.setState({
      data: {
        ...this.state.data,
        branch: e.target.value,
        batch: e.target.value === 'Punggol' ? '1' : null,
        teacher: '',
        relief: false,
        primary: [],
        classNo: null,
        students: []
      }
    });
  };

  onChangeBatch = e => {
    this.retrieveStudentList(this.state.data.branch, e.target.value);

    this.setState({
      data: {
        ...this.state.data,
        batch: e.target.value,
        primary: [],
        students: []
      }
    });
  };

  onChangeTeacher = e => {
    this.setState({
      data: {
        ...this.state.data,
        teacher: e.target.value === 'Other' ? '' : e.target.value,
        relief: e.target.value === 'Other' ? true : false
      }
    });
  };

  onChangeRelief = value => {
    console.log(value);
    this.setState({
      data: {
        ...this.state.data,
        teacher: value.value
      }
    });
  };

  onChangeStudent = e => {
    const list = [];
    const getStudentList = this.state.data.students;
    const keys = Object.keys(getStudentList);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      const id = getStudentList[key].Id;
      const studentName = getStudentList[key].Name;
      const priLvl = getStudentList[key].Primary;
      const status = getStudentList[key].Status;

      const checked = `status_${studentName}`;

      let student = {};
      student = {
        Id: id,
        Name: studentName,
        Status: checked === e.target.name ? e.target.value : status,
        Primary: priLvl
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

  onChangePrimary = e => {
    let studentsList = [];
    const arrayPrimary = this.state.data.primary;
    const index = arrayPrimary.indexOf(e.target.value);

    if (index === -1) {
      arrayPrimary.push(e.target.value); // Add primary level to Array
      if (e.target.value === '5' && this.state.data.branch === 'Fernvale')
        studentsList = this.filterStudentListWithClassNo('1', false);
      else studentsList = this.filterStudentList(e.target.value, false);
    } else {
      arrayPrimary.splice(index, 1); // Remove primary level from Array
      studentsList = this.filterStudentList(e.target.value, true);
    }
    arrayPrimary.sort();

    let classList = true;

    if (arrayPrimary.length === 0) {
      classList = false;
    }
    if (
      this.state.data.branch === 'Fernvale' &&
      arrayPrimary.indexOf('5') === -1
    ) {
      classList = false;
    }

    this.setState({
      data: {
        ...this.state.data,
        primary: arrayPrimary,
        classNo: classList
          ? this.state.data.classNo ||
            (this.state.data.branch === 'Fernvale' &&
            arrayPrimary.indexOf('5') > -1
              ? ['1']
              : null)
          : null,
        students: studentsList
      }
    });
  };

  onChangeClassNo = e => {
    let studentsList = [];
    const arrayClass = this.state.data.classNo || [];
    const index = arrayClass.indexOf(e.target.value);

    if (index === -1) {
      arrayClass.push(e.target.value); // Add class to Array
      studentsList = this.filterStudentListWithClassNo(e.target.value, false);
    } else {
      arrayClass.splice(index, 1); // Remove class from Array
      studentsList = this.filterStudentListWithClassNo(e.target.value, true);
    }
    arrayClass.sort();

    this.setState({
      data: {
        ...this.state.data,
        classNo: arrayClass,
        students: studentsList
      }
    });
  };

  // Submit Form
  onSubmit = e => {
    const { data } = this.state;
    const errors = this.validate(data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.setState({
        loading: true
      });
      data.teacher = _.startCase(data.teacher);
      this.props.submit(data);
    }
  };

  validateWithBranch = branch => {
    const errors = {};
    errors.students = `No student data in ${branch} branch`;
    return errors;
  };

  // Validation
  validate = data => {
    const errors = {};

    if (data.branch) {
      if (data.relief) {
        if (!data.teacher) {
          errors.relief = "Relief Teacher can't be blank";
          errors.teacher = null;
        }
      } else if (!data.teacher) errors.teacher = "Teacher can't be blank";
    }

    if (data.primary.length === 0) {
      errors.primary = 'At least select 1 primary';
    }

    if (!data.subject) errors.subject = "Subject can't be blank";

    if (data.classroomSetup === 'No') {
      if (data.feedback.length === 0) {
        errors.feedback =
          'Please state the reason(s) why classroom setup is no.';
      }
    }

    if (data.branch === 'Fernvale' && data.primary.indexOf('5') > -1) {
      if (data.classNo.length === 0) {
        errors.classNo = 'At least select 1 class.';
      }
    }

    return errors;
  };

  render() {
    const {
      data,
      errors,
      loading,
      teacherList,
      allTeacherList,
      subjectList,
      branchList,
      primaryList,
      statesList
    } = this.state;

    const BRANCH_OPTIONS = branchList
      ? branchList.map(branch => (
          <option key={branch} value={branch}>
            {branch}
          </option>
        ))
      : null;

    const TEACHER_OPTIONS = teacherList.map(teacher => (
      <option key={teacher} value={teacher}>
        {teacher}
      </option>
    ));

    const ALL_TEACHER_OPTIONS = () => {
      const list = [];
      // eslint-disable-next-line
      allTeacherList.map(teacher => {
        const obj = { value: teacher, label: teacher };
        list.push(obj);
      });
      return list;
    };

    const SUBJECT_RADIO_FIELDS = subjectList
      ? subjectList.map(subject => (
          <Form.Field
            key={subject}
            label={subject}
            control="input"
            type="radio"
            name="subject"
            value={subject}
            checked={subject === data.subject}
            onChange={this.onChange}
          />
        ))
      : null;

    const PRIMARY_CHECKBOX_FIELDS = primaryList.map(primary => (
      <Form.Field
        key={primary}
        label={`P${primary}`}
        control="input"
        type="checkbox"
        name={primary}
        value={primary}
        checked={this.getPrimaryChecked(primary)}
        onChange={this.onChangePrimary}
      />
    ));

    let counter = 1;
    // ORIGINAL CODE
    const STUDENT_LIST = data.students.map(student => {
      const STUDENT_LIST_FIELD = (
        <Form.Field key={student.Id}>
          <label htmlFor={student.Name}>
            {`${counter++}. ${student.Name} - P${student.Primary}`}
          </label>
          <Form.Group>
            {statesList.map(state => (
              <Form.Field
                key={state}
                label={state}
                control="input"
                type="radio"
                name={`status_${student.Name}`}
                value={state}
                checked={state === student.Status}
                onChange={this.onChangeStudent}
              />
            ))}
          </Form.Group>
        </Form.Field>
      );
      return STUDENT_LIST_FIELD;
    });

    const DISPLAY_HELP = () => {
      return (
        <div>
          <p>
            {`If student name is not in the list, do type their full name on the
            Comment/Feedback Box:`}
          </p>
          <p>Example: [Full Name]-[Status]</p>
          <u>{`Student(s)`}</u>
          <br />
          Chew Zhi Xuan-Present, Yong Guo Jun-Absent, ...
        </div>
      );
    };

    const DISPLAY_RELIEF = () => {
      return (
        <div>
          {`Enter your full name that's NOT in the list, then hit return`}
        </div>
      );
    };

    const DISPLAY_CLOCK = () => {
      return (
        <div>Remember to select the correct option before submitting.</div>
      );
    };

    const FORM_FIELD_CLOCK = () => {
      return (
        <Form.Field>
          <label htmlFor="clock">
            {`Clock In/Out`}{' '}
            <Popup
              trigger={<Icon name="help circle" />}
              content={DISPLAY_CLOCK()}
              on={['hover', 'click']}
              hideOnScroll
            />
          </label>
          <Form.Group inline>
            <Form.Field
              label="Clock In"
              control="input"
              type="radio"
              name="clock"
              value="Clock In"
              checked={data.clock === 'Clock In'}
              onChange={this.onChange}
            />
            <Form.Field
              label="Clock Out"
              control="input"
              type="radio"
              name="clock"
              value="Clock Out"
              checked={data.clock === 'Clock Out'}
              onChange={this.onChange}
            />
          </Form.Group>
        </Form.Field>
      );
    };

    const FORM_FIELD_BRANCH = () => {
      return (
        <Form.Field error={!!errors.branch}>
          <label htmlFor="branch">Branch</label>
          <select
            ref="branch"
            name="branch"
            id="branch"
            onChange={this.onChangeBranch}
          >
            {data.branch ? (
              <option key={data.branch} value={data.branch} selected>
                {data.branch}
              </option>
            ) : (
              <option key="" value="" disabled selected>
                Select branch
              </option>
            )}
            {BRANCH_OPTIONS}
          </select>
          {errors.branch && <InlineError text={errors.branch} />}
        </Form.Field>
      );
    };

    const FORM_FIELD_BATCH = () => {
      return data.branch === 'Punggol' ? (
        <Form.Field>
          <label htmlFor="batch">Batch</label>
          <Form.Group inline>
            <Form.Field
              label="Batch 1"
              control="input"
              type="radio"
              name="batch"
              value="1"
              checked={data.batch === '1'}
              onChange={this.onChangeBatch}
            />
            <Form.Field
              label="Batch 2"
              control="input"
              type="radio"
              name="batch"
              value="2"
              checked={data.batch === '2'}
              onChange={this.onChangeBatch}
            />
          </Form.Group>
        </Form.Field>
      ) : null;
    };

    const FORM_FIELD_TEACHER = () => {
      return data.branch ? (
        <Form.Field error={!!errors.teacher}>
          <label htmlFor="teacher">Teacher</label>
          <select
            ref="teacher"
            id="teacher"
            name="teacher"
            onChange={this.onChangeTeacher}
          >
            {data.teacher && !data.relief ? (
              <option key={data.teacher} value={data.teacher} selected>
                {data.teacher}
              </option>
            ) : !data.relief ? (
              <option key="" value="" disabled selected>
                Select teacher
              </option>
            ) : (
              <option key="Other:Relief_Teacher" value="Other">
                Other: Relief Teacher
              </option>
            )}

            {TEACHER_OPTIONS}
            <option
              key="Other:Relief_Teacher"
              value="Other"
              selected={data.relief}
            >
              Other: Relief Teacher
            </option>
          </select>
          {errors.teacher && <InlineError text={errors.teacher} />}
        </Form.Field>
      ) : null;
    };

    const FORM_FIELD_RELIEF_TEACHER = () => {
      return data.relief ? (
        <Form.Field error={!!errors.relief}>
          <label htmlFor="relief">Relief Teacher</label>
          <Popup
            trigger={
              <div className="section">
                <Select.Creatable
                  multi={false}
                  options={ALL_TEACHER_OPTIONS()}
                  value={data.teacher}
                  onChange={this.onChangeRelief}
                  placeholder={
                    data.teacher ? data.teacher : 'Enter your full name'
                  }
                />
              </div>
            }
            content={DISPLAY_RELIEF()}
            position="top center"
            on="focus"
          />

          {errors.relief && <InlineError text={errors.relief} />}
        </Form.Field>
      ) : null;
    };

    const FORM_FIELD_SUBJECT = () => {
      return (
        <Form.Field error={!!errors.subject}>
          <label htmlFor="subject">Subject</label>
          <Form.Group>{SUBJECT_RADIO_FIELDS}</Form.Group>
        </Form.Field>
      );
    };

    const FORM_FIELD_PRIMARY = () => {
      return errors.students ? null : data.branch ? (
        <Form.Field error={!!errors.primary}>
          <label htmlFor="primary">Primary</label>
          <Form.Group>{PRIMARY_CHECKBOX_FIELDS}</Form.Group>
          {errors.primary && <InlineError text={errors.primary} />}
        </Form.Field>
      ) : null;
    };

    const FORM_FIELD_P5_CLASS = () => {
      return data.branch === 'Fernvale' && data.primary.indexOf('5') > -1 ? (
        <Form.Field error={!!errors.classNo}>
          <label htmlFor="classNo">Class</label>
          <Form.Group inline>
            <Form.Field
              key="Class 1"
              label="Class 1"
              control="input"
              type="checkbox"
              name="classNo"
              value="1"
              checked={this.getClassChecked('1')}
              onChange={this.onChangeClassNo}
            />
            <Form.Field
              key="Class 2"
              label="Class 2"
              control="input"
              type="checkbox"
              name="classNo"
              value="2"
              checked={this.getClassChecked('2')}
              onChange={this.onChangeClassNo}
            />
          </Form.Group>
          {errors.classNo && <InlineError text={errors.classNo} />}
        </Form.Field>
      ) : null;
    };

    const FORM_FIELD_CLASSROOM_SETUP = () => {
      return (
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
      );
    };

    const FORM_FIELD_FEEDBACK = () => {
      return (
        <Form.Field error={!!errors.feedback}>
          <label htmlFor="feedback">
            {`Comment/Feedback`}{' '}
            <Popup
              trigger={<Icon name="help circle" />}
              content={DISPLAY_HELP()}
              on={['hover', 'click']}
              hideOnScroll
            />
          </label>

          <TextArea
            id="feedback"
            name="feedback"
            value={data.feedback}
            placeholder="Comment/Feedback"
            onChange={this.onChange}
          />
          {errors.feedback && <InlineError text={errors.feedback} />}
        </Form.Field>
      );
    };

    const FORM_FIELD_STUDENT_LIST = () => {
      return (
        <Form.Field error={!!errors.students}>
          <label htmlFor="studentList">
            <u>Students</u>
          </label>
          {errors.students && <InlineError text={errors.students} />}
          {STUDENT_LIST}
        </Form.Field>
      );
    };

    const SUBMIT_BUTTON = () => {
      return errors.students ? null : data.students.length !== 0 ? (
        <Button primary>Submit</Button>
      ) : null;
    };

    return (
      <Form onSubmit={this.onSubmit} loading={loading} size="huge" key="huge">
        <Grid relaxed stackable>
          <Grid.Row columns={2}>
            <Grid.Column>
              {FORM_FIELD_CLOCK()}
              {FORM_FIELD_BRANCH()}
              {FORM_FIELD_BATCH()}
              {FORM_FIELD_TEACHER()}
              {FORM_FIELD_RELIEF_TEACHER()}
              {FORM_FIELD_SUBJECT()}
              {FORM_FIELD_PRIMARY()}
              {FORM_FIELD_P5_CLASS()}
              {FORM_FIELD_CLASSROOM_SETUP()}
              {FORM_FIELD_FEEDBACK()}
            </Grid.Column>

            {data.students.length !== 0 ? (
              <Grid.Column>
                {FORM_FIELD_STUDENT_LIST()}
                {SUBMIT_BUTTON()}
              </Grid.Column>
            ) : null}
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
