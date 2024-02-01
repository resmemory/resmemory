// HomePage 컴포넌트
import React, { useState } from 'react';
import Board from '../components/main/board.jsx';
import Header from '../components/main/header.jsx';

const HomePage = () => {
  return (
    <div className="#">
      <Header />
      <Board />
    </div>
  );
};

export default HomePage;
