import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

function Sidebar() {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  let userId = null;

  if (localStorage.getItem('user')) {
    var loguser = JSON.parse(localStorage.getItem('user'));
    userId = loguser ? loguser.id : null;
  }
  const { user } = state;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <div className="d-flex justify-content-center ">
      <nav className="col-md-6 col-sm-12  navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <i className="fa-solid fa-dove fs-4"></i>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/home" className="nav-link">
                  <i className="fa-solid fa-house"></i> Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to={`/profile/${userId}`} className="nav-link">
                  <i className="fa-solid fa-user"></i> Profile
                </Link>
              </li>
            </ul>
            <div className="dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">

                <strong>{user ? user.username : 'Guest'}</strong>
              </a>
              <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
                <li><Link to={`/profile/${userId}`} className="dropdown-item">Profile</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#" onClick={logout}>Sign out</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
