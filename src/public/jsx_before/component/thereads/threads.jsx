import React from 'react';

function Logo() {
  return (
    <img
      className="thn_logo"
      src="./assets/image/thn_logo.png"
      alt="thn_logo"
      onClick={() => (window.location.href = './')}
    />
  );
}

function NavControl() {
  return (
    <div className="navControl">
      <Logo />
      <HeaderButtons />
    </div>
  );
}

function HeaderButtons() {
  return (
    <div className="headerBtns">
      <button className="logout" style={{ display: 'none' }} onClick={logout}>
        로그아웃
      </button>
      <button
        className="mypage"
        style={{ display: 'none' }}
        onClick={() => (window.location.href = './profile')}
      >
        마이페이지
      </button>
      <button
        className="login"
        style={{ display: 'none' }}
        onClick={() => (window.location.href = './login')}
      >
        회원가입/로그인
      </button>
      <button className="write" style={{ display: 'none' }} onClick={writingPost}>
        글 작성하기
      </button>
    </div>
  );
}

function WriteThreadBox() {
  return (
    <div className="writeThreadBox">
      <input className="writeThread" type="text" placeholder="예쁜말 고운 말을 사용해 주세요!" />
      <div>
        <button className="writeThreadBtn" onClick={writeThread}>
          작성
        </button>
      </div>
    </div>
  );
}

function ThreadBox() {
  return (
    <div className="threadbox">
      <h1>소통하라 익명시대</h1>
      <WriteThreadBox />
      <div id="threadList"></div>
    </div>
  );
}

function ChatButton() {
  return (
    <div className="chatbox">
      <button
        className="chat_btn"
        onClick={() => window.open('./chat')}
        style={{ display: 'none' }}
      >
        채팅
      </button>
    </div>
  );
}

function Main() {
  return (
    <main>
      <div className="container">
        <ThreadBox />
      </div>
    </main>
  );
}

function Footer() {
  return <footer>제작</footer>;
}

function App() {
  return (
    <article>
      <NavControl />
      <Main />
      <ChatButton />
      <Footer />
    </article>
  );
}

export default App;
