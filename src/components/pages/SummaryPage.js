import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';

class SummaryPage extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
  }

  onBack = e => {
    this.props.history.push('/addAttendance');
  };

  render() {
    return (
      <div>
        <h1>Summary Details</h1>
        <Button onClick={this.onBack}>Back</Button>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user
  };
}

SummaryPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  back: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(SummaryPage);
