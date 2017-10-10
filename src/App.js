import React from 'react';
import { Route, Link, Redirect } from 'react-router-dom';
import FBLoginPage from './components/pages/FBLoginPage';
import DutyOfficerPage from './components/pages/DutyOfficerPage';
import AttendancePage from './components/pages/AttendancePage';
import Header from './components/pages/Header';
import { firebaseAuth } from './firebase';

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

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? (
          <Component {...props} />
        ) : (
          <Redirect to="/updateDO" />
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
    user: null
  };

  componentDidMount() {
    this.removeListener = firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authed: true,
          loading: false,
          user: user
        });
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
        <Header appName="YYD AS" user={this.state.user} />
        <PublicRoute
          authed={this.state.authed}
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
