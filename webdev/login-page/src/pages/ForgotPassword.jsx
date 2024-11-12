import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ForgotPassword.css';
import { TbEyeClosed, TbEyeUp } from "react-icons/tb";
import logo from '../assets/loge_new 2.png';
import backButton from '../assets/back-button.png'; // Make sure the path is correct

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordAndOTP, setShowPasswordAndOTP] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [errors, setErrors] = useState({
        username: '',
        otp: '',
        password: '',
        form: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') {
            setUsername(value);
            if (/[^a-zA-Z0-9]/.test(value)) {
                setErrors({ ...errors, username: 'Please enter a valid input (alphanumeric characters only).' });
            } else {
                setErrors({ ...errors, username: '' });
            }
        }
        if (name === 'otp') setOtp(value);
        if (name === 'password') setPassword(value);
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ username: '', otp: '', password: '', form: '' });
        setIsButtonDisabled(true);

        if (!showPasswordAndOTP) {
            if (!username) {
                setErrors({ ...errors, username: 'Username is required' });
                setIsButtonDisabled(false);
                return;
            }

            if (/[^a-zA-Z0-9]/.test(username)) {
                setErrors({ ...errors, username: 'Please enter a valid input (alphanumeric characters only).' });
                setIsButtonDisabled(false);
                return;
            }

            const userData = { username };
            try {
                const response = await axios.post('http://localhost:8080/user/forgot-password', userData);
                if (response.status === 200) {
                    setShowPasswordAndOTP(true);
                } else {
                    setErrors({ ...errors, form: 'Request failed. Please check your credentials and try again.' });
                }
            } catch (error) {
                setErrors({ ...errors, form: error.response?.data?.message || 'An error occurred while processing your request.' });
            } finally {
                setIsButtonDisabled(false);
            }
        } else {
            let validationErrors = {};
            if (!otp) validationErrors.otp = 'OTP is required';
            if (!password) validationErrors.password = 'Password is required';

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                setIsButtonDisabled(false);
                return;
            }

            const updateData = { username, otp, password };
            try {
                const response = await axios.post('http://localhost:8080/user/verify-forgot-password', updateData);
                if (response.status === 200) {
                    navigate('/Login');
                } else {
                    setErrors({ ...errors, form: 'Request failed. Please check your credentials and try again.' });
                }
            } catch (error) {
                setErrors({ ...errors, form: error.response?.data?.message || 'An error occurred while processing your request.' });
            } finally {
                setIsButtonDisabled(false);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="forgot-password">
            <div className="logo-container">
                <img src={logo} alt="Logo" style={{ width: '200px', height: 'auto' }} />
            </div>

            <div className="form-box-forgot">
                <form onSubmit={handleSubmit} className="form-container-forgot">
                    <div className="header">
                    <h1>Forgot Password</h1>
                        <img 
                            src={backButton} 
                            alt="Back" 
                            className="back-button" 
                            onClick={() => navigate('/Login')}
                        />
                      
                    </div>

                    {errors.form && <p className="error-message">{errors.form}</p>}

                    <div className="label-input-box">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            required
                            value={username}
                            onChange={handleChange}
                        />
                        {errors.username && <p className="error-message">{errors.username}</p>}
                    </div>

                    {showPasswordAndOTP && (
                        <>
                            <div className="label-input-box">
                                <label>OTP</label>
                                <input
                                    type="text"
                                    name="otp"
                                    required
                                    value={otp}
                                    onChange={handleChange}
                                />
                                {errors.otp && <p className="error-message">{errors.otp}</p>}
                            </div>
                            <div className="label-input-box show-password">
    <label>New Password</label>
    <input
        type={showPassword ? "text" : "password"}
        name="password"
        required
        value={password}
        onChange={handleChange}
    />
    {showPassword ? (
        <TbEyeUp className="icon" onClick={togglePasswordVisibility} />
    ) : (
        <TbEyeClosed className="icon" onClick={togglePasswordVisibility} />
    )}
    {errors.password && <p className="error-message">{errors.password}</p>}
</div>

                        </>
                    )}

                    {!showPasswordAndOTP ? (
                        <div className="center-button">
                        <div
    style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
    }}
>
    <button
        type="submit"
        disabled={isButtonDisabled || !username || /[^a-zA-Z0-9]/.test(username)}
        className={isButtonDisabled ? 'button-disabled' : 'button-enabled'}
    >
        Check Username
    </button>
</div>

                        </div>
                    ) : (
                        <div className="button-container">
                            <button
                                type="button"
                                className="button-cancel"
                                onClick={() => navigate('/Login')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isButtonDisabled}
                                className={isButtonDisabled ? 'button-disabled' : 'button-enabled'}
                            >
                                Change Password
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
