import React, { useState, useRef } from 'react';
import '../login/LoginPage.css';

const General_Login = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleClickSignup = () => {
    window.location.href = './signup';
  };

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
      <div className="containerStyle">
        <a href="./">
          <img src="../../../assets/image/thn_logo.png" alt="Logo" className="logoStyle2" />
        </a>
        <div className="textContainerStyle">
          <h2>로그인하기</h2>
          <p>추억 쌓기, 같이 하실래요?</p>
        </div>
      </div>
      <div className="General_LoginInput">
        <input type="email" placeholder="이메일" ref={emailRef} />
        <div className="passwordContainer">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            value={password}
            ref={passwordRef}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* 비밀번호 보기/숨기기 버튼 */}
          <button type="button" onClick={handleTogglePassword}>
            {showPassword ? '숨기기' : '표시'}
          </button>
          <p className="missingPW">비밀번호를 잊으셨나요?</p>
        </div>
        <button className="loginBtn" onClick={login}>
          로그인
        </button>
        <div className="signuptext1">
          <p>그땐이 처음이시라면?</p>
          <p className="signupbtn" onClick={handleClickSignup}>
            회원가입
          </p>
        </div>
      </div>
    </div>
  );
};

export default General_Login;
