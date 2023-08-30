const code = {
  100: '일시적인 오류가 발생하였습니다.',
  220: '일시적인 오류가 발생하였습니다.',
  221: '북마크 추가에 성공하였습니다.',
  222: '북마크 추가에 실패하였습니다.',
  223: '북마크 추가에 실패하였습니다.',
  224: '이미 북마크에 추가하였습니다.',
  340: '일시적인 오류가 발생하였습니다.',
  342: '존재하지 않는 게시글입니다.',
  350: '일시적인 오류가 발생하였습니다.',
  351: '게시글을 수정하였습니다.',
  352: '로그인이 필요한 기능입니다.',
  353: '제목을 입력해주세요.',
  354: '내용을 입력해주세요.',
  355: '카테고리를 설정해주세요.',
  356: '존재하지 않는 게시글입니다.',
  357: '게시글 수정 권한이 없습니다.',
  360: '일시적인 오류가 발생하였습니다.',
  361: '게시글을 삭제하였습니다.',
  362: '로그인이 필요한 기능입니다.',
  363: '존재하지 않는 게시글입니다.',
  364: '게시글 삭제 권한이 없습니다.',
  410: '일시적인 오류가 발생하였습니다.',
  411: '댓글을 작성하였습니다.',
  412: '로그인이 필요한 기능입니다.',
  413: '댓글 내용을 입력해주세요.',
  414: '존재하지 않는 게시글입니다.',
  420: '일시적인 오류가 발생하였습니다.',
  422: '존재하지 않는 게시글입니다.',
  430: '일시적인 오류가 발생하였습니다.',
  431: '댓글을 수정하였습니다.',
  432: '로그인이 필요한 기능입니다.',
  433: '수정 내용을 입력해주세요.',
  434: '존재하지 않는 댓글입니다.',
  435: '댓글 수정 권한이 없습니다.',
  440: '일시적인 오류가 발생하였습니다.',
  441: '댓글을 삭제하였습니다.',
  442: '로그인이 필요한 기능입니다.',
  443: '존재하지 않는 댓글입니다.',
  444: '댓글 삭제 권한이 없습니다.',
  610: '일시적인 오류가 발생하였습니다.',
  611: '신고가 접수 되었습니다.',
  612: '로그인이 필요한 기능입니다.',
  613: '해당 신고 글의 데이터가 읽히지 않았습니다.',
  614: '이미 신고하신 상태입니다.',
  615: '신고 내용의 입력이 필요합니다.',
};
const urlParams = new URL(location.href).searchParams;
const postId = urlParams.get('post');
const userId = localStorage.getItem('Authorization');
const getOnePost = fetch(`/api/posts?postId=${postId}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(),
})
  .then((res) => res.json())
  .then((data) => {
    const post_result = data.responseData.result;
    title = post_result.title; // 전역 변수에 할당
    content = post_result.content; // 전역 변수에 할당
    annualCategory = post_result.annualCategory; // 전역 변수에 할당
    img = post_result.img; // 전역 변수에 할당
    return data;
  });

const getComment = fetch(`/api/comments?postId=${postId}`, {
  method: 'GET',
})
  .then((res) => res.json())
  .then((data) => {
    return data;
  });

const getCommentList = () => {
  getComment.then((datas) => {
    $('#comment-list').empty();
    datas.responseData.forEach((data) => {
      const commentId = data.commentId;
      const content = data.content;
      const nickname = data.nickname;
      const userId = data.userId;
      const updatedAt = data.updatedAt;
      const temp_html = `
    <div class="comment-item">
      <div class="comment-content">
        <span class="comment-nickname">${nickname} :</span>
        ${content}
      </div>
      <div class="comment-buttons">
        <button class="comment-edit-button" onclick="modalOn('#edit-comment-Modal${commentId}')">수정</button>
        <button class="comment-delete-button" onclick="deleteComment(${commentId})">삭제</button>
        <button class="comment-report-button" onclick="modalOn('#report-comment-Modal')">신고</button>
      </div>
    </div>
    
    <div class="modal" id="edit-comment-Modal${commentId}" style="display: none">
    <div class="modalContent">
      <div class="edit-post-Box">
        <div>
          <label>댓글 내용</label>
          <br />
          <input class="comment_content" type="text" value="${content}" />
        </div>
        <div class="edit-comment-Box-btn">
            <button class="edit-comment-btn" onclick="updateComment(${commentId})">수정</button>
            <button class="edit-close-btn" onclick="modalClose('#edit-comment-Modal${commentId}')">닫기</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" id="report-comment-Modal" style="display: none">
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
      $('#comment-list').append(temp_html);
    });
  });
};

