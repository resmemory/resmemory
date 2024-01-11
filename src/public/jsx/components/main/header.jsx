import React from 'react';
import '../../components/main/header.css';

const Header = () => {
  return (
    <section className="HeaderSection">
      <div className="Header_first">
        <img src="/images/thn_logo.png" alt="thn_logo" />
        <ul className="Header_ul">
          <li className="thread_btn">스레드</li>
          <li className="chat_btn">채팅</li>
          <li className="mypage">마이페이지</li>
          <li className="login">로그인</li>
          {/* <li className="logout">로그아웃</li> */}
        </ul>
      </div>
    </section>
  );
};

export default Header;
