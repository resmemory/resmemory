import React, { useEffect, useState, useRef } from 'react';
import Masonry from 'react-masonry-css';
import '../css/board.css';

const Board = ({ initialData }) => {
  const [board, setBoard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [observeSentinel, setObserveSentinel] = useState(true); // 새로운 상태 추가
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);
  const itemsPerPage = 12;
  const itemsPerRow = 5;

  const fetchData = async (page, perPage) => {
    try {
      setLoading(true);
      const response = await fetch(`./api/posts/?pageNum=${page}&perPage=${perPage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseData = await response.json();
      console.log("Fetched data:", responseData);
      return responseData.responseData;
    } catch (error) {
      console.error('게시판 데이터를 불러오는 중 오류 발생:', error);
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
    if (!loading && hasMoreData) {
      setLoading(true);
  
      const data = await fetchData(currentPage, itemsPerPage);
  
      setLoading(false); // 데이터를 받아온 후에 로딩 비활성화
  
      if (data.length > 0) {
        setBoard((prevBoard) => [...prevBoard, ...data]);
        setCurrentPage((prevPage) => prevPage + 1);
        setHasMoreData(data.length >= itemsPerPage);
      } else {
        setHasMoreData(false);
        setObserveSentinel(false); // 데이터가 없으면 스크롤 감시 중지
      }
    }
  };
  
  const handleIntersection = (entries, observer) => {
    const { current: sentinel } = sentinelRef;
  
    entries.forEach((entry) => {
      console.log("Intersection observed:", entry.isIntersecting);
      if (entry.isIntersecting && !loading && observeSentinel) {
        observer.unobserve(sentinel);
  
        // 이미 로딩 중이거나 observeSentinel이 false일 때는 추가 호출을 막음
        if (!loading && observeSentinel) {
          setLoading(true);
          setTimeout(() => {
            console.log("Load more data...");
            loadMoreData();
            setLoading(false);
            // observeSentinel이 여전히 true일 때만 다시 observe를 시작
            if (observeSentinel) {
              observer.observe(sentinel);
            }
          }, 0);
        }
      }
    });
  };
  

  useEffect(() => {
    setBoard(initialData || []);
    setHasMoreData(initialData && initialData.length >= itemsPerPage);
    setCurrentPage(1);
    setObserveSentinel(true); // 초기화시 감시 활성화
  }, [initialData]);

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
  }, [hasMoreData, sentinelRef, handleIntersection, observeSentinel]);

  useEffect(() => {
    // 초기 로딩 시 한 번만 데이터를 불러옴
    if (hasMoreData && observeSentinel) {
      loadMoreData();
    }
  }, [observeSentinel]); 

  const breakpointColumnsObj = {
    default: itemsPerRow,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
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
            <span>${new Date(post.createdAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}</span>
            <span>${post.viewCount}</span>
          </div>
        </div>
      ))}
      {hasMoreData && <div ref={sentinelRef}></div>}
      {loading && <p>Loading...</p>}
    </Masonry>
  );
};

export default Board;
