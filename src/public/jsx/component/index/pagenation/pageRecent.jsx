import React from 'react';

const PaginationButtons = ({ currentPage, totalPosts, onPageChange }) => {
  const totalPages = Math.ceil(totalPosts / 10);
  const buttons = [];

  for (let i = 1; i <= totalPages; i++) {
    buttons.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={i === currentPage ? 'active' : ''}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="pagination_createdat">
      {buttons}
    </div>
  );
};

export default PaginationButtons;
