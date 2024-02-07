import React, { useState } from 'react';
import Verify from './Verify.jsx';

import './SignUp.css';

const SignUp = () => {
  const [signupPassword, setSignupPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    try {
      const emailValue = signupEmail.trim();
      const passwordValue = signupPassword.trim();
      const confirmValue = confirm.trim();
      const nicknameValue = nickname.trim();

      if (!emailValue || !passwordValue || !confirmValue || !nicknameValue) {
        alert('모든 필드를 입력해주세요.');
        return;
      }

      const response = await fetch(`./api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue,
          confirm: confirmValue,
          nickname: nicknameValue,
        }),
      });

      const result = await response.json();
      alert(code[result.responseData.code]);
      location.reload();
    } catch (error) {
      console.error('회원가입 중 에러 발생:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleCancel = () => {
    window.location.href = './login';
  };

  return (
    <>
      <Verify />
      <form>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력해주세요."
        />

        <input
          type={showPassword ? 'text' : 'password'}
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요."
        />
        <button
          id="show-password"
          type="button"
          className="toggle-password-button"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? '숨기기' : '표시'}
        </button>

        <input
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="비밀번호 확인"
        />
        <button
          type="button"
          className="toggle-password-button"
          onClick={toggleConfirmPasswordVisibility}
          id="show-confirm"
        >
          {showConfirmPassword ? '숨기기' : '표시'}
        </button>
        <div>
          <button id="close-button" type="button" onClick={handleCancel}>
            취소
          </button>
          <button id="signup-button" type="button" onClick={handleSignup}>
            가입하기
          </button>
        </div>
      </form>
    </>
  );
};

export default SignUp;
