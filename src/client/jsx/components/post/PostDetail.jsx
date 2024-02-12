import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import PostEditModal from './modal/PostEditModal.jsx';
import PostReportModal from './modal/PostReportModal.jsx';
import Comment from './Comment.jsx';
import Pencil from '../svg/Pencil.jsx';
import Heart from '../svg/Heart.jsx';
import View from '../svg/View.jsx';

import './PostDetail.css';
import Warn from '../svg/Warn.jsx';

const PostDetail = () => {
  const location = useLocation();
  const { postId } = location.state;
  const [loginedUserId, setLoginedUserId] = useState(0);
  const [authorization, setAuthorization] = useState(sessionStorage.getItem('Authorization'));
  const [postDetails, setPostDetails] = useState(null);
  const [doneLoginCheck, setDoneLoginCheck] = useState(false);

  useEffect(() => {
    loginChecker();
    loadPostDetail();
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
      if (profileresult.responseData.code == 171) {
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
    const updatedAt = new Date(postResult.updatedAt).toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
    });
    const nickname = postResult.nickname;
    const title = postResult.title || '';
    const content = postResult.content || '';
    const category = postResult.category || '';
    let img = postResult.img || '';
    let thumbnail = postResult.thumbnail || '';
    const userId = postResult.userId;
    const viewCount = postResult.viewCount;
    const bookmarks = postResult.bookmarks;
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
      viewCount,
      bookmarks,
    });
  };

  const deletePost = async () => {
    const response = await fetch(`api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
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
        Authorization: authorization,
      },
      body: JSON.stringify({ postId }),
    });
    const result = await response.json();
    alert(code[result.responseData.code]);
    if (result.responseData.code === 0) {
      window.location.href = `./login`;
    }
    window.location.reload();
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
            <p>
              <View /> {postDetails.viewCount}
            </p>
            <p>
              <Heart /> {postDetails.bookmarks}
            </p>
          </div>
          <div>
            {' '}
            <p>{postDetails.updatedAt}</p>
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
                  <Warn />
                  신고하기
                </button>
                <PostReportModal postId={postId} authorization={authorization} />
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
      <Comment authorization={authorization} postId={postId} modalOn={modalOn} />
    </>
  );
};

export default PostDetail;
