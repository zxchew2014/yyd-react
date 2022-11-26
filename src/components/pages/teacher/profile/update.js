import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TeacherForm from '../../../forms/teacher/profile/update';
import { updateprofile } from '../../../../actions/users';

class UpdateTeacherProfilePage extends React.Component {
  submit = data => {
    this.props.updateprofile(data);
    this.props.history.push('/add-attendance');
  };

  render() {
    return (
      <div>
        <h1>Update Teacher Detail</h1>
        <TeacherForm submit={this.submit} currentUser={this.props.user} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

Update.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  updateprofile: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { updateprofile })(UpdateTeacherProfilePage);
