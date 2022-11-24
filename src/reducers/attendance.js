import {
  SUBMIT_ATTENDANCE,
  ADD_ATTENDANCE,
  FETCH_ATTENDANCES,
  FETCH_ATTENDANCE
} from '../types';

export const submitAttendance = (state = {}, action = {}) => {
  switch (action.type) {
    case SUBMIT_ATTENDANCE:
      return action.attendance;
    case ADD_ATTENDANCE:
      return {};
    case FETCH_ATTENDANCE:
      return action.attendance;
    default:
      return state;
  }
};

export const fetchAttendances = (state = {}, action) => {
  if (action.type === FETCH_ATTENDANCES) {
    return action.attendances;
  } else {
    return state;
  }
};
