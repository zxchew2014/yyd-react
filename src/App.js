import React from "react";
import PropTypes from "prop-types";
import FBLoginPage from "./components/pages/login/index";
import UpdateTeacherProfilePage from "./components/pages/teacher/profile/update";
import AttendancePage from "./components/pages/attendance/insert";
import ViewAttendancePage from "./components/pages/attendance/index";
import EditAttendancePage from "./components/pages/attendance/edit";
import SummaryPage from "./components/pages/SummaryPage";
import UserRoute from "./routes/UserRoute";
import GuestRoute from "./routes/GuestRoute";
import Header from "./components/common/Header";

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
    const { location } = this.props;
    return (
      <div className="ui container">
        <Header />
        <GuestRoute
          location={location}
          path="/"
          exact
          component={FBLoginPage}
        />
        <UserRoute
          location={location}
          path="/profile/update"
          exact
          component={UpdateTeacherProfilePage}
        />
        <UserRoute
          location={location}
          path="/attendance/add"
          exact
          component={AttendancePage}
        />
        <UserRoute
          location={location}
          path="/attendance/edit"
          exact
          component={EditAttendancePage}
        />
        <UserRoute
          location={location}
          path="/attendance"
          exact
          component={ViewAttendancePage}
        />
        {/*<UserRoute*/}
        {/*  location={this.props.location}*/}
        {/*  path="/summary"*/}
        {/*  exact*/}
        {/*  component={SummaryPage}*/}
        {/*/>*/}
      </div>
    );
  }
}

// App.propTypes = {
//   location: PropTypes.shape({
//     pathname: PropTypes.string.isRequired
//   }).isRequired
// };

export default App;
