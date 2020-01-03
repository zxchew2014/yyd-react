import { firebaseAuth } from '../firebase';
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
  localStorage.user = firebaseAuth.currentUser;
  dispatch(fetchTeacher(firebaseAuth.currentUser));
  dispatch(userLoggedIn(firebaseAuth.currentUser));
};

export const logout = () => dispatch => {
  localStorage.removeItem('user');
  firebaseAuth
    .signOut()
    .then(() => dispatch(userLoggedOut()))
    .catch(error => console.log(error));
};
