import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "../styles/variable.css";
import "../styles/main.css";
import "../styles/template.css";
import "../styles/keyframe.css";

import { HomePage } from "./Home.jsx";

// 최상위 컴포넌트
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={HomePage}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;