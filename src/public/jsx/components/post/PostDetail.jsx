import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import PostEditModal from './modal/PostEditModal.jsx';
import PostReportModal from './modal/PostReportModal.jsx';
import Comment from './Comment.jsx';
import Pencil from '../svg/Pencil.jsx';
import Heart from '../svg/Heart.jsx';

import './PostDetail.css';

const PostDetail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get('post');
  const [loginedUserId, setLoginedUserId] = useState();
  const [userId, setUserId] = useState(sessionStorage.getItem('Authorization'));

  const [postDetails, setPostDetails] = useState(null);

  useEffect(async () => {
    await loginChecker();
    await loadPostDetail();
  }, []);

  const loginChecker = async () => {
    if (sessionStorage.getItem('Authorization')) {
      const profileresponse = await fetch(`./api/users`, {
        method: 'GET',
        headers: {
          Authorization: sessionStorage.getItem('Authorization'),
        },
      });
      const profileresult = await profileresponse.json();
      if (profileresult.responseData.bodies.userId) {
        setLoginedUserId(profileresult.responseData.bodies.userId);
      }
    }
  };

  const loadPostDetail = async () => {
    const response = await fetch(`/api/posts?postId=${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    const postResult = result.responseData.result;

    const viewCount = postResult.viewCount;
    const updatedAt = new Date(postResult.updatedAt).toLocaleDateString('ko-KR', {
      timeZone: 'Asia/Seoul',
    });
    const nickname = postResult.nickname;
    const title = postResult.title || '';
    const content = postResult.content || '';
    const category = postResult.category || '';
    let img = postResult.img || '';
    let thumbnail = postResult.thumbnail || '';
    const userId = postResult.userId;
    setPostDetails({
      viewCount,
      updatedAt,
      nickname,
      title,
      content,
      category,
      img,
      thumbnail,
      userId,
    });
  };

  const deletePost = async () => {
    const response = await fetch(`api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: userId,
      },
    });
    const result = await response.json();
    if (result.responseData.code == 361) {
      alert(code[result.responseData.code]);
      return (window.location.href = `/`);
    }
    alert(code[result.responseData.code]);
  };

  const postBookmark = async () => {
    const response = await fetch(`/api/bookmarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userId,
      },
      body: JSON.stringify({ postId }),
    });
    const result = await response.json();
    alert(code[result.responseData.code]);
    if (result.responseData.code === 0) {
      window.location.href = `./login`;
    }
  };

  const modalOn = (classname) => {
    const target = document.querySelector(classname);
    target.style.display = 'block';
  };

  return (
    <>
      {postDetails && (
        <>
          <div id="category">{postDetails.category}</div>
          <h1>{postDetails.title}</h1>
          <div id="writter">
            작성자 <p> {postDetails.nickname}</p>
          </div>

          <div id="buttons">
            {loginedUserId == postDetails.userId ? (
              <>
                <button id="edit-button" onClick={() => modalOn('#edit-post-Modal')}>
                  <Pencil /> 수정하기
                </button>
                <PostEditModal postId={postId} postDetails={postDetails} />
                <button id="delete-button" onClick={() => deletePost()}>
                  삭제하기
                </button>
              </>
            ) : (
              <>
                <button id="bookmark-button" onClick={() => postBookmark()}>
                  <Heart /> 북마크
                </button>

                <button id="report-button" onClick={() => modalOn('#report-post-Modal')}>
                  신고하기
                </button>
                <PostReportModal postId={postId} userId={userId} />
              </>
            )}
          </div>
          <div id="content">
            <img
              src={postDetails.img}
              alt={postDetails.img}
              style={{ display: postDetails.img ? '' : 'none' }}
            />

            <p style={{ display: postDetails.content ? '' : 'none' }}>{postDetails.content}</p>
          </div>
        </>
      )}
      <Comment userId={userId} loginedUserId={loginedUserId} postId={postId} />
    </>
  );
};

export default PostDetail;
