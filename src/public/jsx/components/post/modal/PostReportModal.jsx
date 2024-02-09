import React from 'react';

function PostReportModal({ postId, authorization }) {
  const postReport = async (reportType, postId) => {
    const content = document.querySelector('#reportContentInput').value;

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
      <div className="modal" id="report-post-Modal" style={{ display: 'none' }}>
        <div className="modal-content">
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
  );
}

export default PostReportModal;
