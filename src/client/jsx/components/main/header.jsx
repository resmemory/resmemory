import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../components/main/Header.css';
import Logo from '../svg/Logo.jsx';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAdmin, setisAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await fetch('/api/users', {
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
      if (result.responseData.bodies.userId) {
        setIsLoggedIn(true);
        if (result.responseData.bodies.userId == 1) {
          setisAdmin(true);
        }
      }
    } catch (error) {
      console.error('데이터를 가져오는 중 에러가 발생했습니다.', error);
    }
  };
  const logout = async () => {
    try {
      const response = await fetch(`/api/logout`, {
        method: 'POST',
        headers: {
          Authorization: sessionStorage.getItem('Authorization'),
        },
      });

      const result = await response.json();
      console.log('Logout response:', result);
      alert(code[result.responseData.code]);

      if (result.responseData.code === 131) {
        sessionStorage.removeItem('Authorization');
        window.location.href = './';
      } else {
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  const handleWritePostClick = () => {
    navigate('/write');
  };

  const handleMyPageClick = () => {
    navigate('/mypage');
  };

  const handleThreadsClick = () => {
    navigate('/threads');
  };
  const handleChatClick = () => {
    navigate('/chat');
  };
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };
  const handleMenuClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <section>
      <Logo />
      <div>
        <button onClick={handleMenuClick}>☰</button>
      </div>
      <div>
        <ul className="web-nav">
          {isAdmin && <li onClick={handleAdminClick}>관리자</li>}
          {isLoggedIn && (
            <>
              <li onClick={handleWritePostClick}>글쓰기</li>
              <li onClick={handleThreadsClick}>스레드</li>
              <li onClick={handleChatClick}>채팅</li>
              <li onClick={handleMyPageClick}>마이페이지</li>
              <li id="logout" onClick={logout}>
                로그아웃
              </li>
            </>
          )}
          {!isLoggedIn && <li onClick={handleLoginClick}>로그인</li>}
        </ul>
        {isVisible && (
          <ul className="mobile-nav">
            {isAdmin && <li onClick={handleAdminClick}>관리자</li>}
            {isLoggedIn && (
              <>
                <li onClick={handleWritePostClick}>글쓰기</li>
                <li onClick={handleThreadsClick}>스레드</li>
                <li onClick={handleChatClick}>채팅</li>
                <li onClick={handleMyPageClick}>마이페이지</li>
                <li id="logout" onClick={logout}>
                  로그아웃
                </li>
              </>
            )}
            {!isLoggedIn && <li onClick={handleLoginClick}>로그인</li>}
          </ul>
        )}
      </div>
    </section>
  );
};
export default Header;
