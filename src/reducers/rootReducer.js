import { combineReducers } from 'redux';
import user from './user';
import { submitAttendance, fetchAttendances } from './attendance';
import { fetchLoginTeacher, fetchAttendanceTeacher } from './teacher';

export default combineReducers({
  user,
  attendance: submitAttendance,
  attendances: fetchAttendances,
  teacher: fetchLoginTeacher,
  attendanceTeacher: fetchAttendanceTeacher
});
