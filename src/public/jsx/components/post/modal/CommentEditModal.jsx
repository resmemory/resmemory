import React from 'react';
function CommentEditModal({ commentId, content }) {
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

  const modalClose = (classname) => {
    const target = document.querySelector(classname);
    target.style.display = 'none';
  };
  return (
    <>
      <div className="modal" id={`edit-comment-Modal-${commentId}`} style={{ display: 'none' }}>
        <div className="modalContent">
          <div className="edit-comment-Box">
            <div>
              <label>댓글 수정하기</label>
              <br />
              <textarea
                id="comment-edit-textarea"
                name={`comment_content-${commentId}`}
                className={`comment_content${commentId}`}
                type="text"
                defaultValue={content}
              />
            </div>
            <div className="edit-comment-Box-btn">
              <button className="edit-comment-btn" onClick={() => updateComment(commentId)}>
                수정
              </button>
              <button
                className="edit-close-btn"
                onClick={() => modalClose(`#edit-comment-Modal-${commentId}`)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default CommentEditModal;
