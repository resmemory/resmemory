import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { CountersManager, PairingCounterManager } from './counter.collection';
dotenv.config();

// MongoDB 연결 설정
const connect = () => {
  mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB 연결 오류:'));
  db.once('open', () => {
    console.log('MongoDB에 연결되었습니다.');
  });
};

// MongoDB 스키마 정의
const chatSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now, expires: '1d' },
});

const chatLogSchema = new mongoose.Schema({
  nickname: String,
  timestamp: { type: Date, default: Date.now },
  sequence: Number,
  pairing: Number, // 닉네임 당 데이터가 쌓일 때마다 증가하는 pairing 필드
});

chatLogSchema.pre('save', async function (next) {
  if (!this.sequence) {
    try {
      this.sequence = await CountersManager.getSequence('chatLogSequence');
    } catch (error) {
      console.error('Error getting sequence:', error);
      throw error;
    }
  }

  if (!this.pairing) {
    try {
      this.pairing = await PairingCounterManager.getPairingSequence(this.nickname);
    } catch (error) {
      console.error('Error getting pairing:', error);
      throw error;
    }
  }
  const maxLog = 5;
  const logsToDelete = await ChatLog.find({ nickname: this.nickname })
    .sort({ pairing: -1 })
    .skip(maxLog - 1) // 최대 5개 이상의 로그만큼 스킵
    .exec();

  if (logsToDelete.length > 0) {
    // 삭제할 로그가 있는 경우 삭제
    await ChatLog.deleteMany({ _id: { $in: logsToDelete.map((log) => log._id) } });
  }
  next();
});

// ChatMessage 모델 정의
const ChatMessage = mongoose.model('chatmessages', chatSchema);
const ChatLog = mongoose.model('ChatLog', chatLogSchema);

async function getTimes(nickname) {
  try {
    const chatLog = await ChatLog.find({ nickname: `${nickname}` })
      .sort({ timestamp: -1 }) // timestamp를 내림차순으로 정렬
      .limit(1) // 최신 데이터 1개만 가져오기
      .exec();

    const result = [];

    if (chatLog) {
      result.push({ Timestamp: chatLog[0].timestamp });
    }

    const beforeMessages = [];
    const messages = await ChatMessage.find({
      timestamp: {
        $gte: new Date(result[0].Timestamp - 5 * 60 * 1000),
        $lte: result[0].Timestamp,
      },
    }).exec();

    messages.forEach((message) => {
      const { message: messageJSON } = message;
      const parsedMessage = JSON.parse(messageJSON);
      const messageObject = {
        message: parsedMessage.message,
        nickname: parsedMessage.nickname,
      };
      // 중복 확인
      beforeMessages.push(messageObject);
    });

    // 중복 확인 후에 push로 메시지 추가
    beforeMessages.reverse().splice(10);
    beforeMessages.reverse();
    return beforeMessages;
  } catch (error) {
    console.error('Error fetching chat logs:', error);
    throw error;
  }
}

export { connect, ChatMessage, ChatLog, getTimes };
