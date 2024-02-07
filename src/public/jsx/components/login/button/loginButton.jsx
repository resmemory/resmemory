import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginButton.css';

const LoginButton = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/general_login');
  };

  const handleKakaoLoginClick = () => {
    navigate('/kakao_login');
  };

  return (
    <>
      <img
        src="../../../../assets/image/kakao_login_large_wide.png"
        onClick={handleKakaoLoginClick}
        id="kakao-login-button"
      />
      <button id="login-button" onClick={handleLoginClick}>
        로그인
      </button>
    </>
  );
};

export default LoginButton;
