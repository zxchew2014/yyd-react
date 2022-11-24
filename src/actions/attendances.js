import {
  SUBMIT_ATTENDANCE,
  ADD_ATTENDANCE,
  FETCH_ATTENDANCES,
  FETCH_ATTENDANCE
} from '../types';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/auth';
const moment = require('moment');
import { DATETME_DDMMYYYSLASH_HHMMSS } from '../utils/common';

export const updateAttendance = attendance => async dispatch => {
  const today = new Date();
  attendance.lastModificationTimestamp = today.toLocaleString('en-GB', {
    timeZone: 'Asia/Singapore'
  });
  const yearOfToday = today.getFullYear();

  const updateData = {};

  const ref = `/Attendances/Clock Out/${yearOfToday}/${today.toDateString()}/${
    attendance.id
  }`;
  updateData[ref] = attendance;

  firebase
    .database()
    .ref()
    .update(updateData);
  dispatch({
    type: FETCH_ATTENDANCE,
    attendance: {}
  });
};

export const clearAttendance = () => async dispatch => {
  dispatch({
    type: FETCH_ATTENDANCE,
    attendance: {}
  });
};

export const fetchAttendances = () => async dispatch => {
  const today = new Date();
  const yearOfToday = today.getFullYear();
  const refStr = `Attendances/Clock Out/${yearOfToday}/${today.toDateString()}`;
  const attendanceRef = firebase.database().ref(refStr);

  const user = firebase.auth().currentUser;
  const userPhoneNumber = user.phoneNumber;
  let newList = {};
  let sortable = {};
  attendanceRef.on('value', data => {
    if (data.exists()) {
      const result = data.val();
      Object.keys(result).forEach(key => {
        const attendance = result[key];
        if (userPhoneNumber === attendance.phoneNumber) {
          newList[attendance.id] = attendance;
        }
      });

      sortable = Object.entries(newList)
        .sort(
          ([, a], [, b]) =>
            moment(b.timestamp, DATETME_DDMMYYYSLASH_HHMMSS).toDate() -
            moment(a.timestamp, DATETME_DDMMYYYSLASH_HHMMSS).toDate()
        )
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

      dispatch({
        type: FETCH_ATTENDANCES,
        attendances: sortable
      });
    } else {
      dispatch({
        type: FETCH_ATTENDANCES,
        attendances: null
      });
    }
  });
};

export const fetchAttendance = currentAttendance => async dispatch => {
  const today = new Date();
  const yearOfToday = today.getFullYear();
  const refStr = `Attendances/Clock Out/${yearOfToday}/${today.toDateString()}/${
    currentAttendance.id
  }`;

  const attendanceRef = firebase.database().ref(refStr);
  attendanceRef.on('value', data => {
    if (data.exists()) {
      dispatch({
        type: FETCH_ATTENDANCE,
        attendance: data.val()
      });
    } else {
      dispatch({
        type: FETCH_ATTENDANCE,
        attendance: {}
      });
    }
  });
};

export const submitAttendance = attendance => dispatch => {
  dispatch({
    type: SUBMIT_ATTENDANCE,
    attendance
  });
};

export const addAttendance = attendance => dispatch => {
  const today = new Date();
  const yearOfToday = today.getFullYear();

  const attendanceRef = firebase
    .database()
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
  firebase
    .database()
    .ref()
    .update(updateData);
  dispatch({
    type: ADD_ATTENDANCE
  });
};
