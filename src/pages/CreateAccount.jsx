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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);

        // Basic validations
        if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
            setErrorMessage('Please enter a valid username (alphanumeric characters only).');
            setIsSubmitting(false);
            return;
        }
        if (formData.password === '') {
            setErrorMessage('Please enter a password.');
            setIsSubmitting(false);
            return;
        }
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            setErrorMessage('Please enter a valid email address.');
            setIsSubmitting(false);
            return;
        }
        if (formData.misStaffNumber === '') {
            setErrorMessage('Please enter a valid MIS Staff Number.');
            setIsSubmitting(false);
            return;
        }

        // Payload to register user and MIS Staff details
        const payload = {
            user: {
                username: formData.username,
                password: formData.password
            },
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
                alert('MIS Staff registered successfully!');
                
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
        <div className="semi-body">
            <div className="logo-container">
                <img src={logo} alt="Logo" style={{ width: '200px', height: 'auto' }} />
            </div>
            <div className="container">
                <div className="title">Register as MIS Staff</div>
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
