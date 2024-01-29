import React from 'react';
import '../login/LoginPage.css';

const LoginMain = () => {
  return (
    <div className="containerStyle">
      <img src="/images/thn_logo.png" alt="Logo" className="logoStyle" />
      <div className="textContainerStyle">
        <h2>로그인하기</h2>
        <p>추억 쌓기, 같이 하실래요?</p>
      </div>
    </div>
  );
};

export default LoginMain;
