import React from 'react';

const 로그아웃 = async () => {
  try {
    const 응답 = await fetch('./api/logout', {
      method: 'POST',
      headers: {
        Authorization: sessionStorage.getItem('Authorization'),
      },
    });

    const 결과 = await 응답.json();

    alert(code[결과.responseData.code]);
    sessionStorage.removeItem('Authorization');
    window.location.href = './';
  } catch (에러) {
    console.error('로그아웃 중 오류 발생:', 에러);
  }
};

const 코드 = {
  // 여기에 코드에 따른 알림 메시지를 추가하세요.
};

const 로그아웃버튼컴포넌트 = () => {
  return (
    <button className="logout" onClick={로그아웃}>
      로그아웃
    </button>
  );
};

export default 로그아웃버튼컴포넌트;
