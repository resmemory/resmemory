import React, { useEffect, useState } from 'react';

import Logo from '../svg/Logo.jsx';

import './MyInfo.css';

const MyInfo = () => {
  const [userData, setUserData] = useState(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const fetchData = async () => {
    try {
      const response = await fetch('./api/users', {
        method: 'GET',
        headers: {
          Authorization: sessionStorage.getItem('Authorization'),
        },
      });

      if (!response.ok) {
        console.error('서버로부터 데이터를 가져오는 중 에러가 발생했습니다.');
        return;
      }

      const result = await response.json();
      if (result.responseData.code == 171) {
        setUserData(result.responseData.bodies);
      }
    } catch (error) {
      console.error('데이터를 가져오는 중 에러가 발생했습니다.', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleModalOn = () => {
    const target = document.querySelector('.modal');
    target.style.display = 'block';
  };

  const handleModalClose = () => {
    const target = document.querySelector('.modal');
    target.style.display = 'none';
  };

  const handlePWChangeModalOn = () => {
    const target = document.querySelector('#PWChange');
    target.style.display = 'block';
  };

  const handlePWChangeModalClose = () => {
    const target = document.querySelector('#PWChange');
    target.style.display = 'none';
  };

  const handleSaveNickname = async (nickname) => {
    try {
      const response = await fetch(`./api/users/nickname`, {
        method: 'PATCH',
        headers: {
          Authorization: sessionStorage.getItem('Authorization'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname }),
      });

      if (!response.ok) {
        console.error('서버로부터 응답이 실패했습니다.');
        return;
      }

      const result = await response.json();
      alert(code[result.responseData.code]);
      handleModalClose();
      location.reload();
    } catch (error) {
      console.error('API 호출 중 오류가 발생했습니다.', error);
    }
  };

  const handlePWChange = async (password, confirm) => {
    try {
      const response = await fetch(`./api/users/password`, {
        method: 'PATCH',
        headers: {
          Authorization: sessionStorage.getItem('Authorization'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, confirm }),
      });

      if (!response.ok) {
        console.error('서버로부터 응답이 실패했습니다.');
        return;
      }

      const result = await response.json();
      alert(code[result.responseData.code]);
      handlePWChangeModalClose();
      location.reload();
    } catch (error) {
      console.error('API 호출 중 오류가 발생했습니다.', error);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmVisibility = () => {
    setShowConfirm((prevShowConfirm) => !prevShowConfirm);
  };

  const handleSignout = async () => {
    // 사용자로부터 입력받은 메시지
    const userConfirmation = prompt(
      '회원탈퇴를 진행하려면 "회원 탈퇴를 희망합니다."를 입력하세요.',
    );

    // 확인 메시지
    if (userConfirmation === '회원 탈퇴를 희망합니다.') {
      try {
        // 서버로 회원탈퇴 요청 전송
        const response = await fetch(`./api/users`, {
          method: 'DELETE',
          headers: {
            Authorization: sessionStorage.getItem('Authorization'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userConfirmation }),
        });

        if (!response.ok) {
          console.error('서버로부터 응답이 실패했습니다.');
          return;
        }

        const result = await response.json();
        alert(code[result.responseData.code]);

        if (result.responseData.code === 141) {
          // 탈퇴 성공 시 세션 제거 및 페이지 이동
          sessionStorage.removeItem('Authorization');
          location.href = './';
        }
      } catch (error) {
        console.error('API 호출 중 오류가 발생했습니다.', error);
      }
    } else {
      alert('회원탈퇴를 취소하셨습니다.');
    }
  };

  return (
    <>
      {userData ? (
        <>
          <div className="my-info">
            <div>
              <p>닉네임</p>
              <button onClick={handleModalOn}>수정</button>
            </div>
            <div id="nickname">
              <p>{userData.nickname}</p>
            </div>
            <div>
              <p>가입방식</p>
              <div
                className={`myinfo_user_type ${
                  userData.email === 'kakaoId' ? 'kakaoUser' : 'localUser'
                }`}
              >
                {userData.email === 'kakaoId' ? 'kakao' : 'local'}
              </div>
            </div>
            <button id="signout" onClick={handleSignout}>
              회원탈퇴
            </button>
          </div>
          <div className="modal">
            <div className="modal-content">
              <h1>회원 정보 수정</h1>
              <input
                type="text"
                value={newNickname}
                placeholder={`${userData.nickname}`}
                onChange={(e) => setNewNickname(e.target.value)}
              />
              <div className="edit-info">
                <button
                  onClick={() => {
                    handleSaveNickname(newNickname);
                  }}
                >
                  닉네임 변경
                </button>
                <button id="close" onClick={handleModalClose}>
                  취소
                </button>
              </div>
              <div className="edit-info" id="password-change">
                <button id="my-info-password-change" onClick={handlePWChangeModalOn}>
                  비밀번호 변경 ➜
                </button>
              </div>
            </div>
          </div>

          <div className="modal" id="PWChange">
            <div className="modal-content">
              <h2>비밀번호 변경</h2>
              <div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  placeholder={`비밀번호를 입력하세요.`}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button id="show-password" type="button" onClick={togglePasswordVisibility}>
                  {showPassword ? '숨기기' : '표시'}
                </button>
              </div>
              <div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  placeholder={`확인 비밀번호를 입력하세요.`}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <button id="show-confirm-password" type="button" onClick={toggleConfirmVisibility}>
                  {showConfirm ? '숨기기' : '표시'}
                </button>
              </div>
              <div className="edit-info">
                <button
                  onClick={() => {
                    handlePWChange(confirm, password);
                  }}
                >
                  변경
                </button>
                <button id="close" onClick={handlePWChangeModalClose}>
                  취소
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="login-required">
            <Logo />
            <p>로그인 해주세요</p>
          </div>
        </>
      )}
    </>
  );
};

export default MyInfo;
