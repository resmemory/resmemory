import React, { useEffect, useState } from 'react';
import DeleteButton from './DeleteButton.jsx';
import FilterReport from './FilterReport.jsx';
import ShowContent from './ShowContent.jsx';

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
  flexItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: '30px',
    marginLeft: '20px',
  },
  ContentBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
  },
};

function GetReport(props) {
  const [data, setData] = useState('');
  const [filteredData, setFilteredData] = useState('');

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
      console.log(error);
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
    <div style={style.container}>
      <FilterReport onFilterChange={handleFilterChange} />
      {filteredData.length > 0 ? (
        filteredData.map((item) => (
          <div style={style.TopContetn}>
            <div key={item.reportId} style={style.div}>
              <div>
                <div style={style.flexItem}>
                  <div style={{ width: '90%' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
                      <p>유형 : {item.reportType}</p>
                      <p>userId : {item.userId}</p>
                      <p>contentId : {item.contentId}</p>
                    </div>
                    <p>신고내용 : {item.content}</p>
                  </div>
                  <div style={{ width: '10%' }}>
                    <div style={{ marginTop: '10px' }}>
                      <DeleteButton data={item} />
                    </div>
                  </div>
                </div>
              </div>
              <div style={style.ContentBox}>
                <ShowContent data={item} />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>신고 내역이 없습니다.</div>
      )}
    </div>
  );
}

export default GetReport;
