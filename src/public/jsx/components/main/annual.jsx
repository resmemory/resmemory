import React, { useState, useCallback } from 'react';
import '../css/annual.css';

const Annual = ({ updateBoardData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const categories = category(2020, 2010, 2000, 1990, 1980, 1970);

  const handleCategoryClick = useCallback(async (category) => {
    try {
      setSelectedCategory(category);
      setCurrentPage(1);

      if (category === '전체') {
        window.location.href = '/'; 
        return;
      }

      let apiUrl = `./api/posts/view?pageNum=${currentPage}`;

      if (category) {
        apiUrl += `&category=${extractYear(category)}`;
      }

      setLoading(true);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.responseData || data.responseData.length === 0) {
        console.warn('반환된 데이터가 없습니다.');
        return;
      }

      updateBoardData(data.responseData);
    } catch (error) {
      console.error('데이터를 불러오는 도중 에러 발생:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, updateBoardData]);

  const extractYear = (category) => {
    return category.replace('년', '');
  };

  return (
    <div>
      <ul className="category">
        {categories.map((category) => (
          <button className="category-button" onClick={() => handleCategoryClick(category)}>
            {category}
            </button>
        ))}
        <div className="sort"></div>
        <select className='sort-select'>
        <option value='board'>최신순</option>
          <option value='view'>조회순</option>
          <option value='like'>좋아요순</option>
        </select>
      </ul>
    </div>
  );
};

const category = (...years) => {
  const categories = ['전체', ...years.map((year) => `${year}'s`)];
  return categories;
};

export default Annual;
