import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { TwitterProvider } from './Context/tweetcontext.jsx';
import { UserProvider } from './Context/UserContext.jsx';
import { ProfileProvider } from './Context/ProfileContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <ProfileProvider>
        <TwitterProvider>
          <Router>
            <App />
            <ToastContainer />
          </Router>
        </TwitterProvider>
      </ProfileProvider>
    </UserProvider>
  </React.StrictMode>
);

