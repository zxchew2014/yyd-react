import { firebaseDb } from '../firebase';
import { SUBMIT_ATTENDANCE, ADD_ATTENDANCE } from '../types';

export const submitAttendance = attendance => dispatch => {
  dispatch({
    type: SUBMIT_ATTENDANCE,
    attendance
  });
};

export const addAttendance = attendance => dispatch => {
  const today = new Date();
  const yearOfToday = today.getFullYear();

  const attendanceRef = firebaseDb
    .ref(
      `Attendances/${attendance.clock}/${yearOfToday}/${today.toDateString()}`
    )
    .push();

  const newKey = attendanceRef.key;
  attendance.id = newKey;

  const updateData = {};
  updateData[
    `/Attendances/${
      attendance.clock
    }/${yearOfToday}/${today.toDateString()}/${newKey}`
  ] = attendance;
  firebaseDb.ref().update(updateData);
  dispatch({
    type: ADD_ATTENDANCE
  });
};
