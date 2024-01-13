import React, { useState } from 'react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    window.location.reload();
  };

  return (
    <div className="myinfo_first">
      <p className="myinfo_login">로그인 해주세요</p>
      <img src="/images/thn_logo.png" alt="LogoImg" />
    </div>
  );
};

export default LoginForm;
