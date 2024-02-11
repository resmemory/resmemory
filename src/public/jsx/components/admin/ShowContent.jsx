import React, { useEffect, useState } from 'react';

import './ShowContent.css';

const adminId = sessionStorage.getItem('Authorization');

function ShowContent(props) {
  const [data, setData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [threadData, setThreadData] = useState([]);

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
      } catch (error) {}
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
            <label>{key === 'nickname' ? '회원' : key === 'title' ? '제목' : '내용'}</label>
            <p>{data[key]}</p>
          </div>
        ));
      case 'comment':
        return (
          <div>
            <label>내용</label>
            <p> {commentData.content}</p>
          </div>
        );
      case 'thread':
        return (
          <div>
            <label>내용</label>
            <p> {threadData.content}</p>
          </div>
        );
    }
  };

  return (
    <div className="report-content">
      <div>{renderContent()}</div>
    </div>
  );
}

export default ShowContent;
