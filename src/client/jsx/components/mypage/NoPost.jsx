import React from 'react';

const NoPost = () => {
  return (
    <div>
      <p className="no-posts-message">
        아직 게시물이 없어요!
        <br />
        같이 추천 공유하러 가볼까요?
      </p>
      <button className="write-button">추억 글쓰기</button>
    </div>
  );
};

export default NoPost;
