import React from 'react';
import ReportContainer from '../components/admin/ReportContainer.jsx';

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
  return (
    <div>
      <header style={styles.header}>
        <h1>관리자 페이지</h1>
      </header>
      <ReportContainer style={styles.ReportContainer} />
    </div>
  );
}

export default AdminPage;
