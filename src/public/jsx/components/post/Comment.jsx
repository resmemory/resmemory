import React, { useEffect, useState } from 'react';
import CommentEditModal from './modal/CommentEditModal.jsx';
import CommentReportModal from './modal/CommentReportModal.jsx';

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
      <div className="comment-box">
        <h3>댓글</h3>
        <div className="writeCommentBox">
          <input type="text" className="comment-input" placeholder="댓글을 작성하세요" />
          <button className="comment-submit-button" onClick={() => postComment()}>
            작성
          </button>
        </div>
        <div className="comment-list" id="comment-list">
          {comments.map((comment) => (
            <div key={comment.commentId} className="comment-item">
              <div className="comment-info">
                <div className="comment-nickname">
                  댓글 작성자 <p id="comment-writter"> {comment.nickname} </p>
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
                      <CommentEditModal commentId={comment.commentId} content={comment.content} />
                      <button
                        className="button_delete-comment-button"
                        onClick={() => deleteComment(comment.commentId)}
                      >
                        삭제하기
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="button_report-comment-button"
                        onClick={() => modalOn(`#report-comment-Modal-${comment.commentId}`)}
                      >
                        신고하기
                      </button>
                      <CommentReportModal commentId={comment.commentId} />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default Comment;
