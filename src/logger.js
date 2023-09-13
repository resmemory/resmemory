import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import mailSender from './mail';
import dotenv from 'dotenv';

dotenv.config();

const logDir = 'logs';
const { combine, timestamp, printf } = winston.format;

let log;

const logFormat = printf((info) => {
  log = `${info.timestamp} ${info.level}: ${info.message}`;

  const emailParam = {
    toEmail: 'error-aaaakv5c7reyo6f4bjksjherta@w1694593718-xrd689339.slack.com',
    subject: '[응답하라 추억시대] 오류가 발생하였습니다.',
    text: log,
  };

  mailSender.sendGmail(emailParam);
  return log;
});

const logger = winston.createLogger({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    // 'error' level logs
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error',
      filename: `%DATE%.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

export default logger;
