import React, { useState, useEffect } from 'react';

const Notice = () => {
  const [noticeData, setNoticeData] = useState(null);

  useEffect(() => {
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

    fetchNotice();
  }, []);

  return (
    <div>
      {noticeData ? (
        <div>
          <h2>⭐⭐⭐공지⭐⭐⭐ {noticeData.title}</h2>
          {/* <p>{noticeData.content}</p> */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Notice;
