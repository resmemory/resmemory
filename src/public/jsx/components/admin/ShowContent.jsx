import React, { useEffect, useState } from 'react';

const adminId = sessionStorage.getItem('Authorization');
function ShowContent(props) {
  const [data, setData] = useState([]);
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
    console.log(props.data.reportType + 's');
    let RequestURL;
    if (props.data.reportType === 'post') {
      RequestURL = `/api/${props.data.reportType}s?postId=${props.data.contentId}`;
    } else if (props.data.reportType === 'comment') {
      RequestURL = `./api/${props.data.reportType}s?postId=${postId}`;
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
      console.log(result.responseData, 'aaaaa');
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log('히히 출력!');
  }, [props.data.contentId, props.data.reportType]);

  return (
    <div>
      상세내용
      <div style={styles.div}>
        {['nickname', 'title', 'content'].map((key) => {
          if (key === 'nickname' || key === 'title' || key === 'content') {
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
          }
        })}
      </div>
    </div>
  );
}

export default ShowContent;
