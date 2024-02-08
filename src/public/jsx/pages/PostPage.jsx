import React from 'react';
import PostDetail from '../components/post/PostDetail.jsx';
import Header from '../components/main/Header.jsx';
import './PostPage.css';
function PostPage() {
  return (
    <>
      <Header />
      <div className="post-page">
        <div>
          <PostDetail />
        </div>
      </div>
    </>
  );
}
export default PostPage;
