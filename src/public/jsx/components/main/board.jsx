import React, { useEffect, useState, useRef } from 'react';

// 앞으로 해야 할 일
// IMG 렌더하기, IMG 렌더 시 제목, 내용 조금씩만 렌더 되게 하기
// 이미지 크기가 크면 잘라서 쓰기....?
// 연도별 정렬, 조회수 정렬, 좋아요 정렬

const Board = () => {
  const [board, setBoard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const itemsPerPage = 10; // 서버에서 10개씩 가져오도록 설정
  const itemsPerRow = 4; // 한 줄에 4개씩 표시

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

  const handleScroll = () => {
    const { current: container } = containerRef;

    if (container && container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
      loadMoreData();
    }
  };

  useEffect(() => {
    const { current: container } = containerRef;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [containerRef, currentPage, loading]); // currentPage와 loading이 변할 때마다 호출

  useEffect(() => {
    // 초기 렌더링 시 데이터 로드
    loadMoreData();
  }, []); 

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
    gap: '16px',
    padding: '16px',
    overflowY: 'auto',
    maxHeight: '500px',
  };

  const postStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      {board.map((post) => (
        <div key={post.id} style={postStyle} onClick={() => handlePostClick(post.postId)}>
          <p>{post.category}</p>
          {post.img && <img src={post.img} alt="Post Image" style={{ maxWidth: '100%', height: 'auto' }} />}
          <h5 className="post-title">{post.title}</h5>
          <p className="card-text">{post.content}</p>
          <div>
            <span>${new Date(post.createdAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}</span>
            <span>${post.viewCount}</span>
          </div>
        </div>
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Board;

