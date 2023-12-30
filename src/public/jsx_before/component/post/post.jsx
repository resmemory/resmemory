import React from 'react';
import ReactDOM from 'react-dom';
import 부모컴포넌트 from './부모컴포넌트'; // 실제 파일 경로에 따라 수정

const App = () => {
  return (
    <div>
      <h1>전체 애플리케이션</h1>
      <부모컴포넌트 />
      {/* 다른 컴포넌트들을 추가할 수 있습니다. */}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
