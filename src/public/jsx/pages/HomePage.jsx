// HomePage 컴포넌트
import React, { useState } from 'react';
import Board2 from '../components/main/board2.jsx';
import Header from '../components/main/header.jsx';
import Annual from '../components/main/annual.jsx';

const HomePage = () => {
  const [boardData, setBoardData] = useState({ data: [], category: null });

  const updateBoardData = ({ data, category }) => {
    // console.log('상위컴포넌트', data);
    // console.log('상위컴포넌트', category);
    setBoardData((prevData) => ({ ...prevData, data: [...data], category })); 
  };

  return (
    <div className="#">
      <Header />
      <Annual updateBoardData={updateBoardData} />
      <Board2 initialData={boardData.data} category={boardData.category} />
    </div>
  );
}


export default HomePage;
