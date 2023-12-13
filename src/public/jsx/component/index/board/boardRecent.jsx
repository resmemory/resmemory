// import React, { useState, useEffect } from 'react';

// const PostsList = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPosts, setTotalPosts] = useState(0);
//   const [postData, setPostData] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     loadPosts(currentPage);
//   }, [currentPage]);

//   const countPosts = async () => {
//     // 이 부분에서 countPosts() 함수를 구현하세요.
//     // 데이터를 가져오는 비동기 작업은 useEffect 내부에서 직접 처리하지 않도록 주의하세요.
//   };

//   const loadPosts = async (currentPage) => {
//     sessionStorage.removeItem('viewCountMode');
//     if (!currentPage) {
//       currentPage = 1;
//     }

//     try {
//       const totalPostsCount = await countPosts();
//       setTotalPosts(totalPostsCount);

//       const response = await fetch(`./api/posts?pageNum=${currentPage}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await response.json();
//       if (data.responseData.code) {
//         alert(code[data.responseData.code]);
//       }

//       setPostData(data.responseData);
//     } catch (error) {
//       setError(error);
//     }
//   };

//   const clickPost = (postId) => {
//     // 클릭된 포스트 처리 로직을 구현하세요.
//   };

//   const createPaginationButtons = () => {
//     // 페이지네이션 버튼 생성 로직을 구현하세요.
//   };

//   return (
//     <div>
//       <button onClick={() => setCurrentPage(currentPage - 1)}>이전 페이지</button>
//       <button onClick={() => setCurrentPage(currentPage + 1)}>다음 페이지</button>

//       {error && <div>Error: {error.message}</div>}
//       <table className="postlist">
//         <thead>
//           <tr>
//             <th>Category</th>
//             <th>Title</th>
//             <th>Nickname</th>
//             <th>Created At</th>
//             <th>View Count</th>
//           </tr>
//         </thead>
//         <tbody>
//           {postData.map((post) => (
//             <tr key={post.postId} className="postBox">
//               <td>{post.annualCategory}</td>
//               <td className="post_title" onClick={() => clickPost(post.postId)}>{post.title}</td>
//               <td>{post.nickname}</td>
//               <td>{new Date(post.createdAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}</td>
//               <td>{post.viewCount}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {createPaginationButtons(currentPage, totalPosts)}
//     </div>
//   );
// };

// export default PostsList;

import React, { useState, useEffect } from 'react';
import PaginationButtons from '../pagenation/pageRecent'; // 파일 경로에 맞게 수정하세요.

const PostsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postData, setPostData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  const countPosts = async () => {
    let totalPosts = 0;

    const response = await fetch(`./api/posts/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    const data = await response.json();
    if (data.responseData.code) {
      alert(code[data.responseData.code]);
    }
  
    totalPosts = data.responseData.bodies;
    if (totalPosts > 100) {
      totalPosts = 100;
    }
  
    return totalPosts;
  };

  const loadPosts = async (currentPage) => {
    sessionStorage.removeItem('viewCountMode');
    if (!currentPage) {
      currentPage = 1;
    }

    try {
      const totalPostsCount = await countPosts();
      setTotalPosts(totalPostsCount);

      const response = await fetch(`./api/posts?pageNum=${currentPage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.responseData.code) {
        alert(code[data.responseData.code]);
      }

      setPostData(data.responseData);
    } catch (error) {
      setError(error);
    }
  };

  const clickPost = async (postId) => {
    try {
      // postId를 사용하여 API 호출을 통해 상세 정보를 가져옴
      const detailedPostResponse = await fetch(`./api/posts/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const detailedPostData = await detailedPostResponse.json();
  
      // 상세 정보를 어떻게 화면에 표시할지에 따라 수정
      console.log('Clicked Post Details:', detailedPostData.responseData);
      // 여기에서 모달 또는 다른 방법으로 상세 정보를 화면에 표시할 수 있습니다.
    } catch (error) {
      console.error('Error loading post details:', error);
    }
  }

  const createPaginationButtons = () => {
    return (
      <PaginationButtons
        currentPage={currentPage}
        totalPosts={totalPosts}
        onPageChange={setCurrentPage}
      />
    );
  };

  return (
    <div>
      <button onClick={() => setCurrentPage(currentPage - 1)}>이전 페이지</button>
      <button onClick={() => setCurrentPage(currentPage + 1)}>다음 페이지</button>

      {error && <div>Error: {error.message}</div>}
      <table className="postlist">
        <thead>
          <tr>
            <th>Category</th>
            <th>Title</th>
            <th>Nickname</th>
            <th>Created At</th>
            <th>View Count</th>
          </tr>
        </thead>
        <tbody>
          {postData.map((post) => (
            <tr key={post.postId} className="postBox">
              <td>{post.annualCategory}</td>
              <td className="post_title" onClick={() => clickPost(post.postId)}>{post.title}</td>
              <td>{post.nickname}</td>
              <td>{new Date(post.createdAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}</td>
              <td>{post.viewCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {createPaginationButtons()}
    </div>
  );
};

export default PostsListByRecent;
