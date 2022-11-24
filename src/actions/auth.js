import firebase from 'firebase/compat/app';
import { USER_LOGGED_IN, USER_LOGGED_OUT } from '../types';
import { fetchTeacher } from './teachers';

export const userLoggedIn = user => ({
  type: USER_LOGGED_IN,
  user
});

export const userLoggedOut = () => ({
  type: USER_LOGGED_OUT
});

export const login = () => dispatch => {
  localStorage.user = firebase.auth().currentUser;
  dispatch(fetchTeacher(firebase.auth().currentUser));
  dispatch(userLoggedIn(firebase.auth().currentUser));
};

export const logout = () => dispatch => {
  localStorage.removeItem('user');
  firebase
    .auth()
    .signOut()
    .then(() => dispatch(userLoggedOut()))
    .catch(error => console.log(error));
};
