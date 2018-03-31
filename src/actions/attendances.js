import { firebaseDb } from '../firebase';
import { SUBMIT_ATTENDANCE, ADD_ATTENDANCE } from '../types';

export const submit_Attendance = attendance => {
  return {
    type: SUBMIT_ATTENDANCE,
    attendance: attendance
  };
};

export const add_Attendance = () => ({
  type: ADD_ATTENDANCE
});

export const submitattendance = attendance => dispatch => {
  dispatch(submit_Attendance(attendance));
};

export const addattendance = attendance => dispatch => {
  const attendanceRef = firebaseDb.ref(
    `Attendances/${attendance.clock}/${new Date().toDateString()}`
  );
  attendanceRef.push(attendance);
  dispatch(add_Attendance());
};
