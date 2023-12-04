import winston from 'winston';
import mailSender from './mail';
import dotenv from 'dotenv';
import winstonElasticsearch from 'winston-elasticsearch';

dotenv.config();

const { combine, timestamp, printf } = winston.format;

let log;

const logFormat = printf((info) => {
  log = `${info.timestamp} ${info.level}: ${info.message}`;

  const slackParam = {
    toEmail: 'error-aaaakv5c7reyo6f4bjksjherta@w1694593718-xrd689339.slack.com',
    subject: '[응답하라 추억시대] 서버가 종료되었습니다.',
    text: log,
  };
  const emailParam = {
    toEmail: process.env.NODEMAILER_EMAIL,
    subject: '[응답하라 추억시대] 서버가 종료되었습니다.',
    text: log,
  };

  mailSender.sendGmail(slackParam);
  mailSender.sendGmail(emailParam);
  return log;
});

const esTransportOpts = {
  level: 'error',
  index: 'error',
  indexPrefix: 'logging-api',
  indexSuffixPattern: 'YYYY-MM-DD',
  clientOpts: {
    node: process.env.ES_ADDON_URI,
    maxRetries: 5,
    requestTimeout: 10000,
    sniffOnStart: false,
    auth: {
      username: process.env.ES_ADDON_USER,
      password: process.env.ES_ADDON_PASSWORD,
    },
  },
  source: process.env.LOG_SOURCE || 'api',
};

const esTransport = new winstonElasticsearch.ElasticsearchTransport(esTransportOpts);

const logger = winston.createLogger({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    new winston.transports.Console({
      level: 'error',
      json: true,
    }),
    esTransport,
  ],
});

export default logger;
