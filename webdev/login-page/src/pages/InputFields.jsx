// src/components/InputField.jsx
import React from 'react';

const InputField = ({ label, type, name, value, onChange, error }) => (
    <div className="input-box">
        <label>{label}:</label>
        <input type={type} name={name} value={value} onChange={onChange} />
        {error && <p className="error-message">{error}</p>}
    </div>
);

export default InputField;
