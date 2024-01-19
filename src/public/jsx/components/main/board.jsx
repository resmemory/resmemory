import React, { useEffect, useState, useRef } from 'react';
import Masonry from 'react-masonry-css';
import '../css/board.css';

// 남은 것
// 연도별로 보여주기 만들기
// 조회, 좋아요 만들기

const Board = () => {
  const [board, setBoard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);
  const itemsPerPage = 10;
  const itemsPerRow = 4;

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
    if (!loading) {
      const data = await fetchData(currentPage, itemsPerPage);
      if (data.length > 0) {
        setBoard((prevBoard) => [...prevBoard, ...data]);
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };

  const handleIntersection = (entries) => {
    const { current: sentinel } = sentinelRef;

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadMoreData();
      }
    });
  };

  useEffect(() => {
    const { current: container } = containerRef;
    const { current: sentinel } = sentinelRef;

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    });

    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [sentinelRef, loading]);

  useEffect(() => {
    loadMoreData();
  }, []);

  const breakpointColumnsObj = {
    default: itemsPerRow,
    1100: 3,
    700: 2,
    500: 1
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
      <div ref={sentinelRef}></div>
      {loading && <p>Loading...</p>}
    </Masonry>
  );
};

export default Board;