const getPost = () => {
  getOnePost.then((data) => {
    console.log(data);
    $('#post-box').empty();
    const postId = data.responseData.result.postId;
    const viewCount = data.responseData.result.viewCount;
    const annualCategory = data.responseData.result.annualCategory;
    const title = data.responseData.result.title;
    const content = data.responseData.result.content;
    const img = data.responseData.result.img;
    const updatedAt = data.responseData.result.updatedAt;
    const nickname = data.responseData.result.nickname;
    const temp_html = `
    <div class="post-info">
    <div class="post-nickname">${nickname}</div>
    <div class="post-view">조회수: ${viewCount}</div>
    <div class="post-date">${formatDate(updatedAt)}</div>
  </div>
  <div class="post-title">${title}</div>
  <div class="post-buttons">
    <button class="button edit-button" onclick="modalOn('#edit-post-Modal')">수정</button>
    <button class="button delete-button" onclick="deletePost()">삭제</button>
    <button class="button bookmark-button" onclick="postBookmark()">북마크</button>
    <button class="button report-button" onclick="modalOn('#report-post-Modal')">신고</button>
  </div>
  <div class="post-content">
    <img src="${img}" alt="${img}">
    <p>${content}</p>
  </div>


  <div class="modal" id="edit-post-Modal" style="display: none">
  <div class="modalContent">
    <div class="edit-post-Box">
      <div>
        <label>제목</label>
        <br />
        <input class="post_title" type="text" value="${title}" />
      </div>
      <div>
        <label>내용</label>
        <br />
        <input class="post_content" type="text" value="${content}" />
      </div>
      <div>
        <label>연도</label>
        <br />
        <input class="post_annualCategory" type="text" value="${annualCategory}" />
      </div>
      <div>
        <label>이미지</label>
        <br />
        <input class="post_img" type="text" value="${img}" />
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
  <div class="report-post-Box">
    <div>
      <label>신고 내용</label>
      <br />
      <input class="report_content" type="text" id="reportContentInput"/>
    </div>
    <div class="report-post-Box-btn">
        <button class="report-post-btn" onclick="postReport('post',${postId},)">신고</button>
        <button class="report-post-btn" onclick="modalClose('#report-post-Modal')">닫기</button>
    </div>
  </div>
</div>
</div>
  `;
    $('#post-box').append(temp_html);
  });
};

function modalOn(classname) {
  const target = document.querySelector(classname);
  target.style.display = 'block';
}

function modalClose(classname) {
  const target = document.querySelector(classname);
  target.style.display = 'none';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function updatePost() {
  const updatedTitle = $('.post_title').val();
  const updatedContent = $('.post_content').val();
  const updatedAnnualCategory = $('.post_annualCategory').val();
  const updatedImg = $('.post_img').val();

  const req = {
    title: updatedTitle,
    content: updatedContent,
    annualCategory: updatedAnnualCategory,
    img: updatedImg,
  };
  fetch(`/api/posts/${postId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: userId,
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.responseData.code == 351) {
        alert(code[res.responseData.code]);
        return window.location.reload();
      }
      alert(code[res.responseData.code]);
    });
}

function deletePost() {
  fetch(`api/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: userId,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.responseData.code == 361) {
        alert(code[res.responseData.code]);
        return (window.location.href = `/`);
      }
      alert(code[res.responseData.code]);
    });
}

function postBookmark() {
  const req = {
    postId: postId,
  };

  fetch(`/api/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: userId,
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      alert(code[res.responseData.code]);
    });
}

function postComment() {
  const commentContent = $('.comment-input').val();
  const req = {
    content: commentContent,
    postId: postId,
  };

  fetch(`/api/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: userId,
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.responseData.code == 411) {
        alert(code[res.responseData.code]);
        return location.reload();
      }
      alert(code[res.responseData.code]);
    });
}

function updateComment(commentId) {
  const updatedContent = $('.comment_content').val();

  const req = { postId: postId, content: updatedContent };
  fetch(`/api/comments/${commentId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: userId,
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    });
}

function deleteComment(contentId) {
  fetch(`api/comments/${contentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: userId,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.responseData.code == 441) {
        alert(code[res.responseData.code]);
        return location.reload();
      }
      alert(code[res.responseData.code]);
    });
}

function postReport(reportType, contentId) {
  const postContent = $('#reportContentInput').val();
  const req = {
    reportType,
    contentId,
    content: postContent,
  };
  console.log(req);
  fetch(`api/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: userId,
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.responseData.code == 611) {
        alert(code[res.responseData.code]);
        return location.reload();
      }
      alert(code[res.responseData.code]);
    });
}

function commentReport(reportType, contentId) {
  const commentContent = $(`#reportContentInput-${contentId}`).val();
  const req = {
    reportType,
    contentId,
    content: commentContent,
  };
  fetch(`api/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: userId,
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.responseData.code == 611) {
        alert(code[res.responseData.code]);
        return location.reload();
      }
      alert(code[res.responseData.code]);
    });
}

getPost();
getCommentList();
