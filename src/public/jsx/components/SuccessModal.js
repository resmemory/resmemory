import React from 'react';

const SuccessModal = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>인증이 완료되었습니다.</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default SuccessModal;
