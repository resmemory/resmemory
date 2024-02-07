// HomePage 컴포넌트
import React, { useState } from 'react';
import Board from '../components/main/board.jsx';
import Header from '../components/main/Header.jsx';
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
