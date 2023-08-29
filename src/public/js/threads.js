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

const ITEMS_PER_PAGE = 10; // 페이지당 표시할 아이템 개수
let currentPage = 1;

document.addEventListener('DOMContentLoaded', async () => {
  const threadList = document.getElementById('threadList');
  const paginationContainer = document.getElementById('pagination');

  try {
    const response = await fetch('/api/threads');
    const data = await response.json();

    if (data.responseData.result) {
      const threadsHTML = data.responseData.result
        .map((thread) => {
          return `<div class="thread" data-thread-id="${thread.id}">
                    ${thread.content}, ${thread.createdAt}
                    <div class="button-container">
                      <button class="delete-button">삭제</button>
                    </div>
                  </div>`;
        })
        .join('');
      threadList.innerHTML = threadsHTML;

      // 스레드 삭제 버튼 클릭 시 DELETE 요청
      document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-button')) {
          const threadContainer = event.target.closest('.thread');
          const threadId = threadContainer.dataset.threadId;

          try {
            const response = await fetch(`/api/threads/${threadId}`, {
              method: 'DELETE',
            });

            if (response.ok) {
              threadContainer.remove();
            } else {
              console.error('Failed to delete thread');
            }
          } catch (error) {
            console.error('Error deleting thread:', error);
          }
        }
      });

      // 페이지네이션 생성
      generatePagination(data.totalPages, paginationContainer);
    } else {
      threadList.innerHTML = '<p>No threads available.</p>';
    }
  } catch (error) {
    console.error('Error fetching threads:', error);
  }
});

function generatePagination(totalPages, paginationContainer) {
  let paginationHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `<a class="page-link" data-page="${i}">${i}</a>`;
  }

  paginationContainer.innerHTML = paginationHTML;
}

// 신고 모달 관련 코드
const openModalButton = document.getElementById('openModal');
const closeModalButton = document.getElementById('closeModal');
const modal = document.getElementById('myModal');
const submitReportButton = document.getElementById('submitReport');
const reportInput = document.getElementById('reportInput');

openModalButton.addEventListener('click', function () {
  modal.style.display = 'flex';
});

closeModalButton.addEventListener('click', function () {
  modal.style.display = 'none';
});

// 스레드 신고 버튼 클릭 시
document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('report-button')) {
    const threadId = event.target.dataset.threadId;
    modal.style.display = 'flex'; // 모달 열기

    // 신고 내용 제출 버튼 클릭 시
    submitReportButton.addEventListener('click', async () => {
      const reportContent = reportInput.value;

      try {
        const response = await fetch(`/api/threads/${threadId}/report`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reportContent }),
        });

        if (response.ok) {
          console.log('Thread reported successfully');
        } else {
          console.error('Failed to report thread');
        }
      } catch (error) {
        console.error('Error reporting thread:', error);
      }

      modal.style.display = 'none'; // 모달 닫기
    });
  }
});
