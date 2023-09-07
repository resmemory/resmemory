import mongoose from 'mongoose';

// MongoDB 연결 설정

const connect = () => {
  mongoose.connect('mongodb://43.201.26.213:27017/chatapp', {
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
  timestamp: { type: Date, default: Date.now },
});

const chatOpenLogSchema = new mongoose.Schema({
  nickname: String,
  sequence: Number,
  timestamp: { type: Date, default: Date.now },
});

chatOpenLogSchema.pre('save', async function (next) {
  if (!this.sequence) {
    // 새로운 닉네임인 경우에만 sequence 값을 설정
    const lastDocument = await ChatOpenLog.findOne({ nickname: this.nickname })
      .sort({ sequence: -1 })
      .exec();

    if (lastDocument) {
      this.sequence = lastDocument.sequence + 1;
    } else {
      this.sequence = 1;
    }
  }

  next();
});

const chatCloseLogSchema = new mongoose.Schema({
  nickname: String,
  sequence: Number,
  timestamp: { type: Date, default: Date.now },
});

chatCloseLogSchema.pre('save', async function (next) {
  if (!this.sequence) {
    // 새로운 닉네임인 경우에만 sequence 값을 설정
    const lastDocument = await ChatCloseLog.findOne({ nickname: this.nickname })
      .sort({ sequence: -1 })
      .exec();

    if (lastDocument) {
      this.sequence = lastDocument.sequence + 1;
    } else {
      this.sequence = 1;
    }
  }

  next();
});

// ChatMessage 모델 정의
const ChatMessage = mongoose.model('chatmessages', chatSchema);
const ChatOpenLog = mongoose.model('chatOpenLogSchema', chatOpenLogSchema);
const ChatCloseLog = mongoose.model('chatCloseLogSchema', chatCloseLogSchema);

async function getTimes(nickname) {
  try {
    const openLogs = await ChatOpenLog.find({ nickname: `${nickname}` }).exec();

    const closeLogs = await ChatCloseLog.find({ nickname: `${nickname}` }).exec();

    const result = [];

    openLogs.forEach((openLog) => {
      const matchingCloseLog = closeLogs.find((closeLog) => {
        return closeLog.sequence === openLog.sequence;
      });

      if (matchingCloseLog) {
        result.push({
          openTimestamp: openLog.timestamp,
          closeTimestamp: matchingCloseLog.timestamp,
        });
      }
    });

    // ChatMessage 데이터 가져오기
    const beforeMessages = [];
    for (const { openTimestamp, closeTimestamp } of result) {
      const messages = await ChatMessage.find({
        timestamp: {
          $gte: openTimestamp,
          $lte: closeTimestamp,
        },
      }).exec();

      messages.forEach((message) => {
        const { message: messageJSON } = message;
        const parsedMessage = JSON.parse(messageJSON);
        beforeMessages.push({
          message: parsedMessage.message,
          nickname: parsedMessage.nickname,
        });
      });
    }
    // beforeMessages 배열을 반환
    return beforeMessages;
  } catch (err) {
    console.log(err);
    throw err; // 에러를 상위로 전파
  }
}
export { connect, ChatMessage, ChatOpenLog, ChatCloseLog, getTimes };
