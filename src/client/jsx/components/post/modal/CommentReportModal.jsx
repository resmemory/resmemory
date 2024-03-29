import React from 'react';

import './CommentReportModal.css';

function CommentReportModal({ commentId, authorization }) {
  const commentReport = async (reportType, commentId) => {
    const content = document.querySelector(`#reportContentInput-${commentId}`).value;

    const response = await fetch(`api/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
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

  const modalClose = (classname) => {
    const target = document.querySelector(classname);
    target.style.display = 'none';
  };
  return (
    <>
      <div className="modal" id={`report-comment-Modal-${commentId}`}>
        <div className="modal-content">
          <h3>신고 내용</h3>

          <input type="text" id={`reportContentInput-${commentId}`} />
          <div className="report-comment-buttons">
            <button onClick={() => commentReport('comment', commentId)}>신고</button>
            <button id="close" onClick={() => modalClose(`#report-comment-Modal-${commentId}`)}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default CommentReportModal;
