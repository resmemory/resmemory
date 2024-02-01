import React, { useEffect, useState, useRef } from 'react';
import Masonry from 'react-masonry-css';
import '../css/board.css';

const Board = ({ initialData, category }) => {
  const [board, setBoard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [observeSentinel, setObserveSentinel] = useState(true);
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);
  const itemsPerPage = 12;
  const itemsPerRow = 5;

  // 카테고리 변경 시 page가 3부터 시작
  // 카테고리 변경 시 무한 스크롤 적용 안됌

  useEffect(() => {
    setBoard(Array.isArray(initialData) ? initialData : []);
    setCurrentPage(1);
    setObserveSentinel(true);
    // console.log("Category changed. currentPage:", currentPage);
  }, [initialData, category]);

  const fetchData = async (page, perPage, category) => {
    try {
      setLoading(true);
      const endpoint = category
        ? `./api/posts?category=${category}&pageNum=${page}`
        : `./api/posts/?pageNum=${page}&perPage=${perPage}`;
      console.log('endpoint', endpoint);
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

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
        // 센티널 엘리먼트의 높이를 변경
        sentinelRef.current.style.height = '1000px';

        const data = await fetchData(currentPage, itemsPerPage, category);

        console.log('Fetched data:', data);

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

        // 로딩이 끝나면 센티널 엘리먼트의 높이를 원래대로 복원
        sentinelRef.current.style.height = '0';
      }
    }
  };

  const handleIntersection = (entries, observer) => {
    const { current: sentinel } = sentinelRef;
    // console.log("Intersection entries:", entries);

    entries.forEach((entry) => {
      // console.log("Intersection observed:", entry.isIntersecting);

      if (entry.isIntersecting && !loading && observeSentinel) {
        setLoading(true);
        console.log('Load more data...');
        loadMoreData();

        // observeSentinel이 여전히 true일 때만 다시 observe를 시작
        if (observeSentinel) {
          observer.observe(sentinel);
        }
      }
    });
  };

  useEffect(() => {
    if (hasMoreData && observeSentinel) {
      const { current: sentinel } = sentinelRef;
      const observer = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      });

      observer.observe(sentinel);

      return () => {
        observer.disconnect();
      };
    }
    setObserveSentinel(true);
  }, [hasMoreData, sentinelRef, handleIntersection, observeSentinel, category, initialData]);

  useEffect(() => {
    console.log('useEffect triggered with category:', category);
    if (hasMoreData && observeSentinel) {
      console.log('Calling category:', category);
      setCurrentPage(1);
      console.log('currentPage:', currentPage);
      loadMoreData();
    }
  }, [observeSentinel, hasMoreData, category]);

  return (
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
  );
};

export default Board;
