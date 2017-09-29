import React from 'react';
import { Form, Button } from "semantic-ui-react";
import Validator from 'validator'
import InlineError from "../messages/InlineError";
import PropTypes from 'prop-types';

class LoginForm extends React.Component {
  state = {
    data: {
      email:'',
      password: ''

    },
    loading: false,
    errors: {}
  };

  //For Text Field (if there is number or dropdown need do other)
  onChange = e => this.setState({data : {...this.state.data, [e.target.name] : e.target.value}});


  //On Submit Form
  onSubmit = () => {
    const errors = this.validate(this.state.data);
    this.setState({errors});
    if (Object.keys(errors).length === 0) {
      this.props.submit(this.state.data);
    }

  }

  //Client Side Validatation
  validate = (data) => {
    const errors = {};
    if(!data.password) errors.password = "Cannot be blanks";
    if(!Validator.isEmail(data.email)) errors.email = "Invalid email";
    return errors;
  }

  render() {
    const {data, errors} = this.state;

    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Field error={!!errors.email}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Please enter email" value={data.email} onChange={this.onChange} />
          {errors.email && <InlineError text={errors.email} />}
        </Form.Field>

        <Form.Field  error={!!errors.password}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Please enter password" value={data.password} onChange={this.onChange} />
          {errors.password && <InlineError text={errors.password} />}
        </Form.Field>

       <Button primary>Login</Button>
      </Form>
    );
  }
}

//Children of LoginPage
LoginForm.propTypes = {
  submit: PropTypes.func.isRequired
}
export default LoginForm;
