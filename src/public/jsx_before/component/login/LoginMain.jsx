import React from 'react';
import { Link } from 'react-router-dom';

const LoginMain = () => {
  const containerStyle = {
    position: 'relative',
    width: '400px', // Set the width to 400px
    height: '200px', // Set the height to 200px
  };

  const logoStyle = {
    position: 'absolute',
    top: '10px', // Adjust top distance as needed
    right: '10px', // Adjust right distance as needed
    width: '80px',
    height: '112px',
  };

  const textContainerStyle = {
    position: 'absolute',
    bottom: '10px', // Adjust bottom distance as needed
    left: '10px', // Adjust left distance as needed
  };

  return (
    <div style={containerStyle}>
      <img src="/images/thn_logo.png" alt="Logo" style={logoStyle} />
      <div style={textContainerStyle}>
        <h2 style={{ margin: 0, width: '132px', height: '42px' }}>로그인하기</h2>
        <p style={{ margin: 0, width: '221px', height: '30px' }}>추억 쌓기, 같이 하실래요?</p>
      </div>
    </div>
  );
};

export default LoginMain;
