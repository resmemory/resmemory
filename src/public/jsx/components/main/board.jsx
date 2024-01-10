import React, { useEffect, useState, useRef } from 'react';

// const Board = () => {
//   const [board, setBoard] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     boardData();
//   }, []);

//   useEffect(() => {
//     const container = containerRef.current;
//     container.addEventListener('scroll', handleScroll);
//     return () => {
//       container.removeEventListener('scroll', handleScroll);
//     };
//   }, [handleScroll]);

//   const handleScroll = () => {
//     const container = containerRef.current;
//     if (container.scrollHeight - container.scrollTop === container.clientHeight) {
//       loadMoreData();
//     }
//   };

  const boardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`./api/posts/list?page=${currentPage}`);
      setBoard((prevBoard) => [...prevBoard, ...response.data]);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('게시판 데이터를 불러오는 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

//   const loadMoreData = () => {
//     if (!loading) {
//       boardData();
//     }
//   };

//   const handlePostClick = (postId) => {
//     const postUrl = `./detail.html?post=${postId}`;
//     console.log(`ID가 ${postId}인 게시물이 클릭되었습니다. URL: ${postUrl}`);

//     window.location.href = postUrl;
//   };

//   return (
//     <div ref={containerRef} style={{ overflowY: 'scroll', height: '400px' }}>
//       <ul>
//         {board.map((post) => (
//           <li key={post.id}>
//             <div className="post">
//               <div className="post-body">
//                 <p>{post.category}</p>
//                 <h5 className="post-title" onClick={() => handlePostClick(post.postId)}>
//                   {post.title}
//                 </h5>
//                 <p className="card-text">{post.content}</p>
//                 <td>
//                   $
//                   {new Date(post.createdAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}
//                 </td>
//                 <td>${post.viewCount}</td>
//               </div>
//             </div>
//           </li>
//         ))}
//       </ul>

//       {loading && <p>Loading...</p>}
//     </div>
//   );
// };

// export default Board;
