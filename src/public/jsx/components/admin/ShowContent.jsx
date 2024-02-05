import React, { useEffect, useState } from 'react';

const adminId = sessionStorage.getItem('Authorization');

function ShowContent(props) {
  const [data, setData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [threadData, setThreadData] = useState([]);

  const styles = {
    div: {
      border: 'none',
    },
    DetailDiv: {
      backgroundColor: 'aliceblue',
      borderRadius: '12px',
      width: '850px',
      minHeight: '10px',
      padding: '10px 10px 10px 10px',
      marginBottom: '10px',
    },
  };

  const fetchData = async () => {
    if (props.data && props.data.isReport === 'false') {
      let requestUrl;
      const { reportType, contentId } = props.data;

      if (reportType === 'post') {
        const postId = contentId;
        requestUrl = `./api/${reportType}s?postId=${postId}`;
      } else if (reportType === 'comment') {
        const commentId = contentId;
        requestUrl = `./api/${reportType}s?commentId=${commentId}`;
      } else if (reportType === 'thread') {
        const threadId = contentId;
        requestUrl = `./api/${reportType}s?threadId=${threadId}`;
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
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [props.data.contentId, props.data.reportType]);

  const renderContent = () => {
    if (props.data.isReport === 'true') {
      return <div>삭제된 컨텐츠 입니다.</div>;
    }
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
        return (
          <div>
            <p>내용: {commentData.content}</p>
          </div>
        );
      case 'thread':
        return (
          <div>
            <p>내용: {threadData.content}</p>
          </div>
        );
    }
  };

  return (
    <div style={styles.div}>
      <div style={styles.DetailDiv}>{renderContent()}</div>
    </div>
  );
}

export default ShowContent;
