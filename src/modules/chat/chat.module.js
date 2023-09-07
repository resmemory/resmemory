import ChatServer from './chat.server';
import dotenv from 'dotenv';
import {connect} from './db/mongoose'
dotenv.config();
connect();

const chatServer = new ChatServer(
  process.env.CHAT_PORT ? Number(process.env.CHAT_PORT) : 3000,
  (socket, message, userId) => {
    // 채팅 클라이언트로부터 받은 메시지를 모든 클라이언트에게 전송
    console.log('chat:', message);
    chatServer.broadcastMessage(message);
  },
);
