import React, { useEffect, useState } from 'react';

const 버튼컴포넌트 = () => {
  const [인증여부, set인증여부] = useState(false);

  useEffect(() => {
    // 사용자가 인증되었는지 확인합니다 (실제 인증 확인 로직으로 교체해야 합니다)
    const 사용자인증여부 = sessionStorage.getItem('Authorization') !== null;

    set인증여부(사용자인증여부);
  }, []);

  return (
    <div>
      {인증여부 ? (
        <>
          <button className="logout">로그아웃</button>
          <button className="mypage">마이페이지</button>
        </>
      ) : (
        <button className="login">로그인</button>
      )}
    </div>
  );
};

export default 버튼컴포넌트;
