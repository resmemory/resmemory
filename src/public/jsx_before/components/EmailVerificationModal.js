import React from 'react';

const EmailVerificationModal = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>해당 이메일로 인증번호를 발송했습니다.</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
