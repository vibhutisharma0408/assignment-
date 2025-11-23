// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div>
        {/* You can add a header or navbar here if needed */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Future routes can be added here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
