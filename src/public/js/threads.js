document.addEventListener('DOMContentLoaded', () => {
  viewThreads();
});

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
                  <h2> ${thread.content} </h2>
                  <p>  ${new Date(thread.createdAt).toLocaleString('ko-KR', {
                    timeZone: 'Asia/Seoul',
                  })}
                      <button class="report-button" onclick ="openReportModal(${
                        thread.threadId
                      })">신고</button>
                      <button class="delete-button" onclick ="removeThread(${
                        thread.threadId
                      })">삭제</button>
                      <div id="reportModal_${thread.threadId}" class="modal">
                        <div class="modal-content">
                          <span class="close-button" id="closeModal" onclick="closeReportModal(${
                            thread.threadId
                          })">&times;</span>
                          <h2>스레드 신고</h2>
                          <p>이 스레드를 신고하시겠습니까?</p>
                          <textarea id="reportReason" placeholder="신고 이유를 입력하세요"></textarea>
                          <button id="confirmReport" onclick ="report(${
                            thread.threadId
                          })">신고</button>
                        </div>
                      </div>
                  </div>`;
      })
      .join('');
    threadList.innerHTML = threadsHTML;
  }
}

async function removeThread(threadId) {
  const response = await fetch(`./api/threads/${threadId}`, {
    method: 'DELETE',
    headers: {
      Authorization: sessionStorage.getItem('Authorization'),
    },
  });
  const result = await response.json();

  if (result.responseData.code == 731) {
    alert(code[result.responseData.code]);
    location.reload();
  } else {
    alert(code[result.responseData.code]);
    if (result.responseData.code === 0) {
      location.href = `./login`;
    }
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
      Authorization: sessionStorage.getItem('Authorization'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, reportType: 'thread', contentId }),
  });
  const result = await response.json();
  alert(code[result.responseData.code]);
  if (result.responseData.code === 0) {
    location.href = `./login`;
  } else {
    location.reload();
  }
}

async function writeThread() {
  const content = document.querySelector('.writeThread').value;
  const response = await fetch(`./api/threads`, {
    method: 'POST',
    headers: {
      Authorization: sessionStorage.getItem('Authorization'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  const result = await response.json();
  alert(code[result.responseData.code]);
  if (result.responseData.code === 0) {
    location.href = `./login`;
  } else {
    location.reload();
  }
}
