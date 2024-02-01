import React, { useEffect, useState, useRef } from 'react';
import Masonry from 'react-masonry-css';
import '../css/board.css';

const Board = () => {
  const [board, setBoard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [observeSentinel, setObserveSentinel] = useState(true);
  const [sort, setSort] = useState('view');
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);
  const itemsPerPage = 12;
  const itemsPerRow = 5;
  const [category, setCategory] = useState('전체');
  const categories = ['전체', '2020', '2010', '2000', '1990', '1980', '1970'];

  const fetchData = async (page, perPage, category) => {
    try {
      setLoading(true);

      category === '전체' ? (category = '') : (category = category);

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
      console.log('Fetched data:', responseData);
      return responseData.responseData;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    const postUrl = `./detail.html?post=${postId}`;
    console.log(`ID가 ${postId}인 게시물이 클릭되었습니다. URL: ${postUrl}`);
    window.location.href = postUrl;
  };

  const loadMoreData = async () => {
    if (!loadingMore && hasMoreData) {
      setLoadingMore(true);

      try {
        const data = await fetchData(currentPage, itemsPerPage, category);

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
    const masonry = document.querySelector('.my-masonry-grid');
    const observer = new IntersectionObserver(handleIntersection, {
      root: masonry,
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
    setCurrentPage(1);
    setBoard([]);
    setHasMoreData(true);
    setObserveSentinel(true);
    loadMoreData();
  }, [category]);

  const handleCategoryClick = (target) => {
    setCategory(target);
    setObserveSentinel(true);
  };

  return (
    <div>
      <ul className="category">
        {categories.map((target) => (
          <button
            key={target}
            className="category-button"
            onClick={() => handleCategoryClick(target)}
          >
            {target}
          </button>
        ))}
        <div className="sort"></div>
        <select
          className="sort-select"
          onChange={(e) => {
            setSort(e.target.value);
          }}
        >
          <option value="new">최신순</option>
          <option value="view">조회순</option>
        </select>
      </ul>

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
            <p>{post.category}</p>
            {post.img && <img src={post.img} alt="Post Image" />}
            <h5 className="post-title">{post.title}</h5>
            <p className="post-content">{post.content}</p>
            <div>
              <span>
                ${new Date(post.createdAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}
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
