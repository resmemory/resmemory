// HomePage 컴포넌트
import React from 'react';
import Board from '../components/main/board.jsx';
import Header from '../components/main/header.jsx';
import Notice from '../components/main/notice.jsx';

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <Notice />
      <Board />
    </div>
  );
};

export default HomePage;
