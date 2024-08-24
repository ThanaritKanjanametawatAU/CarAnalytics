import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';

import DashboardPage from './pages/DashboardPage';
import HighlightedCarsPage from './pages/HighlightedCarsPage';
import BrowseCarsPage from './pages/BrowseCarsPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<DashboardPage />} />
          <Route path="highlighted-cars" element={<HighlightedCarsPage />} />
            <Route path="browse-cars" element={<BrowseCarsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
