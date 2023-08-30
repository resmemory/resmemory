const code = {
  721: '스레드가 생성되었습니다.',
  722: '내용 양식이 올바르지 않습니다.',
  720: '알 수 없는 오류가 발생하였습니다.',
  711: '스레드가 존재하지 않습니다.',
  710: '알 수 없는 오류가 발생하였습니다.',
  731: '스레드가 삭제 되었습니다.',
  732: '로그인이 필요한 기능입니다.',
  733: '스레드가 존재하지 않습니다.',
  744: '댓글 삭제 권한이 없습니다.',
  730: '알 수 없는 오류가 발생하였습니다.',
  371: '스레드가 삭제 되었습니다.',
  372: '로그인이 필요한 기능입니다.',
  373: '스레드가 존재하지 않습니다.',
  370: '알 수 없는 오류가 발생하였습니다.',

  // 신고
  610: '알 수 없는 오류가 발생하였습니다.',
  611: '신고가 접수 되었습니다.',
  612: '로그인이 필요한 기능입니다.',
  613: '해당 신고 글의 데이터가 읽히지 않았습니다.',
  614: '이미 신고하신 상태입니다.',
  615: '신고 내용의 입력이 필요합니다.',
  620: '알 수 없는 오류가 발생하였습니다.',
};

document.addEventListener('DOMContentLoaded', () => {
  viewThreads();
});

// 스레드 삭제 버튼 클릭 시 DELETE 요청
async function viewThreads() {
  const threadList = document.getElementById('threadList');
  const response = await fetch('/api/threads', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  if (data.responseData.result) {
    const threadsHTML = data.responseData.result
      .map((thread) => {
        return `<div class="thread" >
                    ${thread.content}, ${thread.createdAt}
                    <div class="button-container">
                      <button class="report-button" onclick ="openReportModal(${thread.threadId})">신고</button>
                      <button class="delete-button" onclick ="removeThread(${thread.threadId})">삭제</button>
                      <div id="reportModal_${thread.threadId}" class="modal">
                        <div class="modal-content">
                          <span class="close-button" id="closeModal" onclick="closeReportModal(${thread.threadId})">&times;</span>
                          <h2>스레드 신고</h2>
                          <p>이 스레드를 신고하시겠습니까?</p>
                          <textarea id="reportReason" placeholder="신고 이유를 입력하세요"></textarea>
                          <button id="confirmReport" onclick ="report(${thread.threadId})">신고</button>
                        </div>
                      </div>
                    </div>
                  </div>`;
      })
      .join('');
    threadList.innerHTML = threadsHTML;
  }
}

// 스레드 삭제 버튼 클릭 시 DELETE 요청
async function removeThread(threadId) {
  const response = await fetch(`./api/threads/${threadId}`, {
    method: 'DELETE',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
    },
  });
  const result = await response.json();
  console.log(result);
  if (result.responseData.code == 731) {
    alert(code[result.responseData.code]);
    location.reload();
  } else {
    alert(code[result.responseData.code]);
  }
}

// 모달창 열기
function openReportModal(threadId) {
  const reportModal = document.getElementById(`reportModal_${threadId}`);
  reportModal.style.display = 'block';
}

// 모달창 닫기
function closeReportModal(threadId) {
  const reportModal = document.getElementById(`reportModal_${threadId}`);
  reportModal.style.display = 'none';
}

async function report(contentId) {
  const content = document.querySelector('#reportReason').value;
  const response = await fetch(`./api/reports`, {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('Authorization'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, reportType: 'thread', contentId }),
  });
  const result = await response.json();
  console.log(result);
  alert(code[result.responseData.code]);
}
