import React, { useEffect, useState } from 'react';
import CommentEditModal from './modal/CommentEditModal.jsx';
import CommentReportModal from './modal/CommentReportModal.jsx';
import Balloon from '../svg/Balloon.jsx';

import './Comment.css';
import Warn from '../svg/Warn.jsx';
import Pencil from '../svg/Pencil.jsx';

function Comment({ postId, modalOn, authorization }) {
  const [comments, setComments] = useState([]);
  const [loginedUserId, setLoginedUserId] = useState();

  useEffect(() => {
    loginChecker();
    loadComments();
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

  const loadComments = async () => {
    const response = await fetch(`./api/comments?postId=${postId}`, {
      method: 'GET',
    });
    const result = await response.json();
    const commentList = result.responseData;

    const commentsWithUser = commentList.map((comment) => ({
      ...comment,
    }));

    setComments(commentsWithUser);
  };

  const postComment = async () => {
    const content = document.querySelector('#comment-input').value;

    const response = await fetch(`/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
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
  const deleteComment = async (commentId) => {
    const response = await fetch(`api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
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

  return (
    <>
      <h3>
        <Balloon />
        댓글
      </h3>
      <div className="comment">
        <input type="text" id="comment-input" placeholder="댓글을 작성하세요" />
        <button onClick={() => postComment()}>작성</button>
      </div>
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.commentId}>
            <div id="writter">
              댓글 작성자 <p> {comment.nickname} </p>
            </div>
            <p>{comment.content}</p>
            <div id="comment-bottom">
              <div className="comment-date">
                {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                  timeZone: 'Asia/Seoul',
                })}
              </div>

              <div id="comment-buttons">
                {comment.userId == loginedUserId ? (
                  <>
                    <button
                      id="edit-button"
                      onClick={() => modalOn(`#edit-comment-Modal-${comment.commentId}`)}
                    >
                      <Pencil />
                      수정하기
                    </button>
                    <CommentEditModal
                      commentId={comment.commentId}
                      content={comment.content}
                      authorization={authorization}
                      postId={postId}
                    />
                    <button id="delete-button" onClick={() => deleteComment(comment.commentId)}>
                      삭제하기
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      id="report-button"
                      onClick={() => modalOn(`#report-comment-Modal-${comment.commentId}`)}
                    >
                      <Warn /> 신고하기
                    </button>
                    <CommentReportModal
                      authorization={authorization}
                      commentId={comment.commentId}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
export default Comment;
