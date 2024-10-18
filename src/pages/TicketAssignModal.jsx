import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TicketAssignModal.css';
import { useNavigate } from 'react-router-dom';
import NavList from '../components/NavList';

const TicketAssignModal = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const debugMode = false;

    useEffect(() => {
        const token = localStorage.getItem('token');
        const exp = localStorage.getItem('exp');
        const role = localStorage.getItem('role'); 

        if (!token || !exp || Date.now() >= exp * 1000 || role !== "ROLE_ROLE_ADMIN") {
            console.log('User is not authorized or token is missing/expired. Redirecting to login...');
            localStorage.clear();
            navigate('/login');
        }
    }, [navigate]);

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
    
            const employeeUsers = new Map();
            const studentUsers = new Map();
            
            tickets.forEach(ticket => {
                console.log('Inspecting ticket:', ticket);
    
                if (ticket.employees) {
                    const employeeData = { ...ticket.employees, reporterType: "Employee" };
                    // Use employeeNumber as the unique identifier
                    employeeUsers.set(employeeData.employeeNumber, employeeData);
                    console.log('Adding employee:', employeeData);
                }
    
                if (ticket.students) {
                    const studentData = { ...ticket.students, reporterType: "Student" };
                    // Use studentNumber as the unique identifier
                    studentUsers.set(studentData.studentNumber, studentData);
                    console.log('Adding student:', studentData);
                }
            });
    
            // Convert Maps to arrays and set state
            setEmployees(Array.from(employeeUsers.values()));
            setStudents(Array.from(studentUsers.values()));
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

    return (
        <div className="semi-body">
        <div className="ticket-assign">
            <NavList handleLogout={handleLogout} />
                <h2 className="user-list-title">User List</h2>
                <div className="user-list">
                    {loading && <p>Loading users...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && employees.length === 0 && students.length === 0 && <p>No users found.</p>}

                    {!loading && !error && (
                        <>
                            <div className="list-container">
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
                                            <tr key={`${user.email}-Employee`}>
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
                            </div>

                            <div className="list-container">
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
                                            <tr key={`${user.email}-Student`}>
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
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>

    );
};

export default TicketAssignModal;
