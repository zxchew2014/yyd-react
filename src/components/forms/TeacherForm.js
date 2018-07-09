import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import InlineError from '../messages/InlineError';

class TeacherForm extends React.Component {
  state = {
    data: {
      uid: this.props.currentUser.uid,
      phoneNumber: this.props.currentUser.phoneNumber,
      teacherName: '',
      accessToken: this.props.currentUser.accessToken
    },
    loading: false,
    errors: {}
  };

  onChange = e =>
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });

  onSubmit = e => {
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.props.submit(this.state.data);
    }
  };

  validate = data => {
    const errors = {};
    if (!data.teacherName) errors.teacherName = "Name can't be blank";
    return errors;
  };

  render() {
    const { data, errors, loading } = this.state;

    return (
      <Form onSubmit={this.onSubmit} loading={loading} size="huge" key="huge">
        <Form.Field>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={this.props.currentUser.phoneNumber}
            readOnly
          />
        </Form.Field>

        <Form.Field error={!!errors.teacherName}>
          <label htmlFor="teacherrName">Name:</label>
          <input
            type="text"
            id="teacherName"
            name="teacherName"
            placeholder="Please enter your name."
            value={data.teacherName}
            onChange={this.onChange}
          />
          {errors.teacherName && <InlineError text={errors.teacherName} />}
        </Form.Field>
        <Button primary>Update Teacher Detail</Button>
      </Form>
    );
  }
}

TeacherForm.propTypes = {
  submit: PropTypes.func.isRequired,
  currentUser: PropTypes.object
};

export default TeacherForm;
