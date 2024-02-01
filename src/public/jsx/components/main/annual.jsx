import React, { useState, useCallback, useEffect } from 'react';
import '../css/annual.css';

const Annual = ({ updateBoardData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const categories = category(2020, 2010, 2000, 1990, 1980, 1970);

  const handleCategoryClick = useCallback(
    async (category) => {
      try {
        if (loading) return;

        setSelectedCategory(category);
        setCurrentPage(1);

        if (category === '전체') {
          window.location.href = '/';
          return;
        }

        const year = extractYear(category);
        let apiUrl = `./api/posts?category=${year}&pageNum=1`; // currentPage 대신에 1로 고정

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
        updateBoardData({ data: data.responseData, category: year });
      } catch (error) {
        console.error('데이터를 불러오는 도중 에러 발생:', error);
      } finally {
        setLoading(false);
      }
    },
    [updateBoardData],
  );

  const extractYear = (category) => {
    return category.replace(/[^0-9]/g, ''); // 숫자만 남기고 나머지 문자 제거
  };

  const handleSort = (data) => {
    // 정렬 기능 추가
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
        <select className="sort-select" onChange={handleSort}>
          <option value="board">최신순</option>
          <option value="view">조회순</option>
          <option value="like">좋아요순</option>
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
