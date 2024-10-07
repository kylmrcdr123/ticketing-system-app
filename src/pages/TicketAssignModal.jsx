import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TicketAssignModal.css';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import profile from '../assets/profile.png';
import logo from '../assets/loge_new 2.png';
import NavList from '../components/NavList'; // Import NavList component

const TicketAssignModal = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Handle token and redirect if missing or expired
  useEffect(() => {
    const token = localStorage.getItem('token');
    const exp = localStorage.getItem('exp');

    if (!token || !exp || Date.now() >= exp * 1000) {
      console.log('Token is missing or expired. Redirecting to login...');
      localStorage.clear();
      navigate('/login');
    }
  }, [navigate]);

  // Load users from tickets
  const loadUsersFromTickets = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('http://localhost:8080/TicketService/tickets', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      const tickets = response.data;
      console.log('Tickets fetched:', tickets);

      const userSet = new Map();

      tickets.forEach(ticket => {
        // Process Employee Reporter
        if (ticket.employee) {
          const employee = { ...ticket.employee, reporterType: "Employee" };
          userSet.set(employee.email, employee);
        }

        // Process Student Reporter
        if (ticket.student) {
          const student = { ...ticket.student, reporterType: "Student" };
          userSet.set(student.email, student);
        }
      });

      const loadedUsers = Array.from(userSet.values());
      setUsers(loadedUsers);
      console.log('Users loaded:', loadedUsers);
    } catch (error) {
      console.error('Error fetching users from tickets:', error);
      setError(`Failed to load users: ${error.response?.data?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    loadUsersFromTickets();
  }, []);

  const employees = users.filter(user => user.reporterType === "Employee");
  const students = users.filter(user => user.reporterType === "Student");

  return (
    <div className="ticket-assign">
      <NavList handleLogout={handleLogout} />
      <div className="container">
        <h2 className="user-list-title">User List</h2>
        <div className="user-list">
          {loading && <p>Loading users...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && users.length === 0 && <p>No users found.</p>}

          {!loading && !error && (
            <>
              <h3>Employees</h3>
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact Number</th>
                    <th>Address</th>
                    <th>Date Created</th>
                    <th>Birthdate</th>
                    <th>Employee Number</th>
                    <th>Reporter Type</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(user => (
                    <tr key={user.email}>
                      <td>{user.firstName} {user.lastName} {user.middleName ? `(${user.middleName})` : ''}</td>
                      <td>{user.email}</td>
                      <td>{user.contactNumber || 'N/A'}</td>
                      <td>{user.address || 'N/A'}</td>
                      <td>{user.dateCreated ? new Date(user.dateCreated).toLocaleDateString() : 'N/A'}</td>
                      <td>{user.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'N/A'}</td>
                      <td>{user.employeeNumber || 'N/A'}</td>
                      <td>{user.reporterType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>Students</h3>
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact Number</th>
                    <th>Address</th>
                    <th>Date Created</th>
                    <th>Birthdate</th>
                    <th>Student Number</th>
                    <th>Reporter Type</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(user => (
                    <tr key={user.email}>
                      <td>{user.firstName} {user.lastName} {user.middleName ? `(${user.middleName})` : ''}</td>
                      <td>{user.email}</td>
                      <td>{user.contactNumber || 'N/A'}</td>
                      <td>{user.address || 'N/A'}</td>
                      <td>{user.dateCreated ? new Date(user.dateCreated).toLocaleDateString() : 'N/A'}</td>
                      <td>{user.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'N/A'}</td>
                      <td>{user.studentNumber || 'N/A'}</td>
                      <td>{user.reporterType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketAssignModal;
