import React, { useEffect, useState } from 'react';
import DeleteButton from './DeleteButton.jsx';

const adminId = sessionStorage.getItem('Authorization');

const style = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  div: {
    width: '952px',
    minHeight: '100px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.06)',
    padding: '10px 10px 10px 10px',
    marginBottom: '10px',
  },
};

function GetReport(props) {
  const [data, setData] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/reports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: adminId,
        },
      });

      const result = await response.json();
      const data = result.responseData.result;
      console.log(data, 'datadatadatadatadata');
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={style.container}>
      {data.length > 0 ? (
        data.map((item) => (
          <div key={item.reportId} style={style.div}>
            <p>신고내용 : {item.content}</p>
            <p>reportType : {item.reportType}</p>
            <p>userId : {item.userId}</p>
            <p>contentId : {item.contentId}</p>
            <DeleteButton data={item} />
          </div>
        ))
      ) : (
        <div>신고 내역이 없습니다.</div>
      )}
    </div>
  );
}

export default GetReport;
