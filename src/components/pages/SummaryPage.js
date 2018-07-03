import React from 'react';
import PropTypes from 'prop-types';
import { Button, Confirm, Tab } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { addattendance } from '../../actions/attendances';
import SummaryDisplay from '../displays/SummaryDisplay';
import StudentDisplay from '../displays/StudentDisplay';

class SummaryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.onBack = this.onBack.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onBack = event => {
    const { history } = this.props;
    history.push('/add-attendance');
  };

  onSubmit = event => {
    const { attendance, history } = this.props;
    this.props.addattendance(attendance);
    history.push('/add-attendance');
    this.setState({ open: false });
  };

  handleConfirm = () => this.onSubmit();
  handleCancel = () => this.setState({ open: false });

  show = () => this.setState({ open: true });

  render() {
    const { attendance } = this.props;
    const { clock } = this.props.attendance;
    const { open } = this.state;

    const panes = [
      {
        menuItem: 'Summary',
        render: () => (
          <Tab.Pane>
            <SummaryDisplay attendance={attendance} />
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Students',
        render: () => (
          <Tab.Pane>
            <StudentDisplay attendance={attendance} />
          </Tab.Pane>
        )
      }
    ];

    return [
      <Confirm
        open={open}
        confirmButton="Acknowledge"
        header="Acknowledgement Attendance"
        content="Press on Acknowledge, if information is correct."
        onCancel={this.handleCancel}
        onConfirm={this.handleConfirm}
        size="fullscreen"
      />,

      <h1>Summary Details - {clock}</h1>,
      <Tab panes={panes} />,
      <br />,
      <Button floated="left" onClick={this.onBack}>
        Back
      </Button>,

      <Button primary floated="right" onClick={this.show}>
        Acknowledge Attendance
      </Button>
    ];
  }
}

function mapStateToProps({ attendance }) {
  return {
    attendance
  };
}

SummaryPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  addattendance: PropTypes.func.isRequired,
  attendance: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { addattendance })(SummaryPage);
