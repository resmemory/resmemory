import React, { useEffect, useState } from 'react';
import './Threads.css';
import Warn from '../svg/Warn.jsx';

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
    const colors = [
      '#F0808033',
      '#FAFAD233',
      '#87CEEB33',
      '#90EE9033',
      '#87CEFA33',
      '#7B68EE33',
      '#FFC0CB33',
    ];
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
    const content = document.querySelector('#write-thread').value;
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
      <h1>그땐 스레드</h1>
      <p>아무말 대잔치의 현장을 보고 계십니다.</p>
      <div className="write-thread-box">
        <textarea id="write-thread" type="text" placeholder="당신을 어떤 색으로 만날까요?" />

        <button onClick={writeThread}>작성</button>
      </div>
      <div id="threadList">
        {threads.map((thread) => (
          <div
            className="thread"
            key={thread.threadId}
            style={{ background: RandomThreadColors() }}
          >
            <h4>{thread.content}</h4>
            <div className="threads-buttons">
              <p>
                {new Date(thread.createdAt).toLocaleString('ko-KR', {
                  timeZone: 'Asia/Seoul',
                })}
              </p>
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
                    <Warn />
                    신고
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {isReportModalOpen && (
        <div className="report-modal">
          <div className="report-modal-content">
            <h3>신고 내용</h3>
            <textarea
              rows="4"
              cols="50"
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
            ></textarea>
            <div className="thread-report-buttons">
              <button onClick={submitReport}>신고</button>
              <button id="close" onClick={closeReportModal}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Threads;
