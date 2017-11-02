import React from 'react';
import UpdateDutyOfficerFrom from '../forms/DutyOfficerForm';
import { updateprofile } from '../../actions/users';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class DutyOfficerPage extends React.Component {
  submit = data => {
    this.props.updateprofile(data);
    this.props.history.push('/addAttendance');
  };

  render() {
    return (
      <div>
        <h1>Update Duty Officer Details</h1>
        <UpdateDutyOfficerFrom
          submit={this.submit}
          currentUser={this.props.user}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

DutyOfficerPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  updateprofile: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { updateprofile })(DutyOfficerPage);
