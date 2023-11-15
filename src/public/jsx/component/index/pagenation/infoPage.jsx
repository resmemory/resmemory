import React from 'react';
import { Link } from 'react-router-dom';

function PostDetailButton({ postId }) {
  return (
    <Link to={`/detail?post=${postId}`}>
      <button>상세 페이지로 이동</button>
    </Link>
  );
}

export default PostDetailButton;
