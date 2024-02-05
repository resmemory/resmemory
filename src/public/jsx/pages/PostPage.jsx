import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/main/header.jsx';

import './PostPage.css';

const PostPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get('post');
  const [loginedUserId, setLoginedUserId] = useState();
  const [userId, setUserId] = useState(sessionStorage.getItem('Authorization'));
  const [comments, setComments] = useState([]);
  const [postDetails, setPostDetails] = useState(null);
  const [isPostOwner, setIsPostOwner] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await loginChecker();
      await loadPostDetail();
      await loadComments();
    };

    fetchData();
  }, [postId, loginedUserId]);

  const loginChecker = async () => {
    if (sessionStorage.getItem('Authorization')) {
      const profileresponse = await fetch(`./api/users`, {
        method: 'GET',
        headers: {
          Authorization: sessionStorage.getItem('Authorization'),
        },
      });
      const profileresult = await profileresponse.json();
      setLoginedUserId(profileresult.responseData.bodies.userId);
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

    setPostDetails({
      viewCount,
      updatedAt,
      nickname,
      title,
      content,
      category,
      img,
      thumbnail,
    });

    setIsPostOwner(loginedUserId === postResult.userId);
  };

  const loadComments = async () => {
    const response = await fetch(`./api/comments?postId=${postId}`, {
      method: 'GET',
    });
    const result = await response.json();
    const commentList = result.responseData;
    // Update each comment to include user information
    const commentsWithUser = commentList.map((comment) => ({
      ...comment,
      isCommentOwner: comment.userId === loginedUserId,
    }));

    setComments(commentsWithUser);
  };

  const postComment = async () => {
    const content = document.querySelector('.comment-input').value;

    const response = await fetch(`/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userId,
      },
      body: JSON.stringify({ postId, content }),
    });

    const result = await response.json();
    if (result.responseData.code == 411) {
      alert(code[result.responseData.code]);
      return window.location.reload();
    }
    alert(code[result.responseData.code]);
    if (result.responseData.code === 0) {
      window.location.href = `./login`;
    }
  };

  const updatePost = async () => {
    const form = document.querySelector('#form');
    const authorization = document.querySelector('.Authorization');
    authorization.value = sessionStorage.getItem('Authorization');
    const formData = new FormData(form);
    const response = await fetch(`./api/posts/${postId}`, {
      method: 'PATCH',
      body: formData,
    });

    const data = await response.json();
    alert(code[data.responseData.code]);

    if (data.responseData.code === 351) {
      window.location.reload();
    }
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

  const updateComment = async (commentId) => {
    const content = document.querySelector(`.comment_content${commentId}`).value;

    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userId,
      },
      body: JSON.stringify({ postId, content }),
    });
    const result = await response.json();
    if (result.responseData.code == 431) {
      alert(code[result.responseData.code]);
      return window.location.reload();
    }
    alert(code[result.responseData.code]);
    if (result.responseData.code === 0) {
      window.location.href = `./login`;
    }
  };

  const deleteComment = async (commentId) => {
    const response = await fetch(`api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: userId,
      },
    });
    const result = await response.json();
    if (result.responseData.code == 441) {
      alert(code[result.responseData.code]);
      return window.location.reload();
    }
    alert(code[result.responseData.code]);
    if (result.responseData.code === 0) {
      window.location.href = `./login`;
    }
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

  const postReport = async (reportType) => {
    const content = document.querySelector('#reportContentInput').value;

    const response = await fetch(`api/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userId,
      },
      body: JSON.stringify({ reportType, contentId: postId, content }),
    });
    const result = await response.json();
    if (result.responseData.code == 611) {
      alert(code[result.responseData.code]);
      return window.location.reload();
    }
    alert(code[result.responseData.code]);
    if (result.responseData.code === 0) {
      window.location.href = `./login`;
    }
  };

  const commentReport = async (reportType, commentId) => {
    const content = document.querySelector(`#reportContentInput-${commentId}`).value;

    const response = await fetch(`api/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userId,
      },
      body: JSON.stringify({ reportType, contentId: commentId, content }),
    });
    const result = await response.json();
    if (result.responseData.code == 611) {
      alert(code[result.responseData.code]);
      return window.location.reload();
    }
    alert(code[result.responseData.code]);
    if (result.responseData.code === 0) {
      window.location.href = `./login`;
    }
  };

  const modalOn = (classname) => {
    const target = document.querySelector(classname);
    target.style.display = 'block';
  };

  const modalClose = (classname) => {
    const target = document.querySelector(classname);
    target.style.display = 'none';
  };
  return (
    <div>
      <Header />
      <div className="post-box" id="post-box">
        {postDetails && (
          <>
            <div className="post-category">{postDetails.category}</div>
            <div className="post-title">{postDetails.title}</div>
            <div className="post-nickname">
              작성자 <p id="post-writter"> {'ㅤ' + postDetails.nickname}</p>
            </div>

            <div className="post-buttons">
              {isPostOwner ? (
                <>
                  <button
                    className="button_edit-button"
                    onClick={() => modalOn('#edit-post-Modal')}
                  >
                    수정하기
                  </button>
                  <button className="button_delete-button" onClick={() => deletePost()}>
                    삭제하기
                  </button>
                  <button className="button_bookmark-button" onClick={() => postBookmark()}>
                    북마크
                  </button>

                  <button
                    className="button_report-button"
                    onClick={() => modalOn('#report-post-Modal')}
                  >
                    신고하기
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="post-content">
              <img
                src={postDetails.img}
                alt={postDetails.img}
                style={{ display: postDetails.img ? '' : 'none' }}
              />

              <p style={{ display: postDetails.content ? '' : 'none' }}>{postDetails.content}</p>
            </div>

            <form
              action="./api/posts"
              method="PATCH"
              enctype="multipart/form-data"
              onSubmit={(e) => e.preventDefault()}
              id="form"
            >
              <input type="hidden" name="authorization" className="Authorization" />
              <div className="modal" id="edit-post-Modal" style={{ display: 'none' }}>
                <div className="modalContent">
                  <div className="edit-post-Box">
                    {/* Edit Post Modal Content */}
                    <div>
                      <h3>글 수정하기</h3>
                      <label>제목</label>
                      <br />
                      <textarea name="title" className="post_title" type="text">
                        {postDetails.title}
                      </textarea>
                    </div>
                    <div>
                      <label>내용</label>
                      <br />
                      <textarea name="content" className="post_content" type="text">
                        {postDetails.content}
                      </textarea>
                    </div>
                    <div>
                      <label>연도</label>
                      <br />
                      <select name="category" className="post_category">
                        <option selected>{postDetails.category}</option>
                        <option>1970</option>
                        <option>1980</option>
                        <option>1990</option>
                        <option>2000</option>
                        <option>2010</option>
                        <option>2020</option>
                      </select>
                    </div>
                    <br />
                    <div>
                      <label>현재 이미지</label>
                      <br />
                      <input
                        name="previousImg"
                        className="post_img"
                        type="text"
                        value={postDetails.img}
                      />
                      <br />
                      <label>변경할 이미지</label>
                      <br />
                      <input name="img" className="post_img" type="file" accept="image/*" />
                    </div>
                    <div className="edit-post-Box-btn">
                      <button className="edit-post-btn" onClick={() => updatePost()}>
                        수정
                      </button>
                      <button
                        className="edit-close-btn"
                        onClick={() => modalClose('#edit-post-Modal')}
                      >
                        닫기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="modal" id="report-post-Modal" style={{ display: 'none' }}>
              <div className="modalContent">
                {/* Report Post Modal Content */}
                <label>신고 내용</label>
                <br />
                <input className="report_content" type="text" id="reportContentInput" />
                <div className="report-post-Box-btn">
                  <button className="report-post-btn" onClick={() => postReport('post', postId)}>
                    신고
                  </button>
                  <button
                    className="report-post-close-btn"
                    onClick={() => modalClose('#report-post-Modal')}
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="comment-box">
        <h3>댓글</h3>
        <input type="text" className="comment-input" placeholder="댓글을 작성하세요" />
        <button className="comment-submit-button" onClick={() => postComment()}>
          작성하기
        </button>
        <div className="comment-list" id="comment-list">
          {comments.map((comment) => (
            <div key={comment.commentId} className="comment-item">
              <div className="comment-info">
                <div className="comment-nickname">
                  댓글 작성자 <p id="comment-writter"> {'ㅤ' + comment.nickname} </p>
                </div>
                <div className="comment-content">{comment.content}</div>
                <div className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                    timeZone: 'Asia/Seoul',
                  })}
                </div>

                <div className="comment-buttons">
                  {comment.isCommentOwner ? (
                    <>
                      <button
                        className="button_edit-comment-button"
                        onClick={() => modalOn(`#edit-comment-Modal-${comment.commentId}`)}
                      >
                        수정하기
                      </button>
                      <button
                        className="button_delete-comment-button"
                        onClick={() => deleteComment(comment.commentId)}
                      >
                        삭제하기
                      </button>
                      <button
                        className="button_report-comment-button"
                        onClick={() => modalOn(`#report-comment-Modal-${comment.commentId}`)}
                      >
                        신고하기
                      </button>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              {/* Edit Comment Modal */}
              <div
                className="modal"
                id={`edit-comment-Modal-${comment.commentId}`}
                style={{ display: 'none' }}
              >
                <div className="modalContent">
                  <div className="edit-comment-Box">
                    {/* Edit Comment Modal Content */}
                    <div>
                      <label>댓글 수정하기</label>
                      <br />
                      <textarea
                        id="comment-edit-textarea"
                        name={`comment_content-${comment.commentId}`}
                        className={`comment_content${comment.commentId}`}
                        type="text"
                        defaultValue={comment.content}
                      />
                    </div>
                    <div className="edit-comment-Box-btn">
                      <button
                        className="edit-comment-btn"
                        onClick={() => updateComment(comment.commentId)}
                      >
                        수정
                      </button>
                      <button
                        className="edit-close-btn"
                        onClick={() => modalClose(`#edit-comment-Modal-${comment.commentId}`)}
                      >
                        닫기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Report Comment Modal */}
              <div
                className="modal"
                id={`report-comment-Modal-${comment.commentId}`}
                style={{ display: 'none' }}
              >
                <div className="modalContent">
                  <label>신고 내용</label>
                  <br />
                  <input
                    className="report_content"
                    type="text"
                    id={`reportContentInput-${comment.commentId}`}
                  />
                  <div className="report-comment-Box-btn">
                    <button
                      className="report-comment-btn"
                      onClick={() => commentReport('comment', comment.commentId)}
                    >
                      신고
                    </button>
                    <button
                      className="report-comment-close-btn"
                      onClick={() => modalClose(`#report-comment-Modal-${comment.commentId}`)}
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
