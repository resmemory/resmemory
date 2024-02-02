import React, { useEffect, useState } from 'react';
import '../../components/mypage/myinfo.css';
import LoginForm from '../../components/mypage/loginform.jsx';

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

  const handleModalOn = () => {
    const target = document.querySelector('.modal');
    target.style.display = 'block';
  };

  const handleModalClose = () => {
    const target = document.querySelector('.modal');
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
      location.reload();
      handleModalClose();
    } catch (error) {
      console.error('API 호출 중 오류가 발생했습니다.', error);
    }
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
        <p className="myinfo_edit" onClick={handleModalOn}>
          수정
        </p>
      </div>
      <span className="myinfo_mynickname">
        <p>{userData.nickname}</p>
      </span>
      <div className="myinfo_sign">
        <p className="myinfo_signselect">가입방식</p>
        <p className="myinfo_signmenu">{isKakaoUser ? '카카오톡' : '로컬'}</p>
      </div>
      <p className="myinfo_signout" onClick={handleSignout}>
        회원탈퇴
      </p>
      <div className="modal">
        <div className="modal-content">
          <h2>닉네임 변경</h2>
          <input type="text" value={newNickname} placeholder={`${userData.nickname}`} />
          <div className="editBtn">
            <p
              onClick={() => {
                handleSaveNickname(newNickname);
              }}
            >
              변경
            </p>
            <p className="close" onClick={handleModalClose}>
              취소
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInfo;
