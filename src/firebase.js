import rebase from 're-base';
import firebase from 'firebase';
import * as firebaseui from 'firebaseui';

export const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};

export const firebaseApp = firebase.initializeApp(config);
export const ui = new firebaseui.auth.AuthUI(firebaseApp.auth());
export const firebaseStorage = firebaseApp.storage();
export const firebaseDb = firebaseApp.database();
export default firebase;
