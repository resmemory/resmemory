import React, { useState } from 'react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // 로그인 처리를 수행하고, 필요한 경우 상위 컴포넌트로 상태 전달 등을 수행합니다.
    // 예: AuthService.login(username, password);

    // 로그인이 성공하면 페이지 새로고침 또는 다른 로직을 수행할 수 있습니다.
    window.location.reload();
  };

  return (
    <div className="myinfo_first">
      <p className="myinfo_login">로그인 해주세요.</p>
      <img src="/images/thn_logo.png" alt="LogoImg" />
    </div>
  );
};

export default LoginForm;
