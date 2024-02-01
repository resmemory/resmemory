import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import '../LoginPage.css';

const Button = ({ label, type }) => {
  let buttonStyle = 'button';

  switch (type) {
    case 'kakao':
      buttonStyle += ' button-kakao';
      break;
    case 'login':
      buttonStyle += ' button-login';
      break;
    default:
      break;
  }

  const path = type === 'login' ? '/general_login' : `/${type}.js`;

  return (
    <Link to={path} className="button-link">
      <button className={buttonStyle}>{label}</button>
    </Link>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

const LoginButton = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/general_login');
  };

  return (
    <>
      <Button label="카카오 로그인" type="kakao" />
      <Button label="로그인" type="login" onClick={handleLoginClick} />
      <div className="signuptext">
        <p>그땐이 처음이시라면?</p>
        <p className="signupbtn">회원가입</p>
      </div>
    </>
  );
};

export { Button, LoginButton };
