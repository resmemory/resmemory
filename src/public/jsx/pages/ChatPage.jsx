import React, { useEffect, useState } from 'react';
import Header from '../components/main/header.jsx';

// CSS 불러오기
import './ChatPage.css';

function ChatPage() {
  const [userNickname, setUserNickname] = useState('');
  const [socket, setSocket] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  // 컴포넌트가 렌더링 될
  useEffect(() => {
    async function initializeChat() {
      const response = await fetch(`./api/users`, {
        method: 'GET',
        headers: {
          Authorization: sessionStorage.getItem('Authorization'),
        },
      });

      const result = await response.json();

      if (!sessionStorage.getItem('Authorization')) {
        alert('로그인 이후 이용할 수 있습니다.');
        location.href = './';
      } else {
        const nickname = result.responseData.bodies.nickname;

        if (!nickname) {
          window.location.href = './login';
        }

        // 닉네임 설정
        setUserNickname(nickname);

        const newSocket = new WebSocket(`ws://13.209.87.137:8001/?nickname=${nickname}`);

        // 소켓 설정
        setSocket(newSocket);

        newSocket.addEventListener('message', async (event) => {
          const data = event.data;
          const dataParse = await JSON.parse(data);
          const message = dataParse.message;
          const senderNickname = dataParse.nickname;

          // 채팅 데이터를 화면에 추가
          displayMessage(message, senderNickname);
        });

        newSocket.addEventListener('close', (event) => {
          console.log('WebSocket 연결이 닫혔습니다.');
          const nicknameMessage = {
            type: 'nickname',
            value: `${nickname}`,
          };
          newSocket.send(JSON.stringify(nicknameMessage));
        });
      }
    }

    initializeChat();
  }, []);

  const displayMessage = (message, senderNickname) => {
    // 채팅 메시지 배열에 담기
    setChatMessages((prevMessages) => [...prevMessages, { message, senderNickname }]);
  };

  const sendMessage = () => {
    if (messageInput) {
      const data = {
        message: messageInput,
        nickname: userNickname,
      };

      if (userNickname == null) {
        return alert('로그인이 필요한 기능입니다.');
      }

      socket.send(JSON.stringify(data)); // 서버로 메시지 전송

      // 들어온 메시지 담기
      setMessageInput('');
    }
  };

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div>
      <Header />
      <div id="chat-container">
        <h1>그땐 채팅</h1>
        <div id="chat-header">
          <span>{userNickname} 님의 아름다운 채팅 문화 선도를 믿습니다.</span>
        </div>
        <div id="chat-messages">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.senderNickname === userNickname ? 'right-align' : 'left-align'
              }`}
            >
              {`${msg.senderNickname} : ${msg.message}`}
            </div>
          ))}
        </div>
        <div id="chat-input">
          <input
            type="text"
            id="message-input"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleInputKeyPress}
          />
          <button id="send-button" onClick={sendMessage}>
            전송
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
