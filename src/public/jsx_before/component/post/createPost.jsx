import React, { useState } from 'react';

const YourComponent = () => {
  const [isWritingPostInProgress, setIsWritingPostInProgress] = useState(false);

  const writingPost = async () => {
    if (isWritingPostInProgress) {
      alert('잠시만 기다려주세요.');
      return;
    }

    const form = document.querySelector('#form');
    const authorization = document.querySelector('.Authorization');
    authorization.value = sessionStorage.getItem('Authorization');
    const formData = new FormData(form);

    try {
      const response = await fetch(`./api/posts`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      alert(code[data.responseData.code]);

      if (data.responseData.code === 311) {
        setIsWritingPostInProgress(true);
        // React에서 페이지 이동은 일반적으로 라우터를 사용하므로 라우터에 따라 수정이 필요할 수 있습니다.
        // 예를 들어, React Router를 사용하는 경우: history.push('./');
      } else if (data.responseData.code === 312) {
        // 마찬가지로 라우터에 따라 수정이 필요할 수 있습니다.
        // 예를 들어, React Router를 사용하는 경우: history.push('./login');
      }
    } catch (error) {
      console.error('Error during post creation:', error);
    }
  };

  return (
    <div>
      {/* 여기에 JSX를 추가하여 UI를 구성할 수 있습니다. */}
      <form id="form">
        {/* 폼 엘리먼트들을 추가하고 필요한 경우 이벤트 핸들러를 정의하세요. */}
      </form>
      <button onClick={writingPost}>Submit Post</button>
    </div>
  );
};

export default YourComponent;
