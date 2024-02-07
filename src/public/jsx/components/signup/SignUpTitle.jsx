import React from 'react';
import Logo from '../logo.jsx';
function SignUpTitle() {
  return (
    <>
      <div className="sign-up-title">
        <div id="logo">
          <Logo />
        </div>
        <div id="title">
          <h1>회원 가입</h1>
          <p>추억 쌓기, 같이 해요!</p>
        </div>
      </div>
    </>
  );
}

export default SignUpTitle;
