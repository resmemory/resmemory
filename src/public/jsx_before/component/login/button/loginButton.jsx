import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Button = ({ onClick, label, type }) => {
  let buttonStyle = {
    width: '400px',
    height: '60px',
    display: 'block',
    marginBottom: '10px',
    borderRadius: '10px',
    textAlign: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    outline: 'none',
    border: 'none',
  };

  // Apply specific styles based on the button type
  switch (type) {
    case 'kakao':
      buttonStyle.backgroundColor = '#FFEB00';
      buttonStyle.color = '#3C1E1E';
      break;
    case 'login':
      buttonStyle.backgroundColor = '#333333';
      buttonStyle.color = '#FFFFFF';
      break;

    default:
      break;
  }

  return (
    <Link to={`/${type}.js`} style={{ textDecoration: 'none' }}>
      <button onClick={onClick} style={buttonStyle}>
        {label}
      </button>
    </Link>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

const LoginButton = () => {
  return (
    <>
      <Button label="카카오 로그인" type="kakao" />
      <Button label="로그인" type="login" />
      <p>
        그땐이 처음이시라면?
        <Link to="/signup">회원가입</Link>
      </p>
    </>
  );
};

export { Button, LoginButton };
