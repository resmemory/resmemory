import React from 'react';
import Header from '../components/main/header.jsx';
import Chat from '../components/chat/Chat.jsx';

import './ChatPage.css';

function ChatPage() {
  return (
    <>
      <Header />
      <div className="chat-page">
        <Chat />
      </div>
    </>
  );
}
export default ChatPage;
