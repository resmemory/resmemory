import React from 'react';
import MyInfo from '../../jsx/components/mypage/myinfo.jsx';
// import Card from '../components/mypage/card.jsx';
import '../pages/MyPage.css';
import CardSection from '../components/mypage/cardsection.jsx';

function MyPage() {
  return (
    <div className="#">
      <header className="#">{/* 헤더 부분 */}</header>
      <main className="MainSection">
        <div className="flex-container">
          <section className="MyInformation">
            <MyInfo />
          </section>
          <section className="MyCard">
            <CardSection />
          </section>
        </div>
        <section>{/* 좋아요 한 글 */}</section>
      </main>
    </div>
  );
}

export default MyPage;
