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
                      <button class="report-button" onclick ="openReportModal(${thread.threadId})">신고</button>
                      <button class="delete-button" onclick ="removeThread(${thread.threadId})">삭제</button>
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
  const reportModal = document.getElementById('reportModal');
  const confirmReportButton = document.getElementById('confirmReport');
  const closeModalButton = document.getElementById('closeModal');
  const reportReasonInput = document.getElementById('reportReason');

  confirmReportButton.onclick = async () => {
    const reason = reportReasonInput.value;
    if (reason.trim() !== '') {
      try {
        // AJAX 요청으로 신고 내역 전송
        const response = await fetch(`/api/report/${threadId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Authorization'),
          },
          body: JSON.stringify({ reason }), // 이유를 함께 전송
        });

        const result = await response.json();

        if (result.responseData.code === 611) {
          alert('신고가 접수되었습니다.');
          closeReportModal();

          // 다른 HTML 페이지로 이동
          window.location.href = './admin.html';
        } else {
          alert('신고 실패: ' + result.responseData.message);
        }
      } catch (error) {
        console.error('에러 발생: ', error);
      }
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