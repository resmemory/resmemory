import React from 'react';

// 연도별 카테고리
const Annual = () => {
  const categories = annualCategory(2020, 2010, 2000, 1990, 1980, 1970, 1960);

  const handleCategoryClick = (category) => {
    window.location.href = `./annual.html?category=${category}`;
  };

  return (
    <div>
      <h1>Annual Categories</h1>
      <ul>
        {categories.map((category) => (
          <li key={category} onClick={() => handleCategoryClick(category)}>
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
};

// 연도 범위 내의 카테고리 생성
const annualCategory = (...years) => {
  const categories = years.map((year) => `${year}'s`);
  return categories;
};

export default Annual;
