import { combineReducers } from 'redux';
import user from './reducers/user';
import attendance from './reducers/attendance';

export default combineReducers({
  user: user,
  attendance: attendance
});
