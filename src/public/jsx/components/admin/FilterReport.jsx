import React from 'react';

const style = {
  FilterButton: {
    marginBottom: '10px',
  },
};

function FilterReport(props) {
  const handleFilterAll = () => {
    // 전체 필터를 적용하는 로직
    props.onFilterChange('all');
  };

  const handleFilterIncomplete = () => {
    // 미완료 필터를 적용하는 로직
    props.onFilterChange('incomplete');
  };
  const handleFiltercomplete = () => {
    // 미완료 필터를 적용하는 로직
    props.onFilterChange('complete');
  };
  return (
    <div style={style.FilterButton}>
      <button onClick={handleFilterAll}>전체</button>
      <button onClick={handleFilterIncomplete}>미완료</button>
      <button onClick={handleFiltercomplete}>삭제 완료</button>
    </div>
  );
}

export default FilterReport;
