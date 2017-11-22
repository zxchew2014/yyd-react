import React from 'react';
import FBLoginPage from './components/pages/FBLoginPage';
import DutyOfficerPage from './components/pages/DutyOfficerPage';
import AttendancePage from './components/pages/AttendancePage';
import SummaryPage from './components/pages/SummaryPage';
import UserRoute from './routes/UserRoute';
import GuestRoute from './routes/GuestRoute';
import Header from './components/pages/Header';
import PropTypes from 'prop-types';

class App extends React.Component {
  render() {
    return (
      <div className="ui container">
        <Header />
        <GuestRoute
          location={this.props.location}
          path="/"
          exact
          component={FBLoginPage}
        />
        <UserRoute
          location={this.props.location}
          path="/updateDO"
          exact
          component={DutyOfficerPage}
        />
        <UserRoute
          location={this.props.location}
          path="/addAttendance"
          exact
          component={AttendancePage}
        />
        <UserRoute
          location={this.props.location}
          path="/summary"
          exact
          component={SummaryPage}
        />
      </div>
    );
  }
}

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default App;
