import { firebaseAuth } from '../firebase';
import PropTypes from 'prop-types';

export function logout() {
  return firebaseAuth.signOut();
}

export function updateProfile(data) {
  const user = firebaseAuth.currentUser;
  console.log(user);
  return user.updateProfile({ displayName: data.dutyOfficerName });
}
