import { USER_LOGGED_IN, USER_LOGGED_OUT } from '../types';
import { firebaseAuth } from '../firebase';
import api from '../api';
//import setAuthorizationHeader from "../utils/setAuthorizationHeader";

export const userLoggedIn = user => ({
  type: USER_LOGGED_IN,
  user
});

export const userLoggedOut = () => ({
  type: USER_LOGGED_OUT
});

export const login = user => dispatch => {
  console.log(user);
  var phoneNumber = user.phoneNumber;
  api.user.login(user.phoneNumber).then(user => {
    localStorage.bookwormJWT = user.getTokenID();
    //setAuthorizationHeader(user.getTokenID());
    dispatch(userLoggedIn(user));
  });
};

export function logout() {
  return firebaseAuth.signOut();
}
