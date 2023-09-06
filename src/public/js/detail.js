document.addEventListener('DOMContentLoaded', () => {
  loadPostDetail();
  loadComments();
});

const urlParams = new URL(location.href).searchParams;
const postId = urlParams.get('post');
const userId = localStorage.getItem('Authorization');

async function loadPostDetail() {
  const response = await fetch(`/api/posts?postId=${postId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(),
  });

  const result = await response.json();
  const post_result = result.responseData.result;
  const viewCount = post_result.viewCount;
  const updatedAt = new Date(post_result.updatedAt).toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
  });
  const nickname = post_result.nickname;
  const title = post_result.title;
  const content = post_result.content;
  const annualCategory = post_result.annualCategory;
  const img = post_result.img;

  const postBox = document.querySelector('#post-box');
  postBox.innerHTML = '';

  const temp_html = `
 
<div class="post-title">${title}</div>
<div class="post-info">
<div class="post-nickname">${nickname}</div>
<div class="post-view">조회수: ${viewCount}</div>
<div class="post-date">${updatedAt}</div>
</div>
<div class="post-buttons">
  <button class="button edit-button" onclick="modalOn('#edit-post-Modal')">수정</button>
  <button class="button delete-button" onclick="deletePost()">삭제</button>
  <button class="button bookmark-button" onclick="postBookmark()">북마크</button>
  <button class="button report-button" onclick="modalOn('#report-post-Modal')">신고</button>
</div>
<div class="post-content">
  <img src="${img}" alt="${img}" style="${img ? '' : 'display: none;'}">
  <p>${content}</p>
</div>


<div class="modal" id="edit-post-Modal" style="display: none">
<div class="modalContent">
  <div class="edit-post-Box">
    <div>
    <h2>글 수정하기</h2>
      <label>제목</label>
      <br />
      <input class="post_title" type="text" value="${title}" />
    </div>
    <div>
      <label>내용</label>
      <br />
      <textarea class="post_content" type="text" >${content}</textarea>
    </div>
    <div>
      <label>연도</label>
      <br />
      <select class="post_annualCategory">
        <option selected>${annualCategory}</option>
        <option>1970</option>
        <option>1980</option>
        <option>1990</option>
        <option>2000</option>
        <option>2010</option>
        <option>2020</option>
      </select>
    </div>
    <div>
      <label>이미지</label>
      <br />
      <input class="post_img" type="text" value="${img}" />
      <input class="post_img" type="file" />
    </div>
    <div class="edit-post-Box-btn">
        <button class="edit-post-btn" onclick="updatePost()">수정</button>
        <button class="edit-close-btn" onclick="modalClose('#edit-post-Modal')">닫기</button>
    </div>
  </div>
</div>
</div>


<div class="modal" id="report-post-Modal" style="display: none">
<div class="modalContent">


    <label>신고 내용</label>
    <br />
    <input class="report_content" type="text" id="reportContentInput"/>
  <div class="report-post-Box-btn">
      <button class="report-post-btn" onclick="postReport('post',${postId},)">신고</button>
      <button class="report-post-btn" onclick="modalClose('#report-post-Modal')">닫기</button>

</div>
</div>
</div>
`;

  postBox.innerHTML = temp_html;
}
async function loadComments() {
  const response = await fetch(`./api/comments?postId=${postId}`, {
    method: 'GET',
  });

  const result = await response.json();
  const result_data = result.responseData;
  const commentList = document.querySelector('.comment-list');
  commentList.innerHTML = '';

  const temp_html = result_data.map((data) => {
    const commentId = data.commentId;
    const content = data.content;
    const nickname = data.nickname;
    return `
    <div class="comment-item">
      <div class="comment-content">
        <span class="comment-nickname">${nickname} :</span>
        ${content}
      </div>
      <div class="comment-buttons">
        <button class="comment-edit-button" onclick="modalOn('#edit-comment-Modal${commentId}')">수정</button>
        <button class="comment-delete-button" onclick="deleteComment(${commentId})">삭제</button>
        <button class="comment-report-button" onclick="modalOn('#report-comment-Modal${commentId}')">신고</button>
      </div>
    </div>
    
    <div class="modal" id="edit-comment-Modal${commentId}" style="display: none">
    <div class="modalContent">
      <div class="edit-post-Box">
        <div>
          <label>댓글 내용</label>
          <br />
          <input class="comment_content${commentId}" type="text" value="${content}" />
        </div>
        <div class="edit-comment-Box-btn">
            <button class="edit-comment-btn" onclick="updateComment(${commentId})">수정</button>
            <button class="edit-close-btn" onclick="modalClose('#edit-comment-Modal${commentId}')">닫기</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" id="report-comment-Modal${commentId}" style="display: none">
<div class="modalContent">
  <div class="report-comment-Box">
    <div>
      <label>신고 내용</label>
      <br />
      <input class="report_content" type="text" id="reportContentInput-${commentId}"/>
    </div>
    <div class="report-post-Box-btn">
        <button class="report-comment-btn" onclick="commentReport('comment',${commentId},)">신고</button>
        <button class="report-comment-btn" onclick="modalClose('#report-comment-Modal')">닫기</button>
    </div>
  </div>
</div>
</div>
    `;
  });

  commentList.innerHTML = temp_html;
}

function modalOn(classname) {
  const target = document.querySelector(classname);
  target.style.display = 'block';
}

function modalClose(classname) {
  const target = document.querySelector(classname);
  target.style.display = 'none';
}

async function updatePost() {
  const title = document.querySelector('.post_title').value;
  const content = document.querySelector('.post_content').value;
  const annualCategory = document.querySelector('.post_annualCategory').value;
  const img = document.querySelector('.post_img').value;

  const response = await fetch(`/api/posts/${postId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: userId,
    },
    body: JSON.stringify({ title, content, annualCategory, img }),
  });
  const result = await response.json();
  if (result.responseData.code == 351) {
    alert(code[result.responseData.code]);
    return window.location.reload();
  }
  alert(code[result.responseData.code]);
}

async function deletePost() {
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
}

async function postBookmark() {
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
}

async function postComment() {
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
    return location.reload();
  }
  alert(code[result.responseData.code]);
}

async function updateComment(commentId) {
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
    return location.reload();
  }
  alert(code[result.responseData.code]);
}

async function deleteComment(contentId) {
  const response = await fetch(`api/comments/${contentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: userId,
    },
  });
  const result = await response.json();
  if (result.responseData.code == 441) {
    alert(code[result.responseData.code]);
    return location.reload();
  }
  alert(code[result.responseData.code]);
}

async function postReport(reportType, contentId) {
  const content = document.querySelector('#reportContentInput').value;

  const response = await fetch(`api/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: userId,
    },
    body: JSON.stringify({ reportType, contentId, content }),
  });
  const result = await response.json();
  if (result.responseData.code == 611) {
    alert(code[result.responseData.code]);
    return location.reload();
  }
  alert(code[result.responseData.code]);
}

async function commentReport(reportType, contentId) {
  const content = document.querySelector(`#reportContentInput-${contentId}`).value;

  const response = await fetch(`api/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: userId,
    },
    body: JSON.stringify({ reportType, contentId, content }),
  });
  const result = await response.json();
  if (result.responseData.code == 611) {
    alert(code[result.responseData.code]);
    return location.reload();
  }
  alert(code[result.responseData.code]);
}
