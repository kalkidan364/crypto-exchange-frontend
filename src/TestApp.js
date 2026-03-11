import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Markets from './pages/Markets';

function TestApp() {
  return (
    <Router>
      <div>
        <h1>Test App</h1>
        <Routes>
          <Route path="/markets" element={<Markets />} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default TestApp;