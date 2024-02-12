import React, { useEffect } from 'react';
import Header from '../components/main/header.jsx';
import { useNavigate } from 'react-router-dom';
import GetReport from '../components/admin/GetReport.jsx';

import './AdminPage.css';

function AdminPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./api/users', {
          method: 'GET',
          headers: {
            Authorization: sessionStorage.getItem('Authorization'),
          },
        });

        if (!response.ok) {
          console.error('서버로부터 데이터를 가져오는 중 에러가 발생했습니다.');
          return;
        }

        const result = await response.json();

        if (result.responseData.bodies.userId !== 1) {
          navigate('/');
        }
      } catch (error) {
        console.error('데이터를 가져오는 중 에러가 발생했습니다.', error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <Header />
      <div className="admin-page">
        <div>
          <GetReport />
        </div>
      </div>
    </>
  );
}

export default AdminPage;
