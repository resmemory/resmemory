import React from 'react';
import MyInfo from '../../jsx/components/mypage/MyInfo.jsx';

import CardSection from '../components/mypage/CardSection.jsx';
import Header from '../components/main/header.jsx';

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
