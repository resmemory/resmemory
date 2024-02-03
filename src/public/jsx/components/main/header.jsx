import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../components/main/header.css';

const Header = () => {
  const isLoggedIn = !!sessionStorage.getItem('Authorization');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

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
        console.log('로그아웃 성공');
        sessionStorage.removeItem('Authorization');
        window.location.href = './';
      } else {
        console.error('로그아웃 실패:', result);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
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

  return (
    <section className="HeaderSection">
      <div className="Header_first">
        <div>
          <a href="http://localhost:8000">
            <img src="/images/thn_logo.png" alt="thn_logo" />
          </a>
        </div>
        <ul className="Header_ul">
          {isLoggedIn && (
            <>
              <li className="thread_btn" onClick={handleThreadsClick}>
                스레드
              </li>
              <li className="chat_btn" onClick={handleChatClick}>
                채팅
              </li>
              <li className="mypage" onClick={handleMyPageClick}>
                마이페이지
              </li>
              <li className="logout" onClick={logout}>
                로그아웃
              </li>
            </>
          )}
          {!isLoggedIn && (
            <li className="login" onClick={handleLoginClick}>
              로그인
            </li>
          )}
        </ul>
      </div>
    </section>
  );
};
export default Header;
