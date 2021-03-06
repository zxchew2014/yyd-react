import { userLoggedIn } from './auth';
import { firebaseAuth } from '../firebase';

export const updateprofile = data => dispatch => {
  firebaseAuth.currentUser
    .updateProfile({ displayName: data.teacherName })
    .then(() => {
      firebaseAuth.onAuthStateChanged(user => {
        if (user) {
          dispatch(userLoggedIn(user));
        }
      });
    });
};
