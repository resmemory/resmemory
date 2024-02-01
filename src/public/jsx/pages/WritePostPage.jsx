import React from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/post/post.jsx';
import Header from '../components/main/header.jsx';

function WritePostPage() {
  const { postId } = useParams();
  console.log('postId:', postId);
  return (
    <div>
      <header>
        <Header />
      </header>
      <Post postId={postId} />
    </div>
  );
}

export default WritePostPage;
