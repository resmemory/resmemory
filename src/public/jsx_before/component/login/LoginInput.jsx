import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginInput = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function loginInput() {}
  const handleLogin = () => {
    // 로그인 로직 작성
    console.log('Logging in with:', email, password);
  };

  return (
    <div>
      <img src="/assets/image/logo.png" alt="Logo" style={{ maxWidth: '100%', height: 'auto' }} />

      <h2>로그인하기</h2>
      <p> 추억 쌓기, 같이 하실래요?</p>
      <form>
        <label>이메일:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />
        <label>비밀번호:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <Link to="/passwordFind">비밀번호를 잊으셨나요?</Link>
        <button type="button" onClick={handleLogin}>
          그땐이 처음이시라면? <Link to="/passwordFind">비밀번호를 잊으셨나요?</Link>
        </button>
      </form>
    </div>
  );
};

export default LoginInput;
