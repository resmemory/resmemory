import React from 'react';
import LoginMain from '../../jsx_before/component/login/LoginMain.jsx';
import { LoginButton } from '../../jsx_before/component/login/button/loginButton.jsx';

function LoginPage() {
  return (
    <div style={pageContainer}>
      <div style={contentContainer}>
        <LoginMain />
        <div style={{ marginTop: '30px' }}></div>
        <LoginButton />
      </div>
    </div>
  );
}

const pageContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
};

const contentContainer = {
  maxWidth: '400px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '10px', // Using marginTop instead of paddingTop
  padding: '90px 0px 100px 0px',
};

export default LoginPage;
