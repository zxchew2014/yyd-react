import { firebaseDb } from '../firebase';
import { SUBMIT_ATTENDANCE, ADD_ATTENDANCE } from '../types';

export const submitAttendance = attendance => dispatch => {
  dispatch({
    type: SUBMIT_ATTENDANCE,
    attendance
  });
};

export const addattendance = attendance => dispatch => {
  const attendanceRef = firebaseDb.ref(
    `Attendances/${attendance.clock}/${new Date().toDateString()}`
  );
  attendanceRef.push(attendance);
  dispatch({
    type: ADD_ATTENDANCE
  });
};
