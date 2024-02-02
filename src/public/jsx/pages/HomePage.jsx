// HomePage 컴포넌트
import React, { useState } from 'react';
import Board from '../components/main/board.jsx';
import Header from '../components/main/header.jsx';
import Annual from '../components/main/annual.jsx';

const HomePage = () => {
  const [boardData, setBoardData] = useState({ data: [], category: null });

  const updateBoardData = ({ data, category }) => {
    setBoardData((prevData) => ({ ...prevData, data: [...data], category }));
  };

  return (
    <div className="#">
      <Header />
      <Annual updateBoardData={updateBoardData} />
      <Board initialData={boardData.data} category={boardData.category} />
    </div>
  );
};

export default HomePage;
