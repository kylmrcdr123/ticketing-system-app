import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import '../styles/OTP.css';
import logo from '../assets/loge_new 2.png';

const OtpForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        otp: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); 
        try {
            const payload = {
                username: formData.username,
                otp: formData.otp
            };
            const response = await Axios.post('http://localhost:8080/user/verify-otp', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            if (response.status === 200) {
                setMessage('OTP verified successfully!');
                setTimeout(() => {
                    navigate('/login'); 
                }, 2000);
            } else if (response && response.data) {
                alert(response.data);
                setIsSubmitting(false);  
            } else {
                console.error('Response data is undefined:', response);
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setIsSubmitting(false); 
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('An error occurred while processing your request.');
            }
        }
    };

    return (
        <div className="form-box-otp">
                <div className="header">
                    <div className="logo">
                        <img src={logo} alt="Logo" id="logo"/>
                    </div>
                    <h1>Verify OTP</h1>
                </div>
            <form onSubmit={handleSubmit}  className="form-container">
                <div className="input-box">
                    <label>Username:</label>
                    <input 
                        type="text" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        disabled={isSubmitting}
                    />
                </div>
                <div className="input-box">
                    <label>Enter OTP:</label>
                    <input 
                        type="text" 
                        name="otp" 
                        value={formData.otp} 
                        onChange={handleChange} 
                        disabled={isSubmitting}
                    />
                </div>
                <button type="submit" disabled={isSubmitting || formData.otp.length === 0 || formData.username.length === 0}>
                    {isSubmitting ? 'Submitting...' : 'Verify OTP'}
                </button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default OtpForm;
