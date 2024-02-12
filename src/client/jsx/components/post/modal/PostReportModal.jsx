import React from 'react';

import './PostReportModal.css';

function PostReportModal({ postId, authorization }) {
  const postReport = async (reportType, postId) => {
    const content = document.querySelector('#report-content-input').value;

    const response = await fetch(`api/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
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

  const modalClose = (classname) => {
    const target = document.querySelector(classname);
    target.style.display = 'none';
  };
  return (
    <>
      <div className="modal" id="report-post-Modal">
        <div className="modal-content">
          <h3>신고 내용</h3>

          <input type="text" id="report-content-input" />
          <div className="report-post-buttons">
            <button onClick={() => postReport('post', postId)}>신고</button>
            <button id="close" onClick={() => modalClose('#report-post-Modal')}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostReportModal;
