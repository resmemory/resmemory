import React from 'react';
import ReportContainer from '../components/admin/ReportContainer.jsx';
import Header from '../components/main/header.jsx';
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
      <Header />
      <ReportContainer style={styles.ReportContainer} />
    </div>
  );
}

export default AdminPage;
