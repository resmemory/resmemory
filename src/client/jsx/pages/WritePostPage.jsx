import React from 'react';
import Post from '../components/writepost/Post.jsx';
import Header from '../components/main/Header.jsx';

import './WritePostPage.css';

function WritePostPage() {
  return (
    <div>
      <Header />
      <div className="write-post-page">
        <Post />
      </div>
    </div>
  );
}

export default WritePostPage;
