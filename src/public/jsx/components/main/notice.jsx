import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './Notice.css';

const Notice = () => {
  const [noticeData, setNoticeData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchNotice();
  }, []);
  const fetchNotice = async () => {
    try {
      const response = await fetch('/api/notice', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setNoticeData(result.responseData.result);
      } else {
        throw new Error('공지를 가져오지 못했습니다.');
      }
    } catch (error) {
      console.error('공지를 불러오는 중 오류가 발생했습니다:', error);
    }
  };

  const handleNoticeClick = () => {
    navigate(`/post`, { state: { postId: noticeData.postId } });
  };
  return (
    <>
      {noticeData ? (
        <div onClick={handleNoticeClick} className="notice">
          <h1>공지 ! {noticeData.title}</h1>
          <p>
            {new Date(noticeData.createdAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Notice;
