import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import '../styles/CreateAccount.css';
import { TbEyeClosed, TbEyeUp } from "react-icons/tb";
import logo from '../assets/loge_new 2.png';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        misStaffNumber: '',
        firstName: '',
        middleName: '',
        lastName: '',
        contactNumber: '',
        address: '',
        birthdate: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        if (name === 'misStaffNumber') {
            if (!/^\d{8}$/.test(value)) {
                setErrorMessage('Invalid MIS Staff Number');
            } else {
                setErrorMessage('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);

         // Validate name fields (no numbers allowed, and accept "ñ" and "Ñ")
    const namePattern = /^[A-Za-zÑñ\s]+$/;
    if (!namePattern.test(formData.firstName)) {
        setErrorMessage('Invalid First Name (no numbers or special characters allowed)');
        setIsSubmitting(false);
        return;
    }
    if (formData.middleName && !namePattern.test(formData.middleName)) {
        setErrorMessage('Invalid Middle Name (no numbers or special characters allowed)');
        setIsSubmitting(false);
        return;
    }
    if (!namePattern.test(formData.lastName)) {
        setErrorMessage('Invalid Last Name (no numbers or special characters allowed)');
        setIsSubmitting(false);
        return;
    }

    // Validate address (only letters, spaces, and "ñ" allowed)
    if (!namePattern.test(formData.address)) {
        setErrorMessage('Invalid Address (no numbers or special characters allowed)');
        setIsSubmitting(false);
        return;
    }

    
        // Username validation: must contain at least one special character and allow "ñ" and "Ñ"
    const usernamePattern = /^(?=.*[._@#&$%!*+=-])[a-zA-Z0-9Ññ._@#&$%!*+=-]+$/;
    if (!usernamePattern.test(formData.username)) {
        setErrorMessage('Username must contain at least one special character and no spaces.');
        setIsSubmitting(false);
        return;
    }
        // Password validation: at least 8 characters, at least one special character, and allow "ñ" and "Ñ"
    const passwordPattern = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9Ññ!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordPattern.test(formData.password)) {
        setErrorMessage('Password must be at least 8 characters long and contain at least one special character.');
        setIsSubmitting(false);
        return;
    }
          // Email validation to ensure it has "@" and a valid structure
    const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailPattern.test(formData.email)) {
        setErrorMessage('Please enter a valid email address.');
        setIsSubmitting(false);
        return;
    }

        if (!/^\d{8}$/.test(formData.misStaffNumber)) {
            setErrorMessage('Invalid MIS Staff Number');
            setIsSubmitting(false);
            return;
        }
    
        // Birthdate validation - ensure the year does not exceed 2024
        const birthYear = new Date(formData.birthdate).getFullYear();
        if (birthYear > 2023) {
            setErrorMessage('Invalid birthdate. Please try again.');
            setIsSubmitting(false);
            return;
        }
     // Contact number validation to ensure it is exactly 11 digits
     if (!/^\d{11}$/.test(formData.contactNumber)) {
        setErrorMessage('Contact Number must be exactly 11 digits.');
        setIsSubmitting(false);
        return;
    }
        // Payload to register user and MIS Staff details
        const payload = {
            username: formData.username,
            password: formData.password,
            misStaff: {
                email: formData.email,
                misStaffNumber: formData.misStaffNumber,
                firstName: formData.firstName,
                middleName: formData.middleName,
                lastName: formData.lastName,
                contactNumber: formData.contactNumber,
                address: formData.address,
                birthdate: formData.birthdate
            }
        };
    
        try {
            const response = await Axios.post('http://localhost:8080/user/register', payload);
            if (response.status === 200) {
                // Redirect to OTP verification page with username and email
                navigate('/account/otp', { state: { username: formData.username, email: formData.email } });
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to register. Please try again.');
            setIsSubmitting(false);
        }
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    

    return (
        <div className="body">
            <div className="logo-container">
                <img src={logo} alt="Logo" style={{ width: '200px', height: 'auto' }} />
            </div>
            <div className="container">
                <div className="title">Register</div>
                <div className="content">
                    <form onSubmit={handleSubmit} className="form-container">
                        {/* Username and Password at the Top */}
                        <div className="user-details">
                            <div className="input-box">
                                <span className="details">Username</span>
                                <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                            </div>
                            <div className="input-box">
                                <span className="details">Password</span>
                                <div className="insert">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                    {showPassword ? (
                                        <TbEyeUp className="icon" onClick={togglePasswordVisibility} />
                                    ) : (
                                        <TbEyeClosed className="icon" onClick={togglePasswordVisibility} />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* First Name, Middle Name, and Last Name Fields */}
                        <div className="user-detailed">
                            <div className="input-boxs">
                                <span className="details">First Name</span>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                            </div>
                            <div className="input-boxs">
                                <span className="details">Middle Name</span>
                                <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} />
                            </div>
                            <div className="input-boxs">
                                <span className="details">Last Name</span>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Email and Contact */}
                        <div className="user-details">
                            <div className="input-box">
                                <span className="details">Email</span>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="input-box">
                                <span className="details">Contact Number</span>
                                <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Other MIS Staff Details */}
                        <div className="user-details">
                            <div className="input-box">
                                <span className="details">MIS Staff Number</span>
                                <input type="text" name="misStaffNumber" value={formData.misStaffNumber} onChange={handleChange} required />
                            </div>
                            <div className="input-box">
                                <span className="details">Birthdate</span>
                                <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="user-details">
                            <div className="input-box" style={{ width: '400px' }}>
                                <span className="details">Address</span>
                                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="button">
                            <input type="submit" value={isSubmitting ? 'Submitting...' : 'Register'} disabled={isSubmitting} />
                        </div>

                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                    </form>
                    {/* Add "Already have an account?" link */}
                    <div className="login-link">
                        <p>Already have an account? <a href="/login">Log in here</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
