import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../src/config';
import img1 from '../assets/banner.avif';
import { toast } from "react-toastify";


function Signup() {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signup = (event) => {
    event.preventDefault();
    setLoading(true);
    const requestData = { name: name, username: userName, email: email, password: password };

    axios.post(`${API_BASE_URL}/api/signup`, requestData)
      .then((result) => {
        if (result.status === 201) {
          setLoading(false);
          setName('');
          setEmail('');
          setPassword('');
          setUserName('');

          navigate('/');
          toast.success('User signed up successfully');
        } else {
          setLoading(false);
          toast.error('Signup failed. Please try again.');
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error('Signup failed. Please try again.');
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card card-container s">
        <div className="row no-gutters">
          <div className="row no-gutters d-flex justify-content-center align-items-center">
            <div className="col-md-5 card-img-col">
              <img src={img1} className="img-fluid login-img" alt="Image" />

            </div>
            <div className="col-md-7 card-content-col">
              <form onSubmit={(event) => signup(event)}>
                <div className="card-body">
                  <h2 className="card-title mb-4">Register</h2>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Enter full name here"
                      value={name}
                      onChange={(ev) => setName(ev.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(ev) => setEmail(ev.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Enter username"
                      value={userName}
                      onChange={(ev) => setUserName(ev.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      value={password}
                      onChange={(ev) => setPassword(ev.target.value)}
                    />
                  </div>
                  <button
                    type='submit'
                    className='btn btn-dark mb-3'
                    disabled={loading}
                  >
                    {loading ? (
                      <span>Loading...</span>
                    ) : (
                      <span>Register</span>
                    )}
                  </button>
                  <p>Already Registered? <Link to="/">Login Here</Link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Signup;
