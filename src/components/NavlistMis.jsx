import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/loge_new 2.png';
import user from '../assets/profile.png';
import '../styles/NavlistMis.css';

const NavlistMis = ({ handleLogout }) => {
  return (
    <div className="nav-list">
      <nav className="nav-bar">
        <img src={logo} alt="Logo" className="rc-logo" />
        <div className="nav-links">
          <Link to="/staff/tickets">Ticket Board</Link>
          <Link to="/staff/list">Ticket List</Link>
        </div>
        <img src={user} alt="profile" className="profile" onClick={handleLogout} />
      </nav>
    </div>
  );
};

export default NavlistMis;
