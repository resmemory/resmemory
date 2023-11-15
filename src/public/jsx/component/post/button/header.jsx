import React, { useEffect, useState } from 'react';

const headerBtns = () => {
  const [isAuthorized, setIsAuthorized] = useState(!!sessionStorage.getItem('Authorization'));

  useEffect(() => {
    // 컴포넌트가 마운트될 때 실행되는 코드
    updateHeaderButtons();

    // 컴포넌트가 언마운트될 때 정리(clean-up) 함수
    return () => {
      // 정리(clean-up) 코드 (예: 이벤트 리스너 해제 등)
    };
  }, []); // 빈 배열을 전달하여 componentDidMount와 같은 효과를 얻습니다.

  const updateHeaderButtons = () => {
    // 헤더 버튼 엘리먼트들을 찾기
    const loginButton = document.querySelector('.login');
    const logoutButton = document.querySelector('.logout');
    const mypageButton = document.querySelector('.mypage');

    if (isAuthorized) {
      // 사용자가 로그인되어 있을 때
      logoutButton.style.display = 'block';
      mypageButton.style.display = 'block';
      loginButton.style.display = 'none';
    } else {
      // 사용자가 로그인되어 있지 않을 때
      loginButton.style.display = 'block';
      logoutButton.style.display = 'none';
      mypageButton.style.display = 'none';
    }
  };

  return (
    <div>
      {/* 헤더 버튼들을 여기에 JSX로 추가하거나, 필요에 따라 다른 컴포넌트로 분리할 수 있습니다. */}
      <button className="login" onClick={() => setIsAuthorized(true)}>
        Login
      </button>
      <button className="logout" onClick={() => setIsAuthorized(false)}>
        Logout
      </button>
      <button className="mypage">My Page</button>
    </div>
  );
};

export default headerBtns;
