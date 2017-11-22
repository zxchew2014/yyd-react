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
  console.log('Hello');
  dispatch(submit_Attendance(attendance));
};

export const addattendance = attendance => dispatch => {
  console.log('Add');
  const attendanceRef = firebaseDb.ref('Attendance');
  attendance.timestamp = new Date().toLocaleString();
  attendanceRef.push(attendance);
  dispatch(add_Attendance());
};

export const retrieveBranch = () => {
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
    list.sort();
  });

  return list;
};
