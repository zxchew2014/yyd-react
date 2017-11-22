import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { addattendance } from '../../actions/attendances';

class SummaryPage extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onBack = e => {
    this.props.history.push('/addAttendance');
  };

  onSubmit = e => {
    this.props.addattendance(this.props.attendance);
    this.props.history.push('/addAttendance');
  };

  render() {
    return (
      <div>
        <h1>Summary Details</h1>
        <Button onClick={this.onBack}>Back</Button>
        <Button onClick={this.onSubmit}>Add</Button>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user,
    attendance: state.attendance
  };
}

SummaryPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  back: PropTypes.func.isRequired,
  addattendance: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  attendance: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { addattendance })(SummaryPage);
