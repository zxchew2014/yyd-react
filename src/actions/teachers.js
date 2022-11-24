import { FETCH_TEACHER, FETCH_ATTENDANCE_TEACHER } from '../types';
//import { firebaseDb } from '../firebase';
import firebase from 'firebase/compat/app';

export const fetchAttendanceTeacher = (
  branch,
  teacher_name
) => async dispatch => {
  const teacherRef = firebase
    .database()
    .ref(`/Teacher_Allocation/${branch}`)
    .orderByChild('Name')
    .equalTo(teacher_name)
    .limitToFirst(1);
  teacherRef.on('value', data => {
    if (data.exists()) {
      const result = data.val();
      Object.keys(result).forEach(key => {
        const attendanceTeacher = result[key];
        dispatch({
          type: FETCH_ATTENDANCE_TEACHER,
          attendanceTeacher
        });
      });
    }
  });
};

export const fetchTeacher = user => async dispatch => {
  const phoneNumber = user.phoneNumber;
  const teacherRef = firebase.database().ref(`/Teacher_Allocation`);
  let isExist = false;
  let currentTeacher = null;

  teacherRef.on('value', data => {
    if (data.exists()) {
      const result = data.val();
      Object.keys(result).forEach(key => {
        const branch = result[key];
        Object.keys(branch).forEach(bKey => {
          const teacher = branch[bKey];
          if (phoneNumber.includes(teacher.Mobile)) {
            isExist = true;
            currentTeacher = teacher;
          }
        });
      });

      if (isExist) {
        dispatch({
          type: FETCH_TEACHER,
          teacher: currentTeacher
        });
      } else {
        dispatch({
          type: FETCH_TEACHER,
          teacher: null
        });
      }
    } else {
      dispatch({
        type: FETCH_TEACHER,
        teacher: null
      });
    }
  });
};
