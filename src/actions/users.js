import { userLoggedIn } from './auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export const updateprofile = data => dispatch => {
  firebase
    .auth()
    .currentUser.updateProfile({ displayName: data.teacherName })
    .then(() => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          dispatch(userLoggedIn(user));
        }
      });
    });
};
