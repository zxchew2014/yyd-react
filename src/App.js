import React from 'react';
import PropTypes from 'prop-types';
import FBLoginPage from './components/pages/FBLoginPage';
import Teacher from './components/pages/teacher';
import AttendancePage from './components/pages/attendance';
import SummaryPage from './components/pages/SummaryPage';
import UserRoute from './routes/UserRoute';
import GuestRoute from './routes/GuestRoute';
import Header from './components/pages/Header';

// const App = ({ location }) => (
//   <div className="ui container">
//     <Header />
//     <GuestRoute location={location} path="/" exact component={FBLoginPage} />
//     <UserRoute
//       location={location}
//       path="/update-teacher"
//       exact
//       component={Teacher}
//     />
//     <UserRoute
//       location={location}
//       path="/add-attendance"
//       exact
//       component={AttendancePage}
//     />
//     <UserRoute
//       location={location}
//       path="/summary"
//       exact
//       component={SummaryPage}
//     />
//   </div>
// );

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
          path="/update-teacher"
          exact
          component={Teacher}
        />
        <UserRoute
          location={this.props.location}
          path="/add-attendance"
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
