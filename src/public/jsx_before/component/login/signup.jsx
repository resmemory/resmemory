import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EmailVerificationModal from '../../components/EmailVerificationModal';
import SuccessModal from '../../components/SuccessModal';

const RegisterInput = () => {
  // 상태 변수들
  const [email, setEmail] = useState('');
  const [emailVerification, setEmailVerification] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 이메일 발송 확인 후 처리
  const handleVerificationClose = () => {
    console.log('해당 이메일로 인증번호를 발송했습니다.');
    setShowSuccessModal(true); // 인증 모달 열기
    setShowVerificationModal(false); // 이메일 발송 모달 닫기
  };

  // 인증 모달 닫기 처리
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
  };

  // 가입 취소 처리
  const cancel = () => {
    // TODO: 취소 로직 구현
  };

  // 회원가입 처리
  const signUp = () => {
    // TODO: 회원가입 로직 구현
  };

  return (
    <div>
      <img src="/assets/image/logo.png" alt="Logo" style={{ maxWidth: '100%', height: 'auto' }} />

      <form>
        <label>이메일을 입력해주세요.</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />

        <label>인증번호를 10분 이내로 입력해주세요.</label>
        <input
          type="emailVerification"
          value={emailVerification}
          onChange={(e) => setEmailVerification(e.target.value)}
        />
        <br />

        <label>닉네임을 입력해주세요.</label>
        <input type="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        <br />

        <label>비밀번호를 입력해주세요</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />

        <label>비밀번호 확인</label>
        <input
          type="verifyPassword"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
        />
        <br />

        <Link to="/passwordFind">비밀번호를 잊으셨나요?</Link>
        <button type="button" onClick={cancel}>
          취소
        </button>
        <button type="button" onClick={signUp}>
          가입
          <p>
            ? <Link to="/passwordFind">비밀번호를 잊으셨나요?</Link>
          </p>
        </button>
      </form>

      {/* 이메일 발송 모달 */}
      {showVerificationModal && <EmailVerificationModal onClose={handleVerificationClose} />}

      {/* 인증 모달 */}
      {showSuccessModal && <SuccessModal onClose={handleSuccessClose} />}
    </div>
  );
};

export default RegisterInput;
