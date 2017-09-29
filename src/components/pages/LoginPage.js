import React from "react"
import { Link } from "react-router-dom";
import LoginForm from "../forms/LoginForm";

class LoginPage extends React.Component {

  submit = data => {
    console.log(data);
  };

  //Parent of LoginForm
  render()
  {
    return (
      <div>
       <h1>Login Page</h1>

       <LoginForm submit={this.submit}/>
      </div>
    );
  }
}

//Old Code
//const LoginPage = () => (
//);

export default LoginPage;
