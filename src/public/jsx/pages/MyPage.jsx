import React from 'react';
import MyInfo from '../../jsx/components/mypage/myinfo.jsx';

function MyPage() {
  return (
    <div className="#">
      <header className="#">{/* 헤더 부분 */}</header>
      <main className="#">
        <section className="#">{/* 내 소식 부분 */}</section>
        <section className="#">
          <MyInfo />
        </section>
        <section className="#">{/* 내가 쓴 글*/}</section>
        <section>{/* 좋아요 한 글 */}</section>
      </main>
    </div>
  );
}

export default MyPage;
