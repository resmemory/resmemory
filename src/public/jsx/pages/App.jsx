import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminPage from './AdminPage.jsx';
import ChatPage from './ChatPage.jsx';
import HomePage from './HomePage.jsx';
import LoginPage from './LoginPage.jsx';
import MyPage from './MyPage.jsx';
import ThreadsPage from './ThreadsPage.jsx';
import WritePostPage from './WritePostPage.jsx';
import PostPage from './PostPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/threads" element={<ThreadsPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/write" element={<WritePostPage />} />
        <Route path="/post" element={<PostPage />} />
      </Routes>
    </Router>
  );
}

export default App;
