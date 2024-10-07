import React, { useState } from 'react';
import '../styles/AddMisStaffModal.css'; // Updated CSS file if necessary

const AddMisStaffModal = ({ onClose, onSubmit }) => {
    const [misStaffData, setMisStaffData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        // Add other necessary fields here
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMisStaffData({ ...misStaffData, [name]: value });
    };

    const handleMisStaffSubmit = (e) => {
        e.preventDefault();
        onSubmit(misStaffData); // Send MIS Staff data back to the parent component
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <form onSubmit={handleMisStaffSubmit}>
                    <span className="close" onClick={onClose}>&times;</span>
                    <h2>Add MIS Staff</h2>
                    <div className='wrap'>
                        <div className="form-group">
                            <label>First Name:</label>
                            <input type="text" name="firstName" value={misStaffData.firstName} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Last Name:</label>
                            <input type="text" name="lastName" value={misStaffData.lastName} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="email" name="email" value={misStaffData.email} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Contact Number:</label>
                            <input type="text" name="contactNumber" value={misStaffData.contactNumber} onChange={handleInputChange} required />
                        </div>
                        {/* Add additional fields as necessary */}
                    </div>
                    
                    <button type="submit">Add MIS Staff</button>
                </form>
            </div>
        </div>
    );
};

export default AddMisStaffModal;
