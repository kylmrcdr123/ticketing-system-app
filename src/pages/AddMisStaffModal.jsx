import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Axios from 'axios';
import '../styles/AddMisStaffModal.css';

const AddMisStaff = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username, email } = location.state || {}; // Receiving username and email from OTP verification

    const [misStaffData, setMisStaffData] = useState({
        firstName: '',
        lastName: '',
        contactNumber: '',
        address: '',
        middleName: '',
        birthdate: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMisStaffData({ ...misStaffData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
    
        const payload = {
            username,
            email,
            ...misStaffData
        };
    
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        
        if (!token) {
            setErrorMessage('You need to log in to access this page.');
            setIsSubmitting(false);
            return;
        }
    
        try {
            const response = await Axios.post('http://localhost:8080/user/register', payload, {
                headers: {
                    Authorization: `Bearer ${token}` // Include token in the Authorization header
                }
            });
            if (response.status === 200) {
                alert('Account registered successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000); 
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message || 'Failed to add MIS staff details. Please try again.');
            } else {
                setErrorMessage('Failed to add MIS staff details. Please try again.');
            }
            setIsSubmitting(false);
        }
    };
    

    return (
        <div className="add-mis-staff">
            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={misStaffData.firstName} onChange={handleChange} required />
                </div>

                <div className="input-box">
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={misStaffData.lastName} onChange={handleChange} required />
                </div>

                <div className="input-box">
                    <label>Contact Number:</label>
                    <input type="text" name="contactNumber" value={misStaffData.contactNumber} onChange={handleChange} required />
                </div>

                <div className="input-box">
                    <label>Address:</label>
                    <input type="text" name="address" value={misStaffData.address} onChange={handleChange} required />
                </div>

                <div className="input-box">
                    <label>Middle Name:</label>
                    <input type="text" name="middleName" value={misStaffData.middleName} onChange={handleChange} />
                </div>

                <div className="input-box">
                    <label>Birthdate:</label>
                    <input type="date" name="birthdate" value={misStaffData.birthdate} onChange={handleChange} required />
                </div>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Next'}
                </button>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </form>
        </div>
    );
};

export default AddMisStaff;
