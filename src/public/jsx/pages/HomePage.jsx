// HomePage 컴포넌트
import React, { useState } from 'react';
import Board from '../components/main/board.jsx';
import Header from '../components/main/header.jsx';
import Annual from '../components/main/annual.jsx';

const HomePage = () => {
  const [boardData, setBoardData] = useState([]);

  const updateBoardData = (data) => {
    setBoardData(data);
  };

  return (
    <div className="#">
      <Header />
      <Annual updateBoardData={updateBoardData} />
      <Board initialData={boardData} />
    </div>
  );
}

export default HomePage;
