import React from 'react';
import MyInfo from '../../jsx/components/mypage/Myinfo.jsx';

import CardSection from '../components/mypage/CardSection.jsx';
import Header from '../components/main/Header.jsx';

import './MyPage.css';

function MyPage() {
  return (
    <>
      <Header />
      <div className="my-page">
        <div>
          <MyInfo />
          <CardSection />
        </div>
      </div>
    </>
  );
}

export default MyPage;
