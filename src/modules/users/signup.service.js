import Users from './db/users.db';
import bcrypt from 'bcrypt';
import redisCli from '../../redis';
import mailSender from '../../mail';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

async function signup(pathname, params, responseData, token) {
  if (pathname == '/mail') {
    try {
      const verifyNumber = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;

      const { email } = params.bodies;
      const isExistEmail = await Users.findOne({ where: { email } });
      if (isExistEmail) {
        responseData = { code: 172 };
      } else {
        const emailParam = {
          toEmail: email, // 수신할 이메일

          subject: '[응답하라 추억시대] 인증번호를 확인하세요!', // 메일 제목

          text: `
                    응답하라 추억시대에 찾아 주셔서 감사합니다!
                    회원 가입을 위해 이 숫자를 입력해 주세요. 
                    [ ${verifyNumber} ]`, // 메일 내용
        };

        mailSender.sendGmail(emailParam);
        const time = Date.now();
        await redisCli.set(`verifytime_${email}`, `${time}`);
        await redisCli.set(`verifyNumber_${email}`, `${verifyNumber}`);
        responseData = { code: 171 };
      }
    } catch (err) {
      responseData = { code: 170 };
    }
  }

  if (pathname == '/verified') {
    try {
      const now = Date.now();
      const { receiveNumber, email } = params.bodies;
      const time = await redisCli.get(`verifytime_${email}`);

      if (receiveNumber.toString() !== (await redisCli.get(`verifyNumber_${email}`))) {
        responseData = { code: 181 };
      } else if (now - (time + 600000) > 0) {
        responseData = { code: 182 };
        await redisCli.del(`verifytime_${email}`);
      } else {
        await redisCli.set(`isverified_${email}`, `true`);
        responseData = { code: 183 };
      }
    } catch (err) {
      responseData = { code: 180 };
    }
  }

  if (pathname == '/signup') {
    try {
      const emailcheck =
        /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      const passwordcheck = /^[A-Za-z0-9]{6,12}$/;
      const { email, nickname, password, confirm } = params.bodies;
      const isExistNickname = await Users.findOne({ where: { nickname } });
      if (!email || !nickname || !password) {
        responseData = { code: 115 };
      } else if (isExistNickname) {
        responseData = { code: 117 };
      } else if (!emailcheck.test(email)) {
        responseData = { code: 113 };
      } else if (!passwordcheck.test(password)) {
        responseData = { code: 114 };
      } else if (password !== confirm) {
        responseData = { code: 116 };
      } else {
        if ((await redisCli.get(`isverified_${email}`)) == 'true') {
          const hashedPassword = await bcrypt.hash(password, 10);
          const result = await Users.create({
            email,
            nickname,
            password: hashedPassword,
          });
          if (result) {
            const refresh = jwt.sign({ ok: 'ok' }, process.env.JWT_SECRET_KEY_REFRESH, {
              expiresIn: process.env.JWT_EXPIRE_TIME_REFRESH,
            });
            await redisCli.set(`refresh_${result.userId}`, `${refresh}`);

            responseData = { code: 111, refresh };
          } else {
            responseData = { code: 112, message: 'create불가' };
          }
        } else {
          responseData = { code: 112, message: 'redis진입불가' };
        }
      }
    } catch (err) {
      responseData = { code: 110 };
    }
  }

  return responseData;
}

export default signup;
