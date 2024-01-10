import React from 'react';
import '../../components/mypage/cardsection.css';

const CardSection = () => {
  return (
    <div className="CardSection">
      <div className="button-container flex space-x-2">
        <button className="action-button1">내가 쓴 글</button>
        <button className="action-button2">좋아요한 글</button>
        <button className="action-button3">내가 쓴 댓글</button>
        <button className="action-button4">내가 남긴 쓰레드</button>
      </div>

      <div className="content-container flex flex-col items-center">
        <p className="no-posts-message">
          아직 게시물이 없어요!
          <br />
          같이 추천 공유하러 가볼까요?
        </p>
        <button className="write-button">추억 글쓰기</button>
      </div>
    </div>
  );
};

export default CardSection;
