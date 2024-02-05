import React, { useState, useEffect } from 'react';
import '../../components/sign/hello.css';

const Hello = () => {
  const [signupEmail, setSignupEmail] = useState('');
  const [receiveNumber, setReceiveNumber] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [buttonColor, setButtonColor] = useState('#b4b4b4');
  const [timer, setTimer] = useState(-1);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timerDisplay, setTimerDisplay] = useState('none');
  const [compeleteDisplay, setCompeleteDisplay] = useState('none');
  const [buttonDisplay, setButtonDisplay] = useState('block');

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
      if (result.responseData.code == 181) {
        setTimer(300);
      }
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
      if (result.responseData.code == 193) {
        setTimer(-1);
        setButtonColor('#427dee');
        setCompeleteDisplay('block');
        setTimerDisplay('none');
      }
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
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleCancel = () => {
    window.location.href = './login';
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timer == 300) {
        setButtonDisplay('none');
        setTimerDisplay('block');
      }
      if (timer > 0) {
        setTimer(timer - 1);
        setMinutes(Math.floor(timer / 60));

        if (timer % 60 < 10) {
          setSeconds('0' + (timer % 60));
        } else {
          setSeconds(timer % 60);
        }
      } else if (timer == 0) {
        alert('인증시간이 만료되었습니다.');
        clearInterval(intervalId);
        setButtonDisplay('block');
        setTimerDisplay('none');
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

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
              <button
                type="button"
                className="verify-button"
                onClick={handleEmail}
                style={{ display: buttonDisplay }}
              >
                인증
              </button>
              <button className="timer" style={{ display: timerDisplay }}>
                {minutes}:{seconds}
              </button>
              <button
                type="button"
                className="verify-button"
                style={{ display: compeleteDisplay, backgroundColor: buttonColor }}
              >
                완료
              </button>
            </div>

            <div className="signup-input">
              <input
                type="text"
                value={receiveNumber}
                onChange={(e) => setReceiveNumber(e.target.value)}
                placeholder="인증번호를 10분 이내로 입력해주세요."
              />
              <button
                type="button"
                className="verify-button"
                onClick={handleVerified}
                style={{ backgroundColor: buttonColor }}
              >
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
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="비밀번호 확인"
              />
              <button
                type="button"
                className="toggle-password-button"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? '숨기기' : '표시'}
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
