import { combineReducers } from 'redux';
import user from './user';
import { submitAttendance, fetchAttendances } from './attendance';
import { fetchLoginTeacher, fetchAttendanceTeacher } from './teacher';
import { fetchFeatureFlag } from "./feature_flag";

export default combineReducers({
  user,
  attendance: submitAttendance,
  attendances: fetchAttendances,
  teacher: fetchLoginTeacher,
  attendanceTeacher: fetchAttendanceTeacher,
  feature_flag: fetchFeatureFlag
});
