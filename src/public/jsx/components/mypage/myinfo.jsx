import React, { useEffect, useState } from 'react';
import '../../components/mypage/myinfo.css';

const MyInfo = () => {
  const [userData, setUserData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newNickname, setNewNickname] = useState('');

  useEffect(() => {
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
        setUserData(result.responseData.bodies);
      } catch (error) {
        console.error('데이터를 가져오는 중 에러가 발생했습니다.', error);
      }
    };

    fetchData();
  }, []);

  const handleEditNickname = async () => {
    const nickname = document.querySelector('.nickname').value;
    const response = await fetch(`./api/users/nickname`, {
      method: 'PATCH',
      headers: {
        Authorization: sessionStorage.getItem('Authorization'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nickname }),
    });
    const result = await response.json();
    alert(code[result.responseData.code]);
    location.reload();
    setIsEditMode(false);
  };

  const handleSignout = async () => {
    const message = prompt('회원탈퇴를 위해(회원 탈퇴를 희망합니다.)를 입력하세요.');

    if (!message) {
      // 사용자가 이유를 입력하지 않았을 경우
      alert('회원탈퇴를 위해(회원 탈퇴를 희망합니다.)를 올바르게 입력하세요.');
      return;
    }

    const response = await fetch(`./api/users`, {
      method: 'DELETE',
      headers: {
        Authorization: sessionStorage.getItem('Authorization'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const result = await response.json();
    alert(code[result.responseData.code]);

    if (result.responseData.code === 141) {
      sessionStorage.removeItem('Authorization');
      location.href = './';
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  const isAdmin = userData.userId === 1;
  const isKakaoUser = userData.email === 'kakaoId';
  return (
    <div className="myinfo_first">
      <div className="nicknamebox">
        <p className="myinfo_nickname">닉네임</p>
        {isEditMode ? (
          <>
            <input
              type="text"
              className="nickname"
              value={newNickname}
              placeholder="새로운 닉네임을 작성해주세요."
              onChange={(e) => setNewNickname(e.target.value)}
            />
            <p className="myinfo_edit" onClick={handleEditNickname}>
              저장
            </p>
          </>
        ) : (
          <p className="myinfo_edit" onClick={() => setIsEditMode(true)}>
            수정
          </p>
        )}
      </div>
      <span className="myinfo_mynickname">
        {isEditMode ? (
          <input
            type="text"
            className="nickname"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
          />
        ) : (
          <p>{userData.nickname}</p>
        )}
      </span>
      <div className="myinfo_sign">
        <p className="myinfo_signselect">가입방식</p>
        <p className="myinfo_signmenu">{isKakaoUser ? 'kakao' : '로컬'}</p>
      </div>
      <p className="myinfo_signout" onClick={handleSignout}>
        회원탈퇴
      </p>
    </div>
  );
};

export default MyInfo;
