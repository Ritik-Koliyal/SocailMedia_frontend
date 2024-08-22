import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Components/Sidebar.jsx';
import Home from './Components/Home.jsx';
import Profile from './Components/Profile.jsx';
import Login from './Components/Login.jsx';
import Signup from './Components/Signup.jsx';
import TweetDetails from './Components/TweetDetails.jsx';
import RepliesPage from './Components/RepliesPage.jsx';

import { UserContext } from './Context/UserContext.jsx'; // Import UserContext

function App() {
  const { dispatch } = useContext(UserContext); // Use context
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      dispatch({ type: "LOGIN_SUCCESS", payload: userData });
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem("user");
      dispatch({ type: "LOGIN_ERROR" });
      if (location.pathname !== '/' && location.pathname !== '/signup') {
        navigate('/');
      }
    }
  }, [dispatch, navigate, location.pathname]);

  return (
    <AppContent />
  );
}

function AppContent() {
  const location = useLocation();
  const hideSidebar = location.pathname === '/' || location.pathname === '/signup';

  return (
    <div className="app-container">
      {!hideSidebar && <Sidebar />}
      <div className="content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/tweets/:tweetId" element={<TweetDetails />} />
          <Route path="/replies/:tweetId/:commentId" element={<RepliesPage />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
