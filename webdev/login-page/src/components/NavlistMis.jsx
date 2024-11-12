import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/loge_new 2.png';
import user from '../assets/profile.png';
import '../styles/NavlistMis.css';

const NavlistMis = ({ handleLogout }) => {
  const navigate = useNavigate();

  const handleLogoutAndRedirect = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <div className="nav-list">
      <nav className="nav-bar">
        <img src={logo} alt="Logo" className="rc-logo" />

        <div className="nav-right">
          <div className="nav-links">
            <Link to="/staff/tickets">Ticket Board</Link>
            <Link to="/staff/list">Ticket List</Link>
            <Link to="/login" onClick={handleLogoutAndRedirect} className="logout-text">
              Logout
            </Link>
          </div>

          <div className="profile-container">
            <img src={user} alt="profile" className="profile" />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavlistMis;
