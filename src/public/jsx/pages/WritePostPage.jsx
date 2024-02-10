import React from 'react';
import Post from '../components/writepost/post.jsx';
import Header from '../components/main/header.jsx';

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
