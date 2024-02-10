import React from 'react';
import Header from '../components/main/header.jsx';
import Threads from '../components/threads/Threads.jsx';

import './ThreadsPage.css';

function ThreadsPage() {
  return (
    <>
      <Header />
      <div className="threads-page">
        <Threads />
      </div>
    </>
  );
}
export default ThreadsPage;
