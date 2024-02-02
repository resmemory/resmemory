import React from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/post/post.jsx';
import Header from '../components/main/header.jsx';

function WritePostPage() {
  return (
    <div>
      <h1>글 작성 페이지</h1>
      <header>
        <Header />
      </header>
      <Post />
    </div>
  );
}

export default WritePostPage;
