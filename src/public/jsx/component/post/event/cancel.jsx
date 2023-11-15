import React from 'react';
import {버튼컴포넌트} from '../button/button'

const 이전페이지이동 = () => {
  window.history.back();
};

const 취소버튼컴포넌트 = () => {
  return (
    <button className="cancel" onClick={이전페이지이동}>
      취소
    </button>
  );
};

export default 취소버튼컴포넌트;

// 여기에 버튼들 다 추가 + 이벤트들 다 추가