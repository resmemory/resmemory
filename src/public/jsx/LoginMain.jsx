import React from 'react';
import { Link } from 'react-router-dom';

const LoginMain = () => {
  return (
    <div>
      <img src="/assets/image/logo.png" alt="Logo" style={{ maxWidth: '100%', height: 'auto' }} />

      <h2>로그인하기</h2>
      <p> 추억 쌓기, 같이 하실래요?</p>
      <Link to="/kakaoLogin">카카오 로그인</Link>
      <Link to="/login">Login</Link>
      <p>그땐이 처음이시라면?</p>
      <Link to="/signup">회원가입</Link>
    </div>
  );
};

export default LoginMain;
