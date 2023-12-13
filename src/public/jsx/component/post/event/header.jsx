import React, { useEffect, useState } from 'react';
import { headerBtn } from '../button/header'

const YourComponent = () => {
  const [isWritingPostInProgress, setIsWritingPostInProgress] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 후 실행되는 코드
    headerBtn();

    // 컴포넌트가 언마운트될 때 정리(clean-up) 함수
    return () => {
      // 정리(clean-up) 코드 (예: 이벤트 리스너 해제 등)
    };
  }, []); // 빈 배열을 전달하여 componentDidMount와 같은 효과를 얻습니다.

  return (
    <div>
      <h1>Your Component</h1>
      <p>{isWritingPostInProgress ? 'Writing in progress...' : 'Ready to write.'}</p>
      <button onClick={() => setIsWritingPostInProgress(!isWritingPostInProgress)}>
        Toggle Writing
      </button>
      {/* 추가적인 JSX 엘리먼트를 여기에 추가할 수 있습니다. */}
    </div>
  );
};

export default Header;
