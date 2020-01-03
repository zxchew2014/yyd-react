import { combineReducers } from 'redux';
import user from './reducers/user';
import attendance from './reducers/attendance';
import { fetchLoginTeacher, fetchAttendanceTeacher } from './reducers/teacher';

export default combineReducers({
  user,
  attendance,
  teacher: fetchLoginTeacher,
  attendanceTeacher: fetchAttendanceTeacher
});
