import React, { useEffect, useState } from 'react';

function ThreadsPage() {
  const [loginedUserId, setLoginedUserId] = useState(null);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await loginChecker();
      await viewThreads();
      buttons();
    }

    fetchData();
  }, []);

  async function loginChecker() {
    if (sessionStorage.getItem('Authorization')) {
      const profileresponse = await fetch(`./api/users`, {
        method: 'GET',
        headers: {
          Authorization: sessionStorage.getItem('Authorization'),
        },
      });
      const profileresult = await profileresponse.json();
      setLoginedUserId(profileresult.responseData.bodies.userId);
    }
  }

  async function viewThreads() {
    const response = await fetch('/api/threads', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    if (data.responseData.result) {
      setThreads(data.responseData.result);
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

    if (result.responseData.code === 731) {
      alert(code[result.responseData.code]);
      location.reload();
    } else {
      alert(code[result.responseData.code]);
      if (result.responseData.code === 0) {
        location.href = `./login`;
      }
    }
  }

  function openReportModal(threadId) {
    const reportModal = document.getElementById(`reportModal_${threadId}`);
    reportModal.style.display = 'block';
  }

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

  const buttons = () => {
    const login = document.querySelector('.login');
    const logout = document.querySelector('.logout');
    const mypage = document.querySelector('.mypage');

    const chat = document.querySelector('.chat_btn');

    if (sessionStorage.getItem('Authorization')) {
      logout.style.display = 'block';
      mypage.style.display = 'block';
      chat.style.display = 'block';
    } else {
      login.style.display = 'block';
    }
  };

  return (
    <div>
      <div className="container">
        <div className="writeThreadBox">
          <input
            className="writeThread"
            type="text"
            placeholder="예쁜말 고운 말을 사용해 주세요!"
          />
          <div>
            <button className="writeThreadBtn" onClick={writeThread}>
              작성
            </button>
          </div>
        </div>
        <div id="threadList">
          {threads.map((thread) => (
            <div className="thread" key={thread.threadId}>
              <h2>{thread.content}</h2>
              <p>
                {new Date(thread.createdAt).toLocaleString('ko-KR', {
                  timeZone: 'Asia/Seoul',
                })}
                {loginedUserId === thread.userId ? (
                  <button className="delete-button" onClick={() => removeThread(thread.threadId)}>
                    삭제
                  </button>
                ) : (
                  <button
                    className="report-button"
                    onClick={() => openReportModal(thread.threadId)}
                  >
                    신고
                  </button>
                )}
                <div id={`reportModal_${thread.threadId}`} className="modal">
                  {/* The rest of your modal content */}
                </div>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ThreadsPage;
