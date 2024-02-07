import React from 'react';
import SignUp from '../components/signup/Signup.jsx';
import SignUpTitle from '../components/signup/SignUpTitle.jsx';

import './SignUpPage.css';

const SingUpPage = () => {
  return (
    <div className="sign-up">
      <div>
        <SignUpTitle />
        <SignUp />
      </div>
    </div>
  );
};

export default SingUpPage;
