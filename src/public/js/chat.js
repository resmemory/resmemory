document.addEventListener('DOMContentLoaded', () => {
  const chatHeader = document.querySelector('.chat-header');
  chatHeader.innerHTML = `<span id="nickname">${userNickname}</span>`;
});
const userNickname = localStorage.getItem('nickname');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// WebSocket 연결
const socket = new WebSocket(`ws://resmemory.shop/?nickname=${userNickname}`); // WebSocket 주소 설정

// 웹 소켓 연결 이벤트 핸들러
socket.addEventListener('open', (event) => {
  console.log('WebSocket 연결됨');
});

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
socket.addEventListener('error', (error) => {
  console.error('WebSocket 오류:', error);
});

// 메시지 전송 버튼 클릭 이벤트
sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    const data = {
      message: message,
      nickname: userNickname,
    };
    socket.send(JSON.stringify(data)); // 서버로 메시지 전송
    messageInput.value = '';
  }
});

socket.addEventListener('message', (event) => {
  const data = event.data;
  const dataParse = JSON.parse(data);
  const message = dataParse.message;
  const nickname = dataParse.nickname;

  // 채팅 데이터를 화면에 추가
  displayMessage(message, nickname);
});

// 채팅 메시지 화면에 표시
function displayMessage(message, nickname) {
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
