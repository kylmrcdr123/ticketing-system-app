import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  
import '../styles/EditTicketModal.css'; 
import PropTypes from 'prop-types';

const EditTicketModal = ({ ticket, onClose, onUpdate }) => {
  const [newIssue, setNewIssue] = useState(ticket.issue || '');
  const [newStatus, setNewStatus] = useState(ticket.status || 'To Do');
  const [assignedStaff, setAssignedStaff] = useState(ticket.misStaff ? ticket.misStaff.id : '');
  const [misStaffList, setMisStaffList] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMisStaff = async () => {
      try {
        const response = await axios.get('http://localhost:8080/MisStaffService/staff', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        setMisStaffList(response.data);
      } catch (error) {
        setMessageType('error');
        setMessage('Failed to fetch MIS staff. Please try again later.');
      }
    };

    fetchMisStaff();
  }, []);

  const handleUpdateTicket = async () => {
    const isUpdated =
      newIssue !== ticket.issue ||
      newStatus !== ticket.status ||
      assignedStaff !== (ticket.misStaff ? ticket.misStaff.id : '');

    if (!isUpdated) {
      setMessageType('info');
      setMessage('No changes were made.');
      return;
    }

    const updateData = {
      ticketId: ticket.ticketId,
      issue: newIssue || ticket.issue,
      status: newStatus || ticket.status,
      misStaff: assignedStaff ? { staffId: assignedStaff } : ticket.misStaff,
    };

    if (newStatus === 'Done' || newStatus === 'Closed') {
      updateData.dateFinished = new Date().toISOString();
    }

    if (!updateData.issue || !updateData.status) {
      setMessageType('error');
      setMessage('Issue and status are required fields!');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/TicketService/ticket/update/${ticket.ticketId}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        setMessageType('success');
        setMessage('Ticket updated successfully!');
        setShowSuccessMessage(true);
        if (typeof onUpdate === 'function') {
          onUpdate();
        }
      } else {
        setMessageType('error');
        setMessage('Failed to update the ticket. Please try again.');
      }
    } catch (error) {
      setMessageType('error');
      if (error.response) {
        setMessage(`Error: ${error.response.data.message || 'An error occurred.'}`);
      } else {
        setMessage('Failed to update the ticket. Please try again later.');
      }
    }
  };

  const handleGoToTicketList = () => {
    setShowSuccessMessage(false);
    onClose();
    navigate('/staff/list');
  };

  return (
    <div className="modal">
      <div className="modal-content">
        {showSuccessMessage ? (
          <div className="success-message-modal">
            <h3>{message}</h3>
            <button onClick={handleGoToTicketList}>OK</button>
          </div>
        ) : (
          <>
            <h2>Edit Ticket</h2>
            <div>
              <label>Issue:</label>
              <textarea
                value={newIssue}
                readOnly
                placeholder="Enter issue description"
                rows="5"
                className="issue-display"
              />
            </div>
            <div>
              <label>Assigned MIS Staff:</label>
              <select value={assignedStaff} onChange={(e) => setAssignedStaff(e.target.value)}>
               
                {misStaffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {`${staff.firstName} ${staff.lastName}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Status:</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            {message && <div className={`message ${messageType}`}>{message}</div>}
            <div className="modal-actions">
              <button onClick={handleUpdateTicket}>Update </button>
              <button onClick={onClose}>     Cancel  </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

EditTicketModal.propTypes = {
  ticket: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditTicketModal;
