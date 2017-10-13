import { firebaseAuth } from '../firebase';
import api from '../api';
import { USER_LOGGED_IN, USER_LOGGED_OUT } from '../types';

export const userLoggedIn = user => ({
  type: USER_LOGGED_IN,
  user
});

export const userLoggedOut = () => ({
  type: USER_LOGGED_OUT
});

export const login = idToken => dispatch => {
  api.user.login(idToken).then(user => {
    dispatch(userLoggedIn(user));
  });
};

export function logout() {
  userLoggedOut();
  return firebaseAuth.signOut();
}

export function updateProfile(data) {
  const user = firebaseAuth.currentUser;
  return user.updateProfile({ displayName: data.dutyOfficerName });
}
