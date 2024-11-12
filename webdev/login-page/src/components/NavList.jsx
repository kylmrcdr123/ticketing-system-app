import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/loge_new 2.png';
import user from '../assets/profile.png';
import '../styles/NavList.css';

const NavList = ({ handleLogout }) => {
  return (
    <div className="nav-list">
      <nav className="nav-bar">
        <img src={logo} alt="Logo" className="rc-logo" />
        <div className="nav-links">
          <Link to="/admin/board">Ticket Board</Link>
          <Link to="/admin/list">Ticket List</Link>
          <Link to="/staff/assign">Users</Link>
          <Link to="/login" onClick={handleLogout} className="logout-text">
            Logout
          </Link>
        </div>
        <img src={user} alt="profile" className="profile" />
      </nav>
    </div>
  );
};

export default NavList;
