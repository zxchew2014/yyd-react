import React from 'react';
import PropTypes from 'prop-types';
import { Button, Confirm, Tab } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { addattendance } from '../../actions/attendances';
import SummaryDisplay from '../displays/SummaryDisplay';
import StudentDisplay from '../displays/StudentDisplay';

class SummaryPage extends React.Component {
  state = { open: false };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  show = () => this.setState({ open: true });

  handleConfirm = () => this.onSubmit();
  handleCancel = () => this.setState({ open: false });

  onBack = e => {
    this.props.history.push('/add-attendance');
  };

  onSubmit = e => {
    this.props.addattendance(this.props.attendance);
    this.props.history.push('/add-attendance');
    this.setState({ open: false });
  };

  render() {
    const panes = [
      {
        menuItem: 'Summary',
        render: () => (
          <Tab.Pane>
            <SummaryDisplay attendance={this.props.attendance} />
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Students',
        render: () => (
          <Tab.Pane>
            <StudentDisplay attendance={this.props.attendance} />
          </Tab.Pane>
        )
      }
    ];

    return (
      <div class="summary-display">
        <Confirm
          open={this.state.open}
          confirmButton="Acknowledge"
          header="Acknowledgement Attendance"
          content="Press on Acknowledge, if information is correct."
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          size="fullscreen"
        />

        <h1>Summary Details</h1>
        <Tab panes={panes} />
        <br />
        <Button floated="left" onClick={this.onBack}>
          Back
        </Button>

        <Button primary floated="right" onClick={this.show}>
          Acknowledge Attendance
        </Button>
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
