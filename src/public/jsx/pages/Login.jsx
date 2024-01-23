import React from 'react';
import '../components/login/LoginPage.css';
import General_Login from '../components/login/General_Login.jsx';

const Login = () => {
  return (
    <div className="pageContainer">
      <div className="contentContainer">
        <General_Login />
      </div>
    </div>
  );
};

export default Login;
