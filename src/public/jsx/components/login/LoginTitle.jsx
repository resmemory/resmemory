import React from 'react';
import Logo from '../svg/logo.jsx';
import './LoginTitle.css';
const LoginMain = () => {
  return (
    <div className="login-main">
      <div id="logo">
        <Logo />
      </div>
      <div id="title">
        <h1>로그인하기</h1>
        <p>추억 쌓기, 같이 하실래요?</p>
      </div>
    </div>
  );
};

export default LoginMain;
