import React from 'react';
import PropTypes from 'prop-types';
import firebase, { ui } from '../../firebase';
import 'firebaseui/dist/firebaseui.css';

class FBForm extends React.Component {
  state = {
    loading: false
  };

  constructor(props) {
    super(props);
    this.getUiConfig = this.getUiConfig.bind(this);
  }

  getUiConfig = () => {
    return {
      callbacks: {
        signInSuccess: (user, credential, redirectUrl) => {
          return false;
        }
      },
      // Opens IDP Providers sign-in flow in a redirect.
      signInFlow: 'redirect',
      //signInSuccessUrl: "/addDutyOfficer",
      signInOptions: [
        {
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          recaptchaParameters: {
            type: 'image', // 'audio'
            size: 'normal', // 'invisible' or 'compact'
            badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
          },
          defaultCountry: 'SG' // Set default country to the Singapore (+65).
        }
      ],
      // Terms of service url.
      tosUrl: '/'
    };
  };

  componentDidMount() {
    ui.start(this.container, this.getUiConfig());
  }

  componentWillUnmount() {
    ui.reset();
  }

  render() {
    return (
      <div
        className
        ref={el => {
          this.container = el;
        }}
      />
    );
  }
}

export default FBForm;
