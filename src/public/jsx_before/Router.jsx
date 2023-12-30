import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginMain from './LoginMain';
import LoginInput from './LoginInput';
import signup from './signup.jsx';

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        {/* 로그인 페이지 */}
        <Route path="/login" component={LoginMain} />

        {/* 로그인 폼 페이지 */}
        <Route path="/loginInput" component={LoginInput} />

        {/* 회원가입 페이지 */}
        <Route path="/signup" component={signup} />

        {/* 기본 경로 설정 (예: 홈페이지로 리다이렉트하거나 404 페이지 등) */}
        <Route path="/" exact component={test.jsx} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
