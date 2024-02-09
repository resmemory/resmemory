import React, { useEffect, useState } from 'react';
import './Threads.css';

function Threads() {
  const [loginedUserId, setLoginedUserId] = useState(null);
  const [threads, setThreads] = useState([]);
  const [reportContent, setReportContent] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      await loginChecker();
      await viewThreads();
    }

    fetchData();
  }, []);

  const RandomThreadColors = () => {
    const colors = ['#F08080', '#FAFAD2', '#87CEEB', '#90EE90', '#87CEFA', '#7B68EE', '#FFC0CB'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

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

    alert(code[result.responseData.code]);
    location.reload();
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
    location.reload();
  }

  async function openReportModal(threadId) {
    setSelectedThreadId(threadId);
    setIsReportModalOpen(true);
  }

  function closeReportModal() {
    setSelectedThreadId(null);
    setReportContent('');
    setIsReportModalOpen(false);
  }

  async function submitReport() {
    await report(selectedThreadId, reportContent);
    closeReportModal();
  }

  async function report(contentId, reportContent) {
    const content = document.querySelector('#reportReason').value;
    const response = await fetch(`./api/reports`, {
      method: 'POST',
      headers: {
        Authorization: sessionStorage.getItem('Authorization'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, reportType: 'thread', contentId, reportContent }),
    });
    const result = await response.json();
    alert(code[result.responseData.code]);

    if (result.responseData.code === 0) {
      location.href = `./login`;
    } else {
      location.reload();
    }
  }

  return (
    <div>
      <div className="container">
        <h1>그땐 스레드</h1>
        <p>아무말 대잔치의 현장을 보고 계십니다.</p>
        <div className="writeThreadBox">
          <textarea
            className="writeThread"
            type="text"
            placeholder="내가 남긴 스레드는 무슨 색으로 전해질까요?"
          />

          <button className="writeThreadBtn" onClick={writeThread}>
            작성
          </button>
        </div>
        <div id="threadList">
          {threads.map((thread) => (
            <div
              className="thread"
              key={thread.threadId}
              style={{ backgroundColor: RandomThreadColors() }}
            >
              <h2>{thread.content}</h2>
              <p>
                {new Date(thread.createdAt).toLocaleString('ko-KR', {
                  timeZone: 'Asia/Seoul',
                })}
                {loginedUserId === thread.userId ? (
                  <>
                    <button className="delete-button" onClick={() => removeThread(thread.threadId)}>
                      삭제
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="report-button"
                      onClick={() => openReportModal(thread.threadId)}
                    >
                      신고
                    </button>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {isReportModalOpen && (
        <div className="report-modal">
          <div className="report-modal-content">
            <span className="close" onClick={closeReportModal}>
              &times;
            </span>
            <h2>신고 내용 입력</h2>
            <textarea
              id="reportReason"
              rows="4"
              cols="50"
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
              placeholder="신고 내용을 입력하세요."
            ></textarea>
            <button onClick={submitReport}>신고 제출</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Threads;
