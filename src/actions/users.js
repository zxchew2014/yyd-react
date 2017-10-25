import api from '../api';
import { userLoggedIn } from './auth';

export const updateprofile = data => dispatch =>
  api.user.updateprofile(data).then(user => {
    //localStorage.yydJWT = user.accessToken;
    dispatch(userLoggedIn(user));
  });

// export function updateProfile(data) {
//   const user = firebaseAuth.currentUser;
//   userLoggedIn(user);
//   return user.updateProfile({ displayName: data.dutyOfficerName });
// }
