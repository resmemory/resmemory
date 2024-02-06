import React, { useEffect } from 'react';
import ReportContainer from '../components/admin/ReportContainer.jsx';
import Header from '../components/main/header.jsx';
import { useNavigate } from 'react-router-dom';

const styles = {
  header: {
    width: '100%',
    height: '200px',
  },
  ReportContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
};

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
    <div>
      <Header />
      <ReportContainer style={styles.ReportContainer} />
    </div>
  );
}

export default AdminPage;
