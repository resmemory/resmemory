import React from 'react';

// 연도별 카테고리
const Annual = () => {
  const categories = category(2020, 2010, 2000, 1990, 1980, 1970);

  const handleCategoryClick = (category) => {
    window.location.href = `./annual.html?category=${category}`;
  };

  const handleSort = (e) => {
    if (e===view){

    }
    else if (e===like){

    }
    else if (e===board){

    }
    else {
      throw new Error
    }
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
        <div className="sort"></div>
        <select className='sort-select' onChange={handleSort}>
          <option value='view'>조회순</option>
          <option value='like'>좋아요순</option>
          <option value='board'>최신순</option>
        </select>
      </ul>
    </div>
  );
};

// 연도 범위 내의 카테고리 생성
const category = (...years) => {
  const categories = years.map((year) => `${year}'s`);
  return categories;
};

export default Annual;
