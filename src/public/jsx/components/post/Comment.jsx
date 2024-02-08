import React, { useEffect, useState } from 'react';
import CommentEditModal from './modal/CommentEditModal.jsx';
import CommentReportModal from './modal/CommentReportModal.jsx';
import Balloon from '../svg/Balloon.jsx';

function Comment({ userId, loginedUserId, postId }) {
  const [comments, setComments] = useState([]);

  useEffect(async () => {
    await loadComments();
  }, []);

  const loadComments = async () => {
    const response = await fetch(`./api/comments?postId=${postId}`, {
      method: 'GET',
    });
    const result = await response.json();
    const commentList = result.responseData;

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

  return (
    <>
      <h3>
        <Balloon />
        댓글
      </h3>
      <div className="comment">
        <input type="text" placeholder="댓글을 작성하세요" />
        <button onClick={() => postComment()}>작성</button>
      </div>
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.commentId}>
            <div id="writter">
              댓글 작성자 <p> {comment.nickname} </p>
            </div>
            <p>{comment.content}</p>
            <div className="comment-date">
              {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                timeZone: 'Asia/Seoul',
              })}
            </div>
            <div id="buttons">
              {comment.isCommentOwner ? (
                <>
                  <button
                    id="edit-button"
                    onClick={() => modalOn(`#edit-comment-Modal-${comment.commentId}`)}
                  >
                    수정하기
                  </button>
                  <CommentEditModal commentId={comment.commentId} content={comment.content} />
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
                    신고하기
                  </button>
                  <CommentReportModal commentId={comment.commentId} />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
export default Comment;
