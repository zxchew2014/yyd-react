import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import FBLoginPage from './components/pages/FBLoginPage';
import DutyOfficerPage from './components/pages/DutyOfficerPage';
import AttendancePage from './components/pages/AttendancePage';
import Header from './components/pages/Header';
import firebase, { firebaseAuth } from './firebase';
import { login, userLoggedIn } from './actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )}
    />
  );
}

function PublicRoute({ component: Component, authed, user, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? (
          <Component {...props} />
        ) : !user.displayName ? (
          <Redirect to="/updateDO" />
        ) : (
          <Redirect to="/addAttendance" />
        )}
    />
  );
}

function withProps(Component, props) {
  return function(matchProps) {
    return <Component {...props} {...matchProps} />;
  };
}

class App extends React.Component {
  state = {
    authed: false,
    loading: true,
    user: null,
    errors: {}
  };
  constructor(props) {
    super(props);
  }
  submit = () => {
    firebaseAuth.currentUser
      .getIdToken(/* forceRefresh */ true)
      .then(accessToken => {
        //Submit to Back End
        axios.post('/api/auth', { accessToken }).then(res => dispatch => {
          console.log(res.data);

          dispatch(userLoggedIn(res.data.user));
        });
      })
      //Send to Back End for token verifyIdToken

      .catch(function(error) {
        // Handle error
        console.log(error);
      });
  };
  componentDidMount() {
    this.removeListener = firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authed: true,
          loading: false,
          user: user
        });

        this.submit();
        Header(this.state.user);
      } else {
        this.setState({
          authed: false,
          loading: false,
          user: null
        });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    return (
      <div className="ui container">
        <Header user={this.state.user} />
        <PublicRoute
          authed={this.state.authed}
          user={this.state.user}
          path="/"
          exact
          component={FBLoginPage}
        />
        <PrivateRoute
          authed={this.state.authed}
          user={this.state.user}
          path="/updateDO"
          exact
          component={withProps(DutyOfficerPage, {
            currentUser: this.state.user
          })}
        />
        <PrivateRoute
          authed={this.state.authed}
          user={this.state.user}
          path="/addAttendance"
          exact
          component={withProps(AttendancePage, {
            currentUser: this.state.user
          })}
        />
      </div>
    );
  }
}

export default App;
