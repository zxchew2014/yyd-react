import { firebaseAuth } from '../firebase';
import api from '../api';
import { USER_LOGGED_IN, USER_LOGGED_OUT } from '../types';

export const userLoggedIn = user => {
  //console.log("USER LOGIN: " + JSON.stringify(user));
  console.log('USER LOGIN: ' + user);
  return {
    type: USER_LOGGED_IN,
    user: user
  };
};

export const userLoggedOut = () => ({
  type: USER_LOGGED_OUT
});

export const login = currentUser => dispatch => {
  localStorage.user = currentUser;
  dispatch(userLoggedIn(currentUser));
};

export const logout = () => dispatch => {
  localStorage.removeItem('user');
  firebaseAuth
    .signOut()
    .then(() => dispatch(userLoggedOut()))
    .catch(error => console.log(error));
};

export function updateProfile(data) {
  const user = firebaseAuth.currentUser;
  return user.updateProfile({ displayName: data.dutyOfficerName });
}
