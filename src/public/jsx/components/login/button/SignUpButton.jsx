import React from 'react';
import { useNavigate } from 'react-router-dom';

import './SignUpButton.css';

function SignUpButton() {
  const navigate = useNavigate();
  const handleClickSignup = () => {
    navigate('/signup');
  };

  return (
    <>
      <div className="sign-up-text">
        <div>
          <p>그땐이 처음이시라면?</p>
          <button onClick={handleClickSignup}>회원 가입</button>
        </div>
      </div>
    </>
  );
}
export default SignUpButton;
