import { SUBMIT_ATTENDANCE, ADD_ATTENDANCE } from '../types';

export default function attendance(state = {}, action = {}) {
  switch (action.type) {
    case SUBMIT_ATTENDANCE:
      return action.attendance;
    case ADD_ATTENDANCE:
      return {};
    default:
      return state;
  }
}
