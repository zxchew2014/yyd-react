import { FETCH_TEACHER, FETCH_ATTENDANCE_TEACHER } from '../types';

export const fetchLoginTeacher = (state = null, action) => {
  if (action.type === FETCH_TEACHER) {
    return action.teacher;
  } else {
    return state;
  }
};

export const fetchAttendanceTeacher = (state = null, action) => {
  if (action.type === FETCH_ATTENDANCE_TEACHER) {
    return action.attendanceTeacher;
  } else {
    return state;
  }
};
