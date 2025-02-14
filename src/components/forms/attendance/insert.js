import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Form,
  Button,
  TextArea,
  Popup,
  Label,
  Message
} from 'semantic-ui-react';
import InlineError from '../../messages/InlineError';
import CreatableSelect from 'react-select/creatable';
import { connect } from 'react-redux';
import { fetchAttendanceTeacher } from '../../../actions/teachers';

import {
  EDUCATION_LEVEL,
  MSG_BODY_FOR_NA,
  MSG_FEEDBACK_PLACEHOLDER,
  MSG_HEADER_FOR_NA
} from '../../../utils/common';
import { formatStudentName } from '../../../utils/util';
import firebase from 'firebase/compat/app';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/en-sg';

class AttendanceForm extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeTeacher = this.onChangeTeacher.bind(this);
    this.onChangeBranch = this.onChangeBranch.bind(this);
    //this.onChangeBatch = this.onChangeBatch.bind(this);
    this.onChangePrimaryStudent = this.onChangePrimaryStudent.bind(this);
    this.onChangeSecondaryStudent = this.onChangeSecondaryStudent.bind(this);
    this.onChangeRelief = this.onChangeRelief.bind(this);
    this.onChangePrimary = this.onChangePrimary.bind(this);
    this.onChangeGrouping = this.onChangeGrouping.bind(this);
    this.onChangeLevelRadio = this.onChangeLevelRadio.bind(this);
    this.filterStudentList = this.filterStudentList.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  state = {
    data: {
      clock: 'Clock Out',
      phoneUser: this.props.user.displayName,
      phoneNumber: this.props.user.phoneNumber,
      branch: '',
      teacher: '',
      subject: 'English',
      classroomSetup: 'Yes',
      feedback: '',
      primary: [],
      batch: [],
      students: [],
      level: 'Primary',
      timestamp: ''
    },
    branchList: [],
    batchList: [],
    teacherList: [],
    allTeacherList: [],
    subjectList: [],
    primaryList: [],
    studentList: [],
    statesList: [],
    loading: false,
    errors: {},

    // Secondary feature : SecondaryList refer to secondary level and groupList refer to G1, G2, G3 based on subject of the students took
    secondaryList: [],
    groupList: []
  };

  UNSAFE_componentWillMount() {

    this.retrieveAllTeacherList();
    this.retrieveBranchList(this.state.data.level);
    this.retrieveSubjectList(this.state.data.level);
    this.retrieveStatesList();
    this.checkDoubleEntry();

    if (JSON.stringify(this.props.attendance) !== JSON.stringify({})) {
      const { attendance } = this.props;
      this.retrieveTeacherList(attendance.branch,attendance.level);
      this.retrieveStudentList(attendance.branch,attendance.level, attendance.subject);

      this.setState({
        data: {
          ...this.state.data,
          ...attendance
        }
      });
    }
  }

  onChange = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });
  };


  onChangeDateTime = value => {
    this.setState({
      data: { ...this.state.data, timestamp: value }
    });
  };

  onChangeSubject = e => {

    const { level, branch } = this.state.data
    if(level === 'Secondary') {
      this.retrieveStudentList(branch, level, e.target.value);
      this.setState({
        data: {
          ...this.state.data,
          [e.target.name]: e.target.value,
          group: [],
          students: []
        }
      });
      return;
    }

    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value
      }
    });
  };

  onChangeLevelRadio = e => {
    const { data } = this.state;
    this.retrieveBranchList(e.target.value);
    this.retrieveSubjectList(e.target.value);
    this.retrieveTeacherList(data.branch, e.target.value);

    if(data.subject) {
      this.retrieveStudentList(data.branch, e.target.value, data.subject);
    } else {
      this.retrieveStudentList(data.branch, e.target.value);
    }

    //Set back to english as default
    if(e.target.value === 'Primary') {
      delete this.state.data.secondary;
      delete this.state.data.group;

      if(data.subject === 'Chinese'){
        this.setState({
          data: { ...data, [e.target.name]: e.target.value, subject: 'English', students: [], primary: []}
        });
      } else{
        this.setState({
          data: { ...data, [e.target.name]: e.target.value, students: [], primary: []}
        });
      }

    } else if(e.target.value === 'Secondary'){
        delete this.state.data.primary;
        this.setState({
          data: { ...data, [e.target.name]: e.target.value, secondary:'1', group:[],students: []}
        });
      }
  }

  onChangeBranch = e => {

    const { level } = this.state.data
    this.retrieveTeacherList(e.target.value, level);
    this.retrieveStudentList(e.target.value, level);

    if (level === 'Primary') {
      this.setState({
        data: {
          ...this.state.data,
          branch: e.target.value,
          teacher: '',
          relief: false,
          primary: [],
          students: []
        }
      });
    }
    else if (level === 'Secondary'){
      this.setState({
        data: {
          ...this.state.data,
          branch: e.target.value,
          teacher: '',
          relief: false,
          secondary: '1',
          group: [],
          students: []
        }
      });
    }

  };

  /*onChangeBatch = e => {
    this.retrieveStudentList(this.state.data.branch, e.target.value);

    this.setState({
      data: {
        ...this.state.data,
        batch: e.target.value,
        primary: [],
        students: []
      }
    });
  };*/

  onChangeTeacher = e => {
    const { data } = this.state;
    const { fetchAttendanceTeacher } = this.props;

    if (e.target.value !== 'Other') {
      fetchAttendanceTeacher(data.branch, e.target.value);
    }

    this.setState({
      data: {
        ...data,
        teacher: e.target.value === 'Other' ? '' : e.target.value,
        relief: e.target.value === 'Other'
      }
    });
  };

  onChangeRelief = value => {
    this.setState({
      data: {
        ...this.state.data,
        teacher: value.value
      }
    });
  };

  onChangePrimaryStudent = e => {
    const list = [];
    const getStudentList = this.state.data.students;
    const keys = Object.keys(getStudentList);

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];

      const id = getStudentList[key].Id;
      const studentName = getStudentList[key].Name;
      const priLvl = getStudentList[key].Primary;
      const foundation = getStudentList[key].Foundation;
      const status = getStudentList[key].Status;
      const batch = getStudentList[key].Batch;

      const checked = `status_${studentName}`;

      let student = {};

      student = {
        Id: id,
        Name: studentName,
        Status: checked === e.target.name ? e.target.value : status,
        Primary: priLvl
      };
      if (batch) {
        student.Batch = batch;
      }
      if (foundation) {
        student.Foundation = foundation;
      }
      list.push(student);
    }

    this.setState({
      data: {
        ...this.state.data,
        students: list
      }
    });
  };

  onChangeSecondaryStudent = e => {
    const list = [];
    const getStudentList = this.state.data.students;
    const keys = Object.keys(getStudentList);

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];

      const id = getStudentList[key].Id;
      const studentName = getStudentList[key].Name;
      const secLvl = getStudentList[key].Secondary;
      const group = getStudentList[key].Group;
      const status = getStudentList[key].Status;
      const batch = getStudentList[key].Batch;

      const checked = `status_${studentName}`;

      let student = {};

      student = {
        Id: id,
        Name: studentName,
        Status: checked === e.target.name ? e.target.value : status,
        Secondary: secLvl,
        Group: group
      };

      if (batch) {
        student.Batch = batch;
      }

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
      studentsList = this.filterStudentList(e.target.value, false);
    } else {
      arrayPrimary.splice(index, 1); // Remove primary level from Array
      studentsList = this.filterStudentList(e.target.value, true);
    }
    arrayPrimary.sort();
    studentsList.sort((a, b) => {
      if (a.Batch) {
        return (
          a.Primary.localeCompare(b.Primary) ||
          a.Batch.localeCompare(b.Batch) ||
          a.Name.localeCompare(b.Name)
        );
      } else {
        return (
          a.Primary.localeCompare(b.Primary) || a.Name.localeCompare(b.Name)
        );
      }
    });

    this.setState({
      data: {
        ...this.state.data,
        primary: arrayPrimary,
        students: studentsList
      }
    });
  };

  onChangeGrouping = e => {
    let studentsList = [];
    const arrayGroup = this.state.data.group;
    const index = arrayGroup.indexOf(e.target.value);

    if (index === -1) {
      arrayGroup.push(e.target.value); // Add groupId to Array
      studentsList = this.filterSecondaryStudentList(e.target.value, false);
    } else {
      arrayGroup.splice(index, 1); // Remove groupId from Array
      studentsList = this.filterSecondaryStudentList(e.target.value, true);
    }
    arrayGroup.sort();

    studentsList.sort((a, b) => {
      if (a.Batch) {
        return (
            a.Secondary.localeCompare(b.Secondary) ||
            a.Group.localeCompare(b.Group) ||
            a.Batch.localeCompare(b.Batch) ||
            a.Name.localeCompare(b.Name)
        );
      } else {
        return (
            a.Secondary.localeCompare(b.Secondary) ||  a.Group.localeCompare(b.Group) || a.Name.localeCompare(b.Name)
        );
      }
    });

    this.setState({
      data: {
        ...this.state.data,
        group: arrayGroup,
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
      this.props.submit(data);
    } else {
      window.scrollTo(0, 0);
    }
  };

  getPrimaryChecked = primary => {
    const arrayPrimary = this.state.data.primary || [];
    const index = arrayPrimary.indexOf(primary);
    return index !== -1;
  };

  getGroupChecked = groupId => {
    const arrayGroup = this.state.data.group || [];
    const index = arrayGroup.indexOf(groupId);
    return index !== -1;
  };

  validateAttendance = (
    currentDate,
    formData
  ) => {
    if (formData === undefined) return false;

    let validateCheck = false;
    const today = new Date();
    const AttendanceRef = firebase
      .database()
      .ref(`Attendances/${formData.clock}/${today.getFullYear()}/${currentDate}`);

    AttendanceRef.on('value', data => {
      if (data.val()) {
        Object.keys(data.val()).some(key => {
          const attendance = data.val()[key];
          if (attendance.teacher === formData.teacher) {
            if (attendance.branch === formData.branch) {
              if (attendance.subject === formData.subject) {
                if(attendance.level === 'Primary') {
                  if (this.comparePrimaryNGroupClass(attendance.primary, formData.primary)) {
                      validateCheck = true;
                      return validateCheck;
                  }
                } else if (attendance.level === 'Secondary') {
                  if (this.comparePrimaryNGroupClass(attendance.group, formData.group)) {
                      validateCheck = true;
                      return validateCheck;
                  }
                }
              }
            }
          }
        });
      }
    });
    return validateCheck;
  };

  comparePrimaryNGroupClass = (oldClass, newClass) => {
    let check = false;
    if(oldClass === undefined || newClass === undefined) return true;
    oldClass.some(p1 =>
      // eslint-disable-next-line
      newClass.some(p2 => {
        if (p1 === p2) {
          check = true;
          return true;
        }
      })
    );
    return check;
  };

  retrieveBranchList = level => {
    const list = [];
    const BranchesRef = firebase.database().ref('Branches');
    BranchesRef.on('value', data => {
      if (data.val !== null) {
        const branches = [].concat(...Object.values(data.val()));

        branches.forEach(branch => {
          if (branch.Active) {
            if (level === "Primary" && branch.primary) {
              list.push(branch.Branch_Name);
            }
            else if (level === "Secondary" && branch.secondary) {
              list.push(branch.Branch_Name);
            }
          }
        });
        list.sort();
      }
      this.setState({ branchList: list });
    });
  };

  retrieveTeacherList = (branch, level = "Primary") => {
    const list = [];
    const TeacherRef = firebase
      .database()
      .ref(`Teacher_Allocation/${branch}`)
      .orderByChild('Name');

    TeacherRef.on('value', data => {
      if (data.val() !== null) {
        const teachers = [].concat(...Object.values(data.val()));
        teachers.forEach(teacher => {
          if(teacher.level === level)
            list.push(teacher.Name);
        });
        list.sort();
      }
      this.setState({
        teacherList: list
      });
    });
  };

  retrieveAllTeacherList = () => {
    const list = [];
    const today = new Date();
    const yearOfToday = today.getFullYear();
    const TeacherRef = firebase.database().ref('Teacher_Allocation');
    const ClockOutRef = firebase
      .database()
      .ref(`Attendances/Clock Out/${yearOfToday}`);

    TeacherRef.on('value', data => {
      const branches = data.val();
      const branchArray = [].concat(...Object.values(branches));
      branchArray.forEach(branch => {
        Object.keys(branch).forEach(key => {
          const teacher = branch[key];
          if (list.indexOf(teacher.Name) === -1) {
            list.push(teacher.Name);
          }
        });
      });
    });

    ClockOutRef.on('value', data => {
      if (data.exists()) {
        const attendances = data.val();
        Object.keys(attendances).forEach(date => {
          const dateList = attendances[date];
          Object.keys(dateList).forEach(attendance => {
            const attendanceList = dateList[attendance];
            if (attendanceList.relief) {
              if (list.indexOf(attendanceList.teacher) === -1) {
                list.push(attendanceList.teacher);
              }
            }
          });
        });
      }

      list.sort();
      this.setState({
        allTeacherList: list
      });
    });
  };

  retrieveStatesList = () => {
    const list = [];
    const StatesRef = firebase
      .database()
      .ref('States')
      .orderByKey();
    StatesRef.on('value', data => {
      const states = [].concat(...Object.values(data.val()));
      states.forEach(stateInfo => {
        list.push(stateInfo.status);
      });
      this.setState({ statesList: list });
    });
  };

  retrieveStudentList = (branch, l='Primary', s='English') => {
    const studentList = [];
    const levelList = [];
    const groupIdList = [];

    let { level, subject } = this.state.data ;

    level = l !== level ? l :level;
    subject = s !== subject ? s :subject;


    const studentsRef = firebase
      .database()
      .ref(`New_Students/${branch}`)
      .orderByChild('Name');

    studentsRef.on('value', data => {
      const students = data.val();
      if (students === null) {
        this.setState({ errors: this.validateWithBranch(branch) });
      } else {
        //let batchCheck;
        Object.keys(students).forEach((key) => {
          const student = students[key];
          student.Id = key;
          student.Status = 'Present';

          if(level === 'Primary' && student.Primary) {
            studentList.push(student);
            if (!_.includes(levelList, student.Primary)) {
              levelList.push(student.Primary);
            }
          }

          else if(level === 'Secondary' && student.Secondary) {
            if (!_.includes(levelList, student.Secondary)) {
              levelList.push(student.Secondary);
            }

            if(subject === 'English'){
              if(student.english){
                studentList.push(student);

                if (!_.includes(groupIdList, student.english)) {
                  groupIdList.push(student.english);
                }
              }
            }
            else if(subject === 'Math'){
              if(student.math){
                studentList.push(student);
                if (!_.includes(groupIdList, student.math)) {
                  groupIdList.push(student.math);
                }
              }
            }
            else if(subject === 'Chinese'){
              if(student.chinese){
                studentList.push(student);
                if (!_.includes(groupIdList, student.chinese)) {
                  groupIdList.push(student.chinese);
                }
              }
            }
          }
        });
        levelList.sort();
        groupIdList.sort();

        if(studentList !== []) {
          studentList.sort((a, b) => {
            if(level === 'Primary') {
              if (a.Batch) {
                return (
                    a.Primary.localeCompare(b.Primary) ||
                    a.Batch.localeCompare(b.Batch) ||
                    a.Name.localeCompare(b.Name)
                );
              } else {
                return (
                    a.Primary.localeCompare(b.Primary) || a.Name.localeCompare(b.Name)
                );
              }
            }
            else if(level === 'Secondary') {
              if (a.Batch) {
                return (
                    a.Secondary.localeCompare(b.Secondary) ||
                    a.Batch.localeCompare(b.Batch) ||
                    a.Name.localeCompare(b.Name)
                );
              } else {
                return (
                    a.Secondary.localeCompare(b.Secondary) || a.Name.localeCompare(b.Name)
                );
              }
            }
          })
        }

        if(level === 'Primary') {
          this.setState({errors: {}, studentList, primaryList: levelList});
        }
        else if(level === 'Secondary'){
          this.setState({ errors: {}, studentList, secondaryList : levelList, groupList : groupIdList});
        }
      }
    });
  };

  retrieveSubjectList = level => {
    const list = [];
    const SubjectsRef = firebase.database().ref('Subjects');
    SubjectsRef.on('value', data => {
      const subjects = [].concat(...Object.values(data.val()));

      subjects.forEach(subject => {
        if(level === 'Primary' && subject.primary) {
          list.push(subject.Subject_Name);
        }  else if (level === "Secondary" && subject.secondary) {
          list.push(subject.Subject_Name);
        }

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

    let keyId;
    let primary;
    let studentId = '';
    let batch;
    let foundation;
    let student = {};

    if (checked) {
      // To remove students by primary level
      const NO_OF_PRIMARY = this.state.data.primary.length;

      if (NO_OF_PRIMARY === 0) {
        return [];
      }
      for (let i = 0; i < keysOfCSL.length; i += 1) {
        keyId = keysOfCSL[i];
        primary = currentStudentList[keyId].Primary;
        if (primary !== primaryLvl) {
          studentId = currentStudentList[keyId].Id;
          batch = currentStudentList[keyId].Batch;
          foundation = currentStudentList[keyId].Foundation;
          student = {
            Id: studentId,
            Name: currentStudentList[keyId].Name,
            Primary: primary,
            Status: currentStudentList[keyId].Status
          };
          if (batch) {
            student.Batch = batch;
          }
          if (foundation) {
            student.Foundation = foundation;
          }

          tempStudList.push(student);
        }
      }
    } else {
      // To insert students by primary level
      for (let j = 0; j < keysOfOSL.length; j += 1) {
        keyId = keysOfOSL[j];
        primary = originalStudentList[keyId].Primary;
        if (primary === primaryLvl) {
          studentId = originalStudentList[keyId].Id;
          batch = originalStudentList[keyId].Batch;
          foundation = originalStudentList[keyId].Foundation;
          student = {
            Id: studentId,
            Name: originalStudentList[keyId].Name,
            Primary: primary,
            Status: originalStudentList[keyId].Status
          };
          if (batch) {
            student.Batch = batch;
          }
          if (foundation) {
            student.Foundation = foundation;
          }
          tempStudList.push(student);
        }
      }
      tempStudList = currentStudentList.concat(tempStudList);
    }

    return tempStudList;
  };

  filterSecondaryStudentList = (groupId, checked) => {
    const {subject} = this.state.data
    let tempStudList = [];
    const currentStudentList = this.state.data.students;
    const originalStudentList = this.state.studentList;

    const keysOfCSL = Object.keys(currentStudentList);
    const keysOfOSL = Object.keys(originalStudentList);

    let keyId;
    let group;
    let studentId = '';
    let batch;
    let student = {};

    if (checked) {
      // To remove students by groupId
      const NO_OF_GROUP = this.state.data.group.length;

      if (NO_OF_GROUP === 0) {
        return [];
      }
      for (let i = 0; i < keysOfCSL.length; i += 1) {
        keyId = keysOfCSL[i];
        group = currentStudentList[keyId].Group

        if (group !== groupId) {
          studentId = currentStudentList[keyId].Id;
          batch = currentStudentList[keyId].Batch;
          student = {
            Id: studentId,
            Name: currentStudentList[keyId].Name,
            Secondary: currentStudentList[keyId].Secondary,
            Group: group,
            Status: currentStudentList[keyId].Status
          };
          if (batch) {
            student.Batch = batch;
          }

          tempStudList.push(student);
        }

      }
    } else {
      // To insert students by groupId
      for (let j = 0; j < keysOfOSL.length; j += 1) {
        keyId = keysOfOSL[j];
        group = this.getGroup(subject, originalStudentList[keyId]);

        if (group === groupId) {
          studentId = originalStudentList[keyId].Id;
          batch = originalStudentList[keyId].Batch;
          student = {
            Id: studentId,
            Name: originalStudentList[keyId].Name,
            Secondary: originalStudentList[keyId].Secondary,
            Group: group,
            Status: originalStudentList[keyId].Status
          };
          if (batch) {
            student.Batch = batch;
          }
          tempStudList.push(student);
        }
      }
      tempStudList = currentStudentList.concat(tempStudList);
    }

    return tempStudList;
  };

  getGroup(subject, student) {

    if(subject === "English")
      return student.english;
    else if(subject === "Math")
      return student.math;
    else if(subject === "Chinese")
      return student.chinese;

    return student.Group;
  }

  checkDoubleEntry = (formData) => {
    const today = new Date().toDateString();
    // next time implement double checking on different date when over riding date
    let errorMsg = '';
    const check = this.validateAttendance(
      today,
      formData
    );

    if (check) {
      if(formData.level === 'Primary'){
        errorMsg = `You have already submitted your attendance for ${today}, Primary ${formData.primary} ${formData.subject} lesson in ${formData.branch} branch. If you encounter issue on submitting kindly contact Sky at +65 96201042`;
      } else {
        errorMsg = `You have already submitted your attendance for ${today}, Secondary ${formData.secondary} - ${formData.group} ${formData.subject} lesson in ${formData.branch} branch. If you encounter issue on submitting kindly contact Sky at +65 96201042`;
      }
    }
    return errorMsg;
  };

  validateWithBranch = branch => {
    const errors = {};
    errors.students = `No student data in ${branch} branch`;
    return errors;
  };

  // Validation
  validate = data => {
    const { attendanceTeacher } = this.props;
    const errors = {};
    const doubleEntry = this.checkDoubleEntry(
      data
    );

    if (doubleEntry) {
      errors.attendance = doubleEntry;
    }

    if (data.branch) {
      if (data.relief) {
        if (!data.teacher) {
          errors.relief = "Relief Teacher can't be blank";
          errors.teacher = null;
        }
      } else if (!data.teacher) errors.teacher = "Teacher can't be blank";
    }

    if (data.level === 'Primary' && data.primary.length === 0) {
      errors.primary = 'At least select 1 primary';
    }

    if(data.level === 'Secondary') {
      if((!data.group.includes("G2") && data.group.includes("G3")) || ( data.group.includes("G2") && !data.group.includes("G3"))) {
        errors.group = 'G2 and G3 require to mark in the same attendance';
      }
    }
    if (!data.subject) errors.subject = "Subject can't be blank";

    if (data.classroomSetup === 'No') {
      if (data.feedback.length === 0) {
        errors.feedback =
          'Please state the reason(s) why classroom setup is no.';
      }
    }

    if (!data.relief) {
      if (
        attendanceTeacher == null ||
        !data.phoneNumber.includes(attendanceTeacher.Mobile)
      ) {
        if (data.feedback.length === 0) {
          errors.feedback =
            'Please state the reason(s) why teacher is not the same user as login';
        }
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
      secondaryList,
      groupList,
      statesList
    } = this.state;
    const { attendances, feature_flag } = this.props;
    let  IsSecondaryActive, overRideDate;
    if(feature_flag !== null){
      IsSecondaryActive  = feature_flag.IsSecondaryActive;
      overRideDate = feature_flag.overRideDate;
    }

    const BRANCH_OPTIONS = branchList
      ? branchList.map(branch => (
          <option key={branch} defaultValue={branch}>
            {branch}
          </option>
        ))
      : null;

    const TEACHER_OPTIONS = teacherList.map(teacher => (
      <option key={teacher} defaultValue={teacher}>
        {teacher}
      </option>
    ));

    const ALL_TEACHER_OPTIONS = () => {
      const list = [];
      allTeacherList.forEach(teacher => {
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
            onChange={this.onChangeSubject}
          />
        ))
      : null;

    const LEVEL_RADIO_FIELDS = EDUCATION_LEVEL.map(l => (
        <Form.Field
            key={l}
            label={l}
            control="input"
            type="radio"
            name="level"
            value={l}
            checked={l === data.level}
            onChange={this.onChangeLevelRadio}
        />
    ));

    const PRIMARY_CHECKBOX_FIELDS = primaryList ? primaryList.map(primary => (
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
    )) : null;

    const SECONDARY_RADIOBOX_FIELDS = secondaryList ? secondaryList.map(s => (
        <Form.Field
            key={s}
            label={`Sec ${s}`}
            control="input"
            type="radio"
            name={s}
            value={s}
            checked={s === data.secondary}
            onChange={this.onChange}
        />
    )) : null;

    const GROUPID_CHECKBOX_FIELDS = groupList ? groupList.map(s => (
        <Form.Field
            key={s}
            label={s}
            control="input"
            type="checkbox"
            name={s}
            value={s}
            checked={this.getGroupChecked(s)}
            onChange={this.onChangeGrouping}
        />
    )) : null;

    let counter = 0;
    // ORIGINAL CODE
    const STUDENT_LIST = data.students.map(student => {
      const studentName = _.trim(student.Name);
      const newStudentName = formatStudentName(studentName);

      const STUDENT_LIST_FIELD = (
        <Form.Field key={student.Id}>
          <label htmlFor={student.Name}>
            { data.level === 'Primary' ?
              `${(counter += 1)}. ${newStudentName} - P${student.Primary}`: `${(counter += 1)}. ${newStudentName} - Sec${student.Secondary} - ${student.Group}`
            }
            {student.Batch && (
              <Label basic color="blue" size="small" circular>
                Batch {student.Batch}
              </Label>
            )}
            {student.Foundation && (
              <Label basic color="orange" size="small" circular>
                Foundation: {student.Foundation}
              </Label>
            )}
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
                onChange={data.level === 'Primary' ? this.onChangePrimaryStudent : this.onChangeSecondaryStudent}
              />
            ))}
          </Form.Group>
        </Form.Field>
      );
      return STUDENT_LIST_FIELD;
    });

    const DISPLAY_RELIEF = () => (
      <div>
        {`Enter your full name that's NOT in the list, then hit`} <b>return</b>{' '}
        or click on <b>Create option "Your Name"</b>
      </div>
    );

    const FORM_FIELD_CLOCK = () => (
      <div>
        <Form.Field error={!!errors.attendance}>
          <i>{errors.attendance && <InlineError text={errors.attendance} />}</i>
        </Form.Field>
      </div>
    );

    const FORM_FIELD_DATETIME = () => (
        [
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-sg">
            <DemoContainer components={['DateTimePicker']}>
              <DateTimePicker label="Timestamp" value={dayjs(data.timestamp)} onChange={this.onChangeDateTime} />
            </DemoContainer>
          </LocalizationProvider>,
          <br/>
        ]
    );

    const FORM_FIELD_LEVEL = () => (
        <Form.Field error={!!errors.level} required>
          <label htmlFor="level">Level</label>
          <Form.Group>{LEVEL_RADIO_FIELDS}</Form.Group>
        </Form.Field>
    );

    const FORM_FIELD_BRANCH = () => (
      <Form.Field error={!!errors.branch} required>
        <label htmlFor="branch">Branch</label>
        <select
          ref="branch"
          name="branch"
          id="branch"
          onChange={this.onChangeBranch}
        >
          {data.branch ? (
            <option key={data.branch} defaultValue={data.branch}>
              {data.branch}
            </option>
          ) : (
            <option key="" defaultValue="">
              Select branch
            </option>
          )}
          {BRANCH_OPTIONS}
        </select>
        {errors.branch && <InlineError text={errors.branch} />}
      </Form.Field>
    );

    const FORM_FIELD_TEACHER = () =>
      data.branch ? (
        <Form.Field error={!!errors.teacher} required>
          <label htmlFor="teacher">Teacher</label>
          <select
            ref="teacher"
            id="teacher"
            name="teacher"
            onChange={this.onChangeTeacher}
          >
            {data.teacher && !data.relief ? (
              <option key={data.teacher} defaultValue={data.teacher}>
                {data.teacher}
              </option>
            ) : !data.relief ? (
              <option key="" defaultValue="">
                Select teacher
              </option>
            ) : (
              <option key="Other:Relief_Teachers" defaultValue="Other">
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

    const FORM_FIELD_RELIEF_TEACHER = () =>
      data.relief ? (
        <Form.Field error={!!errors.relief} required>
          <label htmlFor="relief">Relief Teacher</label>
          <Popup
            trigger={
              <div className="section">
                <CreatableSelect
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

    const FORM_FIELD_SUBJECT = () => (
      <Form.Field error={!!errors.subject} required>
        <label htmlFor="subject">Subject</label>
        <Form.Group>{SUBJECT_RADIO_FIELDS}</Form.Group>
      </Form.Field>
    );

    const FORM_FIELD_PRIMARY = () =>
      errors.students ? null : data.branch ? (
        <Form.Field error={!!errors.primary} required>
          <label htmlFor="primary">Primary</label>
          <Form.Group>{PRIMARY_CHECKBOX_FIELDS}</Form.Group>
          {errors.primary && <InlineError text={errors.primary} />}
        </Form.Field>
      ) : null;

    const FORM_FIELD_SECONDARY = () =>
        errors.students ? null : data.branch ? (
            <Form.Field error={!!errors.secondary} required>
              <label htmlFor="secondary">Secondary</label>
              <Form.Group>{SECONDARY_RADIOBOX_FIELDS}</Form.Group>
              {errors.primary && <InlineError text={errors.secondary} />}
            </Form.Field>
        ) : null;

    const FORM_FIELD_GROUPID = () =>
        errors.students ? null : data.branch ? (
            <Form.Field error={!!errors.group} required>
              <label htmlFor="group">Group</label>
              <Form.Group>{GROUPID_CHECKBOX_FIELDS}</Form.Group>
              {errors.group && <InlineError text={errors.group} />}
            </Form.Field>
        ) : null;

    const FORM_FIELD_CLASSROOM_SETUP = () => (
      <Form.Field required>
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

    const FORM_FIELD_FEEDBACK = () => (
      <Form.Field error={!!errors.feedback}>
        <label htmlFor="feedback">{`Comment`}</label>

        <TextArea
          id="feedback"
          name="feedback"
          value={data.feedback}
          placeholder={MSG_FEEDBACK_PLACEHOLDER}
          onChange={this.onChange}
        />
        {errors.feedback && <InlineError text={errors.feedback} />}
      </Form.Field>
    );

    const FORM_FIELD_STUDENT_LIST = () => (
      <Form.Field error={!!errors.students}>
        <label htmlFor="studentList">
          <u>Students</u>
        </label>
        {errors.students && <InlineError text={errors.students} />}
        {STUDENT_LIST}
      </Form.Field>
    );

    const SUBMIT_BUTTON = () =>
      errors.students ? null : data.students.length !== 0 ? (
        <Button primary fluid>
          Submit
        </Button>
      ) : null;

    const BACK_BUTTON = () => (
      <Button secondary fluid onClick={() => this.props.onBack()}>
        Back
      </Button>
    );

    return (
      <Form onSubmit={this.onSubmit} loading={loading} size="huge" key="huge">
        <Grid relaxed stackable>
          <Grid.Row columns={2}>
            <Grid.Column>
              {attendances !== null &&
                JSON.stringify(attendances) !== '{}' &&
                  [
                    BACK_BUTTON(),
                    <hr/>,
                    <Form.Field>
                      <label htmlFor="clockInfo">
                        <i>
                          You are able to edit the attendance of the day, if there is a change during the lesson.
                          By clicking the back button.
                        </i>
                      </label>
                    </Form.Field>,

                  ]
              }
              { overRideDate ? FORM_FIELD_DATETIME() : null}
              {FORM_FIELD_CLOCK()}
              { IsSecondaryActive ? FORM_FIELD_LEVEL() : null }
              {FORM_FIELD_BRANCH()}
              {FORM_FIELD_TEACHER()}
              {FORM_FIELD_RELIEF_TEACHER()}
              {FORM_FIELD_SUBJECT()}
              {
                data.level === 'Primary' ? FORM_FIELD_PRIMARY() :
                    [FORM_FIELD_SECONDARY(), FORM_FIELD_GROUPID()]
              }
              {FORM_FIELD_CLASSROOM_SETUP()}
              {FORM_FIELD_FEEDBACK()}
            </Grid.Column>

            {data.students.length !== 0 ? (
              <Grid.Column>
                <Message
                  info
                  size="mini"
                  header={MSG_HEADER_FOR_NA}
                  list={MSG_BODY_FOR_NA}
                />
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
  submit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  attendance: PropTypes.objectOf(PropTypes.object).isRequired
};

const mapStateToProps = ({ user, attendanceTeacher, attendances, feature_flag }) => ({
  user,
  attendanceTeacher,
  attendances,
  feature_flag
});

export default connect(mapStateToProps, { fetchAttendanceTeacher })(
  AttendanceForm
);
