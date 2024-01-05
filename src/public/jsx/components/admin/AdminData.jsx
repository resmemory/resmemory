import React, { useEffect, useState } from 'react';
import DeleteButton from './DeleteButton.jsx';

const style = {
  div: {
    width: '100%',
    height: '500px',
    backgroundColor: 'rgb(50,0,0)',
  },
};

function GetReport(props) {
  // const [isReport, setIsReport] = useState(false);
  // const { reportId, content, userId, reportType, contentId } = props;

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/reports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      const data = result.responseData.result;
      console.log(result, 'datadatadatadatadata');
      if (!data && data == undefined) {
        return <div>신고 내역이 없습니다.</div>;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  });

  const handleDelete = () => {
    // 삭제 버튼이 클릭되었을 때 수행할 작업
    console.log('Delete button clicked!');
  };

  return (
    <div style={style.div}>
      <DeleteButton onClick={handleDelete}></DeleteButton>
    </div>
  );
}

export default GetReport;
