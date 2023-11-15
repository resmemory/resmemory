import React, { useEffect, useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('Authorization'));

  useEffect(() => {
    buttons();
  }, [isAuthenticated]);

  const buttons = () => {
    const login = document.querySelector('.login');
    const logout = document.querySelector('.logout');
    const mypage = document.querySelector('.mypage');
    const write = document.querySelector('.write');
    const thread = document.querySelector('.thread_btn');
    const chat = document.querySelector('.chat_btn');

    if (isAuthenticated) {
      logout.style.display = 'block';
      mypage.style.display = 'block';
      write.style.display = 'block';
      thread.style.display = 'block';
      chat.style.display = 'block';
      login.style.display = 'none';
    } else {
      login.style.display = 'block';
      logout.style.display = 'none';
      mypage.style.display = 'none';
      write.style.display = 'none';
      thread.style.display = 'none';
      chat.style.display = 'none';
    }
  };

  return (
    <div>
      {/* 여기에서 다른 컴포넌트 및 내용을 렌더링합니다 */}
    </div>
  );
}

export default App;
