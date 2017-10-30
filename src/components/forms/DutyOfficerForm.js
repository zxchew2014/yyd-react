import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import InlineError from '../messages/InlineError';
import firebase, { firebaseAuth } from '../../firebase';

class DutyOfficerForm extends React.Component {
  state = {
    data: {
      uid: this.props.currentUser.uid,
      phoneNumber: this.props.currentUser.phoneNumber,
      dutyOfficerName: '',
      accessToken: this.props.currentUser.accessToken
    },
    loading: false,
    updateSuccess: false,
    errors: {}
  };

  onChange = e =>
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });

  validate = data => {
    const errors = {};
    if (!data.dutyOfficerName)
      errors.dutyOfficerName = "Duty Officer name can't be blank";
    return errors;
  };

  onSubmit = e => {
    e.preventDefault();
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.props.submit(this.state.data);

      // firebaseAuth.currentUser
      //   .getIdToken(/* forceRefresh */ true)
      //   .then(accessTokens => {
      //     this.setState({ loading: true });
      //
      //     this.setState({
      //       data: { ...this.state.data, accessToken: accessTokens }
      //     });
      //
      //     this.props.submit(this.state.data).catch(err => {
      //       console.log(err);
      //       this.setState({
      //         errors: err.response.data.errors,
      //         loading: false
      //       });
      //     });
      //   })
      //   .catch(function(error) {
      //     // Handle error
      //     console.log(error);
      //   });
    }
  };

  render() {
    const { data, errors, loading, updateSuccess } = this.state;

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

        <Form.Field>
          <label htmlFor="dutyOfficerName">Duty Officer Name:</label>
          <input
            type="text"
            id="dutyOfficerName"
            name="dutyOfficerName"
            placeholder="Please enter your name."
            value={data.dutyOfficerName}
            onChange={this.onChange}
          />
          {errors.dutyOfficerName && (
            <InlineError text={errors.dutyOfficerName} />
          )}
        </Form.Field>
        <Button primary>Update Duty Officer Details</Button>
      </Form>
    );
  }
}

DutyOfficerForm.propTypes = {
  submit: PropTypes.func.isRequired
};

export default DutyOfficerForm;
