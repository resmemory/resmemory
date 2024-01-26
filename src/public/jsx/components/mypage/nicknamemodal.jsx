import React, { useState } from 'react';

const NicknameModal = ({ onClose, onSave, currentNickname }) => {
  const [newNickname, setNewNickname] = useState('');

  const handleSave = () => {
    onSave(newNickname);
    onClose();
  };

  const maxLength = 20;

  const handleChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= maxLength) {
      setNewNickname(inputValue);
    }
  };

  const remainingCharacters = 0 + newNickname.length;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>닉네임 변경</h2>
        <input
          type="text"
          value={newNickname}
          placeholder={`${currentNickname}`}
          onChange={handleChange}
        />
        <div className="characterCount">
          {remainingCharacters >= 0 ? remainingCharacters : 0}/{maxLength}
        </div>
        <div className="editBtn">
          <p onClick={handleSave}>변경</p>
          <p className="close" onClick={onClose}>
            취소
          </p>
        </div>
      </div>
    </div>
  );
};

export default NicknameModal;
