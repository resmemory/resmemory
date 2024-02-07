import React from 'react';
import MyInfo from '../../jsx/components/mypage/myinfo.jsx';

import CardSection from '../components/mypage/cardsection.jsx';
import Header from '../components/main/Header.jsx';

function MyPage() {
  return (
    <div className="#">
      <header className="#">
        <Header />
      </header>
      <main className="MainSection">
        <div className="flex-container">
          <section className="MyInformation">
            <MyInfo />
          </section>
          <section className="MyCard">
            <CardSection />
          </section>
        </div>
      </main>
    </div>
  );
}

export default MyPage;
