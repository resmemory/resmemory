import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminPage from './AdminPage.jsx';
import ChatPage from './ChatPage.jsx';
import HomePage from './HomePage.jsx';
import LoginPage from './LoginPage.jsx';
import Login from './Login.jsx';
import MyPage from './MyPage.jsx';
import ThreadsPage from './ThreadsPage.jsx';
import WritePostPage from './WritePostPage.jsx';
import PostPage from './PostPage.jsx';
import HelloPage from './HelloPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/general_login" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/threads" element={<ThreadsPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/write" element={<WritePostPage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/signup" element={<HelloPage />} />
      </Routes>
    </Router>
  );
}

export default App;
