import React from 'react';
import LoginMain from '../components/login/LoginMain.jsx';
import { LoginButton } from '../components/login/button/loginButton.jsx';
import '../components/login/LoginPage.css';

function LoginPage() {
  return (
    <div className="pageContainer">
      <div className="contentContainer">
        <LoginMain />
        <LoginButton />
      </div>
    </div>
  );
}

export default LoginPage;
