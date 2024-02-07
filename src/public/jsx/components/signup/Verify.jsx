import React, { useState, useEffect } from 'react';

import './Verify.css';

function Verify() {
  const [signupEmail, setSignupEmail] = useState('');
  const [receiveNumber, setReceiveNumber] = useState('');
  const [buttonColor, setButtonColor] = useState('#b4b4b4');
  const [timer, setTimer] = useState(-1);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timerDisplay, setTimerDisplay] = useState('none');
  const [compeleteDisplay, setCompeleteDisplay] = useState('none');
  const [buttonDisplay, setButtonDisplay] = useState('block');

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

  return (
    <>
      <div className="verify">
        <div>
          <input
            type="email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            placeholder="이메일을 입력해주세요."
          />
          <button type="button" onClick={handleEmail} style={{ display: buttonDisplay }}>
            인증
          </button>

          <button className="timer" style={{ display: timerDisplay }}>
            {minutes}:{seconds}
          </button>
          <button type="button" style={{ display: compeleteDisplay, backgroundColor: buttonColor }}>
            완료
          </button>
        </div>
        <div>
          <input
            type="text"
            value={receiveNumber}
            onChange={(e) => setReceiveNumber(e.target.value)}
            placeholder="인증번호를 10분 이내로 입력해주세요."
          />
          <button type="button" onClick={handleVerified} style={{ backgroundColor: buttonColor }}>
            인증 확인
          </button>
        </div>
      </div>
    </>
  );
}

export default Verify;
