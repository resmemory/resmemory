import React, { useEffect, useState } from 'react';

const adminId = sessionStorage.getItem('Authorization');
function ShowContent(props) {
  const [data, setData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [treadData, setTreadData] = useState([]);

  const styles = {
    div: {
      width: '900px',
      minHeight: '100px',
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.06)',
      padding: '10px 10px 10px 10px',
      marginBottom: '10px',
    },
  };
  const fetchData = async () => {
    console.log(props.data.reportType);
    if (props.data.isReport === 'false') {
      let RequestURL;
      if (props.data.reportType === 'thread') {
        RequestURL = `/api/${props.data.reportType}s?threadId=${props.data.contentId}`;
      }
      try {
        const response = await fetch(RequestURL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: adminId,
          },
        });

        const result = await response.json();
        const data = result.responseData.result;
        const commentData = result.responseData;
        console.log(result.responseData, 'aaaaa');
        console.log(commentData);
        setData(data);
        setCommentData(commentData);
        setTreadData(treadData);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [props.data.contentId, props.data.reportType]);

  return (
    <div>
      상세내용
      <div style={styles.div}>
        {props.data.reportType === 'post' ? (
          ['nickname', 'title', 'content'].map((key) => {
            let mappedKey = key;

            // 특정 키 이름을 변경하거나 매핑하는 조건을 추가
            if (key === 'title') {
              mappedKey = '제목';
            } else if (key === 'content') {
              mappedKey = '내용';
            } else if (key === 'nickname') {
              mappedKey = '닉네임';
            }

            return (
              <div key={key}>
                <p>
                  {mappedKey}: {data[key]}
                </p>
              </div>
            );
          })
        ) : props.data.reportType === 'comment' ? (
          commentData.map((item, idx) => {
            return (
              <div key={idx}>
                <p>닉네임 : {item.nickname}</p>
                <p>내용 : {item.content}</p>
              </div>
            );
          })
        ) : props.data.reportType === 'thread' ? (
          treadData.map((item) => {
            <div></div>;
          })
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
export default ShowContent;
