import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Login.css';
import axios from 'axios';
import { API_BASE_URL } from '../../src/config';
import img1 from '../assets/banner.avif';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../Context/UserContext.jsx';

function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    }
  }, [dispatch]);

  const login = (event) => {
    event.preventDefault();
    setLoading(true);
    const requestData = { username: userName, password: password };
    axios.post(`${API_BASE_URL}/api/login`, requestData)
      .then((result) => {
        if (result.status === 200) {
          setLoading(false);
          const user = result.data.result.user;
          localStorage.setItem("token", result.data.result.token);
          localStorage.setItem('user', JSON.stringify(user));
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
          navigate('/home');
          toast.success('Login success');
          setPassword('');
          setUserName('');
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error('Login failed. Please try again.');
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card card-container">
        <div className="row no-gutters">
          <div className="col-md-5 card-img-col">
            <div className="login-img-container">
              <img src={img1} className="login-img" alt="Login Logo" />
              <div className="welcome-text">welcome to our app.</div>
            </div>
          </div>
          <div className="col-md-7 card-content-col">
            <form onSubmit={login}>
              <div className="card-body">
                <h2 className="card-title mb-4">Login</h2>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Enter username"
                    onChange={(e) => setUserName(e.target.value)}
                    value={userName}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
                <button type='submit' className='btn btn-dark mb-3' disabled={loading}>
                  {loading ? (
                    <span>Loading...</span>
                  ) : (
                    <span>Login</span>
                  )}
                </button>
                <p>Not Registered? <Link to="/signup">Register Here</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
