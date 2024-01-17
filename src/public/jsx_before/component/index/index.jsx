import React from 'react';
import ReactDOM from 'react-dom';
//import 부모컴포넌트 from './부모컴포넌트'; // 실제 파일 경로에 따라 수정
import PostList  from './board/boardEa'
import PostsListByRecent from './board/boardRecent';
import PostsListByViewCount from './board/boardMostPOP';

const App = () => {
  return (
    <div>
      <h1>전체 애플리케이션</h1>
      <부모컴포넌트 />
      {PostList}
    {PostsListByRecent}
    {PostsListByViewCount}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
