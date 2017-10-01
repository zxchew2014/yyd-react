import React from 'react';
import { Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import FBLoginPage from './components/pages/FBLoginPage';
import DutyOfficerPage from './components/pages/DutyOfficerPage';

const App = () => (
  <div className="ui container">
    <Route path="/" exact component={HomePage} />
    <Route path="/login" exact component={LoginPage} />
    <Route path="/fblogin" exact component={FBLoginPage} />
    <Route path="/addDutyOfficer" exact component={DutyOfficerPage} />
  </div>
);

export default App;
