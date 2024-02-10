import React from 'react';

import './CommentEditModal.css';

function CommentEditModal({ postId, commentId, content, authorization }) {
  const updateComment = async (commentId) => {
    const content = document.querySelector(`.comment_content${commentId}`).value;

    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
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

  const modalClose = (classname) => {
    const target = document.querySelector(classname);
    target.style.display = 'none';
  };
  return (
    <>
      <div className="modal" id={`edit-comment-Modal-${commentId}`} style={{ display: 'none' }}>
        <div className="modal-content">
          <h3>댓글 수정하기</h3>

          <textarea
            name={`comment_content-${commentId}`}
            className={`comment_content${commentId}`}
            type="text"
            defaultValue={content}
          />

          <div className="edit-comment-buttons">
            <button className="edit-comment-btn" onClick={() => updateComment(commentId)}>
              수정
            </button>
            <button id="close" onClick={() => modalClose(`#edit-comment-Modal-${commentId}`)}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default CommentEditModal;
