import React from 'react';

import LoginTitle from '../components/login/LoginTitle.jsx';
import LoginButton from '../components/login/button/loginButton.jsx';
import SignUpButton from '../components/login/button/SignUpButton.jsx';

import './LoginPage.css';

function LoginPage() {
  return (
    <div className="login">
      <div>
        <LoginTitle />
        <LoginButton />
        <SignUpButton />
      </div>
    </div>
  );
}

export default LoginPage;
