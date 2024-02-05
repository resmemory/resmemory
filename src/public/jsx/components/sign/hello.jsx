import React, { useState } from 'react';
import '../../components/sign/hello.css';

const Hello = () => {
  const [signupEmail, setSignupEmail] = useState('');
  const [receiveNumber, setReceiveNumber] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmail = async () => {
    try {
      const emailValue = signupEmail.trim();

      if (!emailValue) {
        alert('이메일을 입력해주세요.');
        return;
      }

      const response = await fetch(`./api/mail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailValue }),
      });

      const result = await response.json();
      alert(code[result.responseData.code]);
    } catch (error) {
      console.error('이메일 전송 중 에러 발생:', error);
    }
  };

  const handleVerified = async () => {
    try {
      const emailValue = signupEmail.trim();
      const receiveNumberValue = receiveNumber.trim();

      if (!emailValue || !receiveNumberValue) {
        alert('이메일과 인증 코드를 입력해주세요.');
        return;
      }

      const response = await fetch(`./api/verified`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiveNumber: receiveNumberValue, email: emailValue }),
      });

      const result = await response.json();
      alert(code[result.responseData.code]);
    } catch (error) {
      console.error('코드 확인 중 에러 발생:', error);
    }
  };

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

  const handleCancel = () => {
    alert('취소 버튼이 눌렸습니다.');
  };

  return (
    <div>
      <div className="containerStyle">
        <a href="./">
          <img src="../../../assets/image/thn_logo.png" alt="Logo" className="logoStyle2" />
        </a>
        <div className="textContainerStyle">
          <h2>회원 가입</h2>
          <p>추억 쌓기, 같이 해요!</p>
        </div>
      </div>

      <div className="signup-container">
        <form>
          <div className="all-input">
            <div className="signup-input">
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="이메일을 입력해주세요."
              />
              <button type="button" className="verify-button" onClick={handleEmail}>
                인증
              </button>
            </div>
            <div className="signup-input">
              <input
                type="text"
                value={receiveNumber}
                onChange={(e) => setReceiveNumber(e.target.value)}
                placeholder="인증번호를 10분 이내로 입력해주세요."
              />
              <button type="button" className="verify-button" onClick={handleVerified}>
                인증 확인
              </button>
            </div>
            <div className="double-input">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력해주세요."
              />
            </div>
            <div className="double-input">
              <input
                type={showPassword ? 'text' : 'password'}
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요."
              />
              <button
                type="button"
                className="toggle-password-button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '숨기기' : '표시'}
              </button>
            </div>
            <div className="double-input">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="비밀번호 확인"
              />
              <button
                type="button"
                className="toggle-password-button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '숨기기' : '표시'}
              </button>
            </div>
          </div>
          <div className="TwoBtn">
            <button className="action-button" type="button" onClick={handleCancel}>
              취소
            </button>
            <button className="signup-button" type="button" onClick={handleSignup}>
              가입하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Hello;
