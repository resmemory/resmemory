import React, { useState } from 'react';

const style = {
  FilterButton: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '20px',
  },
  botton: {
    width: '100px',
    height: '30px',
    marginRight: '20px',
    color: 'white',
    borderRadius: '5px',
    border: '0px',
  },
};

function FilterReport(props) {
  const [AllColor, setAllButtonColor] = useState('gray');
  const [incompleteColor, setIncompleteButtonColor] = useState('black');
  const [completeColor, setCompleteButtonColor] = useState('black');

  const handleFilterAll = () => {
    props.onFilterChange('all');
    setAllButtonColor('gray');
    setIncompleteButtonColor('black');
    setCompleteButtonColor('black');
  };

  const handleFilterIncomplete = () => {
    props.onFilterChange('incomplete');
    setIncompleteButtonColor('gray');
    setAllButtonColor('black');
    setCompleteButtonColor('black');
  };
  const handleFiltercomplete = () => {
    props.onFilterChange('complete');
    setCompleteButtonColor('gray');
    setAllButtonColor('black');
    setIncompleteButtonColor('black');
  };

  return (
    <div style={style.FilterButton}>
      <button style={{ ...style.botton, backgroundColor: AllColor }} onClick={handleFilterAll}>
        전체
      </button>
      <button
        style={{ ...style.botton, backgroundColor: incompleteColor }}
        onClick={handleFilterIncomplete}
      >
        미완료
      </button>
      <button
        style={{ ...style.botton, backgroundColor: completeColor }}
        onClick={handleFiltercomplete}
      >
        삭제 완료
      </button>
    </div>
  );
}

export default FilterReport;
