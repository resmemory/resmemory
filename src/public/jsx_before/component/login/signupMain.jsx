import React from 'react';
import { Link } from 'react-router-dom';

const LoginMain = () => {
  const containerStyle = {
    position: 'relative',
    width: '400px', 
    height: '200px', 
  };

  const logoStyle = {
    position: 'absolute',
    top: '10px', 
    right: '10px', 
    width: '80px',
    height: '112px',
  };

  const textContainerStyle = {
    position: 'absolute',
    bottom: '10px', 
    left: '10px', 
  };

  return (
    <div style={containerStyle}>
      <img src="/images/thn_logo.png" alt="Logo" style={logoStyle} />
      <div style={textContainerStyle}>
        <h2 style={{ margin: 0, width: '132px', height: '42px' }}>회원가입</h2>
        <p style={{ margin: 0, width: '221px', height: '30px' }}>추억 쌓기, 같이 해요!</p>
      </div>
    </div>
  );
};

export default LoginMain;
