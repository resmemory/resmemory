import React, { useEffect, useState } from 'react';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('Authorization')) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // 여기에 버튼을 누를 시 해당하는 html로 이동하게 구현할것
  return (
    <div>
      {/* 로그인된 경우 */}
      {isLoggedIn && (
        <div>
          <button className="logout">로그아웃</button>
          <button className="mypage">마이페이지</button>
          <button className="write">글쓰기</button>
          <button className="thread_btn">스레드</button>
          <button className="chat_btn">채팅</button>
        </div>
      )}

      {/* 로그인되지 않은 경우 */}
      {!isLoggedIn && (
        <div>
          <button className="login">로그인</button>
        </div>
      )}
    </div>
  );
};

export default Header;
