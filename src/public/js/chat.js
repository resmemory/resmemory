document.addEventListener('DOMContentLoaded', () => {
  profile();
});

let userNickname;
let socket;
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

async function profile() {
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
    userNickname = result.responseData.bodies.nickname;

    socket = new WebSocket(`wss://resmemory.shop:3000/?nickname=${userNickname}`);
    const chatHeader = document.querySelector('.chat-header');
    chatHeader.innerHTML = `<span id="nickname">${userNickname} 님의 아름다운 채팅 문화 선도를 믿습니다.</span>`;

    socket.addEventListener('message', async (event) => {
      const data = event.data;
      const dataParse = await JSON.parse(data);
      const message = dataParse.message;
      const nickname = dataParse.nickname;

      // 채팅 데이터를 화면에 추가
      await displayMessage(message, nickname);
    });
  }

  // 웹 소켓 연결 이벤트 핸들러
  socket.addEventListener('open', (event) => {});

  // 웹 소켓 연결 닫기 이벤트 핸들러
  socket.addEventListener('close', (event) => {
    console.log('WebSocket 연결이 닫혔습니다.');
    const nicknameMessage = {
      type: 'nickname',
      value: `${userNickname}`,
    };
    socket.send(JSON.stringify(nicknameMessage));
  });

  // 웹 소켓 에러 이벤트 핸들러
  socket.addEventListener('error', (error) => {});

  // 메시지 전송 버튼 클릭 이벤트
  sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
      const data = {
        message: message,
        nickname: userNickname,
      };
      if (userNickname == undefined) {
        return alert('로그인이 필요한 기능입니다.');
      }
      socket.send(JSON.stringify(data)); // 서버로 메시지 전송
      messageInput.value = '';
    }
  });

  messageInput.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      sendButton.click();
    }
  });

  // 채팅 메시지 화면에 표시
  async function displayMessage(message, nickname) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${nickname}: ${message}`;

    // 클래스 이름을 동적으로 설정
    messageElement.classList.add('chat-message');

    if (nickname === userNickname) {
      // 사용자 닉네임과 채팅 메시지의 닉네임이 같으면 오른쪽 정렬
      messageElement.classList.add('right-align');
    } else {
      // 다르면 왼쪽 정렬
      messageElement.classList.add('left-align');
    }
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // 스크롤 아래로 이동
  }
  // 웹 소켓 연결 닫기 이벤트 핸들러
  socket.addEventListener('close', (event) => {
    const nicknameMessage = {
      type: 'nickname',
      value: `${userNickname}`,
    };
    socket.send(JSON.stringify(nicknameMessage));
  });
}
