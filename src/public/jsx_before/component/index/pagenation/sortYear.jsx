import React from 'react';
import { Link } from 'react-router-dom';

function categoryButton({ category }) {
  return (
    <Link to={`/annual?category=${category}`}>
      <button>연도별 조회 ({category})</button>
    </Link>
  );
}

export default categoryButton;
