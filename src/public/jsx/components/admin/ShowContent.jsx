import React, { useEffect, useState } from 'react';

const adminId = sessionStorage.getItem('Authorization');

function ShowContent(props) {
  const [data, setData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [threadData, setThreadData] = useState([]);

  const styles = {
    div: {
      border: '1px solid black',
    },
    DetailDiv: {
      width: '850px',
      minHeight: '10px',
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      padding: '10px 10px 10px 10px',
      marginBottom: '10px',
    },
  };

  const fetchData = async () => {
    if (props.data && props.data.isReport === 'false') {
      let requestUrl;
      const { reportType, contentId } = props.data;

      if (reportType === 'post' || reportType === 'comment') {
        requestUrl = `./api/${reportType}s?postId=${contentId}`;
      } else if (reportType === 'thread') {
        requestUrl = `./api/${reportType}s?threadId=${contentId}`;
      }

      try {
        const response = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: adminId,
          },
        });

        const result = await response.json();
        setData(result.responseData.result || []);
        setCommentData(result.responseData || []);
        setThreadData(result.responseData.result || []);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [props.data.contentId, props.data.reportType]);

  const renderContent = () => {
    switch (props.data.reportType) {
      case 'post':
        return ['nickname', 'title', 'content'].map((key) => (
          <div key={key}>
            <p>
              {key === 'nickname' ? '닉네임' : key === 'title' ? '제목' : '내용'}: {data[key]}
            </p>
          </div>
        ));
      case 'comment':
        return commentData.map((item, idx) => (
          <div key={idx}>
            <p>닉네임: {item.nickname}</p>
            <p>내용: {item.content}</p>
          </div>
        ));
      case 'thread':
        return threadData.map((item, idx) => (
          <div key={idx}>
            <p>내용: {item.content}</p>
          </div>
        ));
      default:
        return <div>삭제된 컨텐츠 입니다.</div>;
    }
  };

  return (
    <div style={styles.div}>
      상세내용
      <div style={styles.DetailDiv}>{renderContent()}</div>
    </div>
  );
}

export default ShowContent;
