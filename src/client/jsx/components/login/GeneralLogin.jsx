import React, { useState, useRef } from 'react';
import LoginMain from './LoginTitle.jsx';
import SignUpButton from './button/SignUpButton.jsx';
import './GeneralLogin.css';

const General_Login = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const login = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const response = await fetch(`./api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    alert(code[result.responseData.code]);

    if (result.responseData.code === 121 || result.responseData.code === 123) {
      sessionStorage.setItem('Authorization', response.headers.get('Authorization'));
      window.location.href = './';
    }
  };

  return (
    <div>
      <LoginMain />
      <div className="general-login">
        <input type="email" placeholder="이메일" ref={emailRef} />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호"
          value={password}
          ref={passwordRef}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* 비밀번호 보기/숨기기 버튼 */}
        <button id="show-password" type="button" onClick={handleTogglePassword}>
          {showPassword ? '숨기기' : '표시'}
        </button>
        <button id="login-button" onClick={login}>
          로그인
        </button>
      </div>
      <SignUpButton />
    </div>
  );
};

export default General_Login;
