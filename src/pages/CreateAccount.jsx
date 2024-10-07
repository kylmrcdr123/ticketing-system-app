import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import '../styles/CreateAccount.css';
import { FaUser } from "react-icons/fa";
import { TbEyeClosed, TbEyeUp } from "react-icons/tb";
import logo from '../assets/loge_new 2.png';
import AddMisStaffModal from './AddMisStaffModal'; // Updated modal name

const RegisterForm = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('misStaff');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        memberNumber: '',
        email: ''
    });
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showMisStaffModal, setShowMisStaffModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const checkUsernameAvailability = async (username) => {
        try {
            const response = await Axios.get(`http://localhost:8080/user/exists/${username}`);
            return response.data.available; // Adjust based on your API response structure
        } catch (error) {
            console.error('Error checking username availability:', error);
            return false; // Assume not available on error
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsButtonDisabled(true);
        setIsSubmitting(true);

        // Validations
        if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
            setErrorMessage('Please enter a valid username (alphanumeric characters only).');
            setIsButtonDisabled(false);
            setIsSubmitting(false);
            return;
        }
        if (formData.password === '') {
            setErrorMessage('Please enter a password.');
            setIsButtonDisabled(false);
            setIsSubmitting(false);
            return;
        }
        if (userType === 'misStaff' && formData.memberNumber === '') {
            setErrorMessage('Please enter your member number.');
            setIsButtonDisabled(false);
            setIsSubmitting(false);
            return;
        }
        if (userType === 'external' && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            setErrorMessage('Please enter a valid email address.');
            setIsButtonDisabled(false);
            setIsSubmitting(false);
            return;
        }

        // Check username availability
        const isAvailable = await checkUsernameAvailability(formData.username);
        if (!isAvailable) {
            setErrorMessage('Username is already taken.');
            setIsButtonDisabled(false);
            setIsSubmitting(false);
            return;
        }

        // Register the user
        try {
            const payload = {
                username: formData.username,
                password: formData.password,
                [userType]: {
                    memberNumber: userType === 'misStaff' ? formData.memberNumber : undefined,
                    email: userType === 'external' ? formData.email : undefined
                }
            };

            const response = await Axios.post('http://localhost:8080/user/register', payload);
            if (response.status === 200) {
                navigate('/account/otp'); // Adjust the navigation if needed
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                setErrorMessage(error.response.data.message || 'An error occurred.');
            } else {
                setErrorMessage('An error occurred while processing your request.');
            }
        } finally {
            setIsButtonDisabled(false);
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); 
    };

    const handleMisStaffSubmit = async (misStaffData) => {
        try {
            const response = await Axios.post('http://localhost:8080/misStaff/add', misStaffData);
            if (response.status === 200) {
                setShowMisStaffModal(false);
            }
        } catch (error) {
            console.error('Error adding MIS Staff:', error);
            // Handle error (optional)
        }
    };

    return (
        <div className="create-account">
            <div className="form-box-register">
                <div className="header">
                    <div className="logo">
                        <img src={logo} alt="Logo" id="logo"/>
                    </div>
                    <h1>Register</h1>
                </div>

                <form onSubmit={handleSubmit} className="form-container">
                    <div className="input-box">
                        <label>User Type:</label>
                        <select
                            name="userType"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className="select-style"
                        >
                            <option value="misStaff">MIS Staff</option>
                            <option value="external">External</option>
                        </select>
                    </div>

                    <div className="input-box">
                        <label>Username:</label>
                        <div className="insert">
                            <input type="text" name="username" value={formData.username} onChange={handleChange} />
                            <FaUser className="icon" />
                        </div>
                    </div>

                    <div className="input-box">
                        <label>Password</label>
                        <div className="insert">
                            <input type={showPassword ? "text" : "password"} required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            {showPassword ? (
                                <TbEyeUp className="icon" onClick={togglePasswordVisibility} />
                            ) : (
                                <TbEyeClosed className="icon" onClick={togglePasswordVisibility} />
                            )}
                        </div>    
                    </div>

                    {userType === 'misStaff' && (
                        <div className="input-box">
                            <label>MIS Staff Number:</label>
                            <input type="text" name="memberNumber" value={formData.memberNumber} onChange={handleChange} />
                        </div>
                    )}

                    {userType === 'external' && (
                        <div className="input-box">
                            <label>Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isButtonDisabled || isSubmitting}
                        className={isButtonDisabled || isSubmitting ? 'button-disabled1' : 'button-enabled1'}
                    >
                        {isSubmitting ? 'Submitting...' : 'Register'}
                    </button>
                    <div className="register-link">
                        <p className="noAcc">Already have an Account?<a className="click" href="/login">Click here</a></p>
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </form>
            </div>
            {showMisStaffModal && <AddMisStaffModal onClose={() => setShowMisStaffModal(false)} onSubmit={handleMisStaffSubmit} />}
        </div>
    );
};

export default RegisterForm;
