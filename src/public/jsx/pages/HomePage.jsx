import React from 'react';
import Board from '../components/main/board.jsx';
import Header from '../components/main/header.jsx';

function HomePage() {
  return (
    <div>
      <h1>메인페이지</h1>
      <header>
        <Header />
      </header>
      <Board />
    </div>
  );
}

export default HomePage;
