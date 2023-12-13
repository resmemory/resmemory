import React, { useState, useEffect } from 'react';

const PostsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postData, setPostData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  const countPosts = async () => {
    // 이 부분에서 countPosts() 함수를 구현하세요.
    // 데이터를 가져오는 비동기 작업은 useEffect 내부에서 직접 처리하지 않도록 주의하세요.
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

  const clickPost = (postId) => {
    // 클릭된 포스트 처리 로직을 구현하세요.
  };

  const createPaginationButtons = () => {
    // 페이지네이션 버튼 생성 로직을 구현하세요.
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

      {createPaginationButtons(currentPage, totalPosts)}
    </div>
  );
};

export default PostsList;
