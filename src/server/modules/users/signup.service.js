import Users from './db/users.db';
import bcrypt from 'bcrypt';
import redisCli from '../../redis';
import mailSender from '../../mail';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

async function signup(pathname, params, responseData, token) {
  // 인증 메일 발송
  if (pathname == '/mail') {
    try {
      const verifyNumber = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;

      const { email } = params.bodies;
      const emailcheck = /^[0-9a-zA-Z-_\.]*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      if (!emailcheck.test(email)) {
        responseData = { code: 113 };
      } else {
        const isExistEmail = await Users.findOne({ where: { email } });
        if (isExistEmail) {
          responseData = { code: 182 };
        } else {
          const emailParam = {
            toEmail: email, // 수신할 이메일

            subject: '[그땐 G:Then] 인증번호를 확인하세요!', // 메일 제목

            text: `
                    그땐 G:Then 에 찾아 주셔서 감사합니다!
                    회원 가입을 위해 이 숫자를 입력해 주세요. 
                    [ ${verifyNumber} ]`, // 메일 내용
          };

          mailSender.sendGmail(emailParam);
          const time = Date.now();
          await redisCli.set(`verifytime_${email}`, `${time}`);
          await redisCli.set(`verifyNumber_${email}`, `${verifyNumber}`);
          responseData = { code: 181 };
        }
      }
    } catch (err) {
      responseData = { code: 180 };
    }
  }

  // 인증 번호 확인
  if (pathname == '/verified') {
    try {
      const now = Date.now();
      const { receiveNumber, email } = params.bodies;
      const time = await redisCli.get(`verifytime_${email}`);

      if (receiveNumber.toString() !== (await redisCli.get(`verifyNumber_${email}`))) {
        responseData = { code: 191 };
      } else if (now - (time + 600000) > 0) {
        responseData = { code: 192 };
        await redisCli.del(`verifytime_${email}`);
      } else {
        await redisCli.del(`verifytime_${email}`);
        await redisCli.set(`isverified_${email}`, `true`);
        responseData = { code: 193 };
      }
    } catch (err) {
      responseData = { code: 190 };
    }
  }

  // 회원가입
  if (pathname == '/signup') {
    try {
      const passwordcheck = /^[A-Za-z0-9@$!%*#?&\.]{6,30}$/;
      const { email, nickname, password, confirm } = params.bodies;
      const isExistNickname = await Users.findOne({ where: { nickname } });
      if (!email || !nickname || !password) {
        responseData = { code: 115 };
      } else if (isExistNickname) {
        responseData = { code: 117 };
      } else if (!passwordcheck.test(password)) {
        responseData = { code: 114 };
      } else if (password !== confirm) {
        responseData = { code: 116 };
      } else {
        if ((await redisCli.get(`isverified_${email}`)) == 'true') {
          await redisCli.del(`isverified_${email}`);
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
            responseData = { code: 112 };
          }
        } else {
          responseData = { code: 112 };
        }
      }
    } catch (err) {
      responseData = { code: 110 };
    }
  }

  if (pathname == '/oauth') {
    try {
      const { kakaoId } = params.bodies;
      const lastUserId = await Users.count();
      await Users.findOrCreate({
        where: { kakaoId },
        defaults: { email: 'kakaoId', password: 'kakaoId', nickname: `${lastUserId + 1}번째 낭만` },
      });
      responseData = {};
    } catch (err) {
      responseData = {};
    }
  }

  return responseData;
}

export default signup;
