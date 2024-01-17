import React from 'react';
import { Link } from 'react-router-dom';

function WritingPostButton() {
  return (
    <Link to="/post">
      <button>글 작성 페이지로 이동</button>
    </Link>
  );
}

export default WritingPostButton;
