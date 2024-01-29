import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    // 회원가입 동작 수행 (API 호출 등)
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <form onSubmit={handleLogin}>
      <label>
        Email:
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button type="submit">로그인</button>
    </form>
  );
};

export default LoginForm;
