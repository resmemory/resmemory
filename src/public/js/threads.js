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
                      <button class="report-button" data-thread-id="${thread.threadId}">신고</button>
                      <button class="delete-button" onclick="removeThread"(${thread.threadId})">삭제</button>
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

// 신고 버튼 클릭 시 모달창 띄우기
// document.addEventListener('click', (event) => {
//   if (event.target.classList.contains('report-button')) {
//     const threadId = event.target.getAttribute('data-thread-id');
//     openReportModal(threadId);
//   }
//   if (event.target.classList.contains('delete-button')) {
//     const threadId = event.target.getAttribute('data-thread-id');
//     removeThread(threadId);
//   }
// });

// 모달창 열기
function openReportModal(threadId) {
  const reportModal = document.getElementById('reportModal');
  const confirmReportButton = document.getElementById('confirmReport');
  const closeModalButton = document.getElementById('closeModal');
  const reportReasonInput = document.getElementById('reportReason');

  confirmReportButton.onclick = () => {
    const reason = reportReasonInput.value;
    if (reason.trim() !== '') {
      // TODO: 스레드를 신고하는 로직 추가 (이유(reason)를 함께 전송)
      console.log(`스레드 ${threadId}를 신고합니다. 이유: ${reason}`);
      closeReportModal();
    } else {
      alert('신고 이유를 입력해주세요.');
    }
  };

  closeModalButton.onclick = closeReportModal;

  reportModal.style.display = 'block';
}

// 모달창 닫기
function closeReportModal() {
  const reportModal = document.getElementById('reportModal');
  reportModal.style.display = 'none';
}

// 스레드 삭제 함수와 중복되지 않도록 주의
async function removeThread(threadId) {
  // ... 이전 코드 ...
}
