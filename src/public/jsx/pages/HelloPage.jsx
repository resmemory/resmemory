import React from 'react';
import '../components/login/LoginPage.css';
import Hello from '../components/sign/hello.jsx';

const HelloPage = () => {
  return (
    <div className="pageContainer">
      <div className="contentContainer">
        <Hello />
      </div>
    </div>
  );
};

export default HelloPage;
