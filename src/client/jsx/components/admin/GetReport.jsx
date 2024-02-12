import React, { useEffect, useState } from 'react';
import DeleteButton from './DeleteButton.jsx';
import FilterReport from './FilterReport.jsx';
import ShowContent from './ShowContent.jsx';

import './GetReport.css';

const adminId = sessionStorage.getItem('Authorization');

function GetReport(props) {
  const [data, setData] = useState('');
  const [filteredData, setFilteredData] = useState('');
  const [login, setlogin] = useState(null);

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
      setData(data);
      setFilteredData(data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (filter) => {
    if (filter === 'all') {
      setFilteredData(data);
    } else if (filter === 'incomplete') {
      const incompleteData = data.filter((item) => item.isReport === 'false');

      setFilteredData(incompleteData);
    } else if (filter === 'complete') {
      const completeData = data.filter((item) => item.isReport === 'true');
      setFilteredData(completeData);
    }
  };

  return (
    <>
      {adminId ? (
        <>
          <FilterReport onFilterChange={handleFilterChange} />
          {filteredData && filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div className="report" key={item.reportId}>
                <div>
                  <div>
                    <label>신고 회원</label> <p>{item.userId}</p>
                  </div>
                  <div>
                    <label>신고 유형</label> <p> {item.reportType}</p>
                  </div>
                  <div>
                    <label>고유 번호</label> <p> {item.contentId}</p>
                  </div>
                  <div>
                    <label>신고 내용</label>
                    <p> {item.content}</p>
                  </div>
                  <div id="delete-button">
                    <DeleteButton data={item} />
                  </div>
                </div>
                <div>
                  <ShowContent data={item} />
                </div>
              </div>
            ))
          ) : (
            <div className="no-reports">신고 내역이 없습니다.</div>
          )}
        </>
      ) : (
        <div>
          <div>로그인이 필요합니다.</div>
          {alert('세션이 만료되어 로그인페이지로 이동합니다.')}
          {(window.location.href = '/login')}
        </div>
      )}
    </>
  );
}

export default GetReport;
