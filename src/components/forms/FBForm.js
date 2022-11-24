import React from 'react';
import PropTypes from 'prop-types';
import { FirebaseAuth } from 'react-firebaseui';
import dialogPolyfill from 'dialog-polyfill';
import firebase from 'firebase/compat/app';

class FBForm extends React.Component {
  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'redirect',
    signInOptions: [
      {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
          //type: 'image', // 'audio'
          size: 'invisible' // 'invisible' or 'compact'
          // badge: 'bottomleft' // ' bottomright' or 'inline' applies to invisible.
        },
        defaultCountry: 'SG' // Set default country to the Singapore (+65).
      }
    ],
    // Sets the `signedIn` state property to `true` once signed in.
    callbacks: {
      signInSuccessWithAuthResult: () => {
        this.props.submit();
        return false; // Avoid redirects after sign-in.
      }
    }
  };

  componentDidMount() {
    window.dialogPolyfill = dialogPolyfill;
  }

  render() {
    return (
      <div>
        <FirebaseAuth
          uiCallback={ui => ui.disableAutoSignIn()}
          uiConfig={this.uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    );
  }
}

FBForm.propTypes = {
  submit: PropTypes.func.isRequired
};

export default FBForm;
