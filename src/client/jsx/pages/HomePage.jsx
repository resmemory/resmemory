// HomePage 컴포넌트
import React from 'react';
import Board from '../components/main/Board.jsx';
import Header from '../components/main/header.jsx';
import Notice from '../components/main/Notice.jsx';

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
