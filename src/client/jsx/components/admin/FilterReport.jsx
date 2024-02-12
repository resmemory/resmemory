import React, { useState } from 'react';

import './FilterReport.css';

function FilterReport(props) {
  const [allColor, setAllButtonColor] = useState('#d2d2d2');
  const [incompleteColor, setIncompleteButtonColor] = useState('#ffffff');
  const [completeColor, setCompleteButtonColor] = useState('#ffffff');

  const handleFilterAll = () => {
    props.onFilterChange('all');
    setAllButtonColor('#d2d2d2');
    setIncompleteButtonColor('#ffffff');
    setCompleteButtonColor('#ffffff');
  };

  const handleFilterIncomplete = () => {
    props.onFilterChange('incomplete');
    setIncompleteButtonColor('#d2d2d2');
    setAllButtonColor('#ffffff');
    setCompleteButtonColor('#ffffff');
  };
  const handleFiltercomplete = () => {
    props.onFilterChange('complete');
    setCompleteButtonColor('#d2d2d2');
    setAllButtonColor('#ffffff');
    setIncompleteButtonColor('#ffffff');
  };

  return (
    <div className="filter-buttons">
      <button style={{ background: allColor }} onClick={handleFilterAll}>
        전체
      </button>
      <button style={{ background: incompleteColor }} onClick={handleFilterIncomplete}>
        미완료
      </button>
      <button style={{ background: completeColor }} onClick={handleFiltercomplete}>
        삭제 완료
      </button>
    </div>
  );
}

export default FilterReport;
