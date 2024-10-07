import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/loge_new 2.png'; // Make sure you adjust the path to your logo
import user from '../assets/profile.png'; // Make sure you adjust the path to your profile picture
import '../styles/NavList.css'; // Corrected import path

const NavList = ({ handleLogout }) => {
  return (
    <div className="nav-list">
      <nav className="nav-bar">
        <img src={logo} alt="Logo" className="rc-logo" />
        <div className="nav-links">
          <Link to="/staff/tickets">Ticket Board</Link>
          <Link to="/staff/list">Ticket List </Link>
          <Link to="/staff/assign">Users</Link>
          <a href="#" onMouseDown={handleLogout}>Logout</a>
          </div>
        <img src={user} alt="profile" className="profile" />
      </nav>
    </div>
  );
};

export default NavList;
