import { combineReducers } from 'redux';
import user from './reducers/user';
import { submitAttendance, fetchAttendances } from './reducers/attendance';
import { fetchLoginTeacher, fetchAttendanceTeacher } from './reducers/teacher';

export default combineReducers({
  user,
  attendance: submitAttendance,
  attendances: fetchAttendances,
  teacher: fetchLoginTeacher,
  attendanceTeacher: fetchAttendanceTeacher
});
