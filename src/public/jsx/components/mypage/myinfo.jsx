import React, { useEffect, useState } from 'react';
import '../../components/mypage/myinfo.css';
import LoginForm from '../../components/mypage/loginform.jsx';
import NicknameModal from '../../components/mypage/nicknamemodal.jsx';

const MyInfo = () => {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleEditNickname = () => {
    setIsEditMode(true); // 수정 버튼 클릭 시 isEditMode를 true로 설정
    setIsModalOpen(true);
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
      location.reload();
      setIsModalOpen(false); // 모달 닫기
      setIsEditMode(false);
    } catch (error) {
      console.error('API 호출 중 오류가 발생했습니다.', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSignout = async () => {
    // 이전 코드와 동일
  };

  if (!userData) {
    // 로그인되지 않은 경우 로그인 폼을 보여줍니다.
    return <LoginForm />;
  }

  const isAdmin = userData.userId === 1;
  const isKakaoUser = userData.email === 'kakaoId';

  return (
    <div className="myinfo_first">
      <div className="nicknamebox">
        <p className="myinfo_nickname">닉네임</p>
        {isModalOpen ? (
          <NicknameModal
            onClose={handleModalClose}
            onSave={handleSaveNickname}
            currentNickname={userData.nickname}
          />
        ) : (
          <>
            <p className="myinfo_edit" onClick={handleEditNickname}>
              수정
            </p>
          </>
        )}
      </div>
      <span className="myinfo_mynickname">
        <p>{userData.nickname}</p>
      </span>
      <div className="myinfo_sign">
        <p className="myinfo_signselect">가입방식</p>
        <p className="myinfo_signmenu">{isKakaoUser ? '카카오톡' : '로컬'}</p>
      </div>
      <p className="myinfo_signout" onClick={handleSignout}>
        회원가입
      </p>
    </div>
  );
};

export default MyInfo;
