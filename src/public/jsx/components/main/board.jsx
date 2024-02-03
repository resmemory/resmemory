import React, { useEffect, useState, useRef } from 'react';
import Masonry from 'react-masonry-css';
import './board.css';
import './annual.css';

const Board = () => {
  const [board, setBoard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [observeSentinel, setObserveSentinel] = useState(true);
  const [sort, setSort] = useState('new');
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);
  const itemsPerPage = 12;
  const itemsPerRow = 5;
  const [category, setCategory] = useState('전체');
  const [selectedCategory, setSelectedCategory] = useState('전체'); // 선택된 카테고리 상태 추가
  const categories = ['전체', "2020's", "2010's", "2000's", "1990's", "1980's", "1970's"];

  const fetchData = async (page, category) => {
    try {
      setLoading(true);

      category === '전체' ? (category = '') : (category = category.slice(0, 4));

      const response = await fetch(
        `./api/posts?category=${category}&pageNum=${page}&sort=${sort}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const responseData = await response.json();
      return responseData.responseData;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    const postUrl = `./post?post=${postId}`;
    window.location.href = postUrl;
  };

  const loadMoreData = async () => {
    if (!loadingMore && hasMoreData) {
      setLoadingMore(true);

      try {
        const data = await fetchData(currentPage, category);

        if (data.length > 0) {
          setBoard((prevBoard) => [...prevBoard, ...data]);
          setCurrentPage((prevPage) => prevPage + 1);
          setHasMoreData(data.length >= itemsPerPage);
        } else {
          setHasMoreData(false);
          setObserveSentinel(false);
        }
      } catch (error) {
        console.error('Error loading more data:', error);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !loading && observeSentinel) {
        loadMoreData();
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    });

    if (hasMoreData && observeSentinel) {
      observer.observe(sentinelRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [hasMoreData, sentinelRef, handleIntersection, observeSentinel]);

  useEffect(() => {
    setHasMoreData(true);
    setObserveSentinel(true);
    setCurrentPage(1);
    setBoard([]);
  }, [category, sort]);

  const handleCategoryClick = (target) => {
    setCategory(target);
    setSelectedCategory(target); // 선택된 카테고리 업데이트
    setObserveSentinel(true);
  };

  return (
    <div className="boardmain">
      <div className="categorybox">
        <div className="category">
          {categories.map((target) => (
            <button
              key={target}
              className={`category-button ${selectedCategory === target ? 'selected' : ''}`}
              onClick={() => handleCategoryClick(target)}
            >
              {target}
            </button>
          ))}
        </div>
        <div className="sort">
          <select
            className="sort-select"
            onChange={(e) => {
              setSort(e.target.value);
            }}
          >
            <option value="new">최신순</option>
            <option value="view">조회순</option>
          </select>
        </div>
      </div>

      <Masonry
        breakpointCols={{
          default: itemsPerRow,
          1100: 3,
          700: 2,
          500: 1,
        }}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
        ref={containerRef}
      >
        {board.map((post) => (
          <div key={post.id} className="post" onClick={() => handlePostClick(post.postId)}>
            {post.img && <img src={post.img} alt="Post Image" />}
            <div className="postbox">
              <p id="post-category">{post.category}'s</p>
              <p className="post-title">{post.title}</p>
              <p className="post-nickname">{post.nickname}</p>
              <br />
              <span>
                {new Date(post.createdAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}
              </span>
            </div>
          </div>
        ))}
        {hasMoreData && <div ref={sentinelRef}></div>}
        {loading && <p>Loading...</p>}
      </Masonry>
    </div>
  );
};

export default Board;
