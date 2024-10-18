import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditTicketModal from '../components/EditTicketModal'; // Correct import path

const ParentComponent = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [ticket, setTicket] = useState(null);
    const [tickets, setTickets] = useState([]);

    // Define the handleUpdate function
    const handleUpdate = () => {
        fetchTickets(); // Refresh the ticket list after an update
    };

    const openModal = (ticket) => {
        setTicket(ticket);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setTicket(null);
    };

    const fetchTickets = async () => {
        try {
            const response = await axios.get('http://localhost:8080/TicketService/tickets', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setTickets(response.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
            alert('Failed to fetch tickets. Please try again later.');
        }
    };

    useEffect(() => {
        fetchTickets(); // Fetch tickets when the component mounts
    }, []);

    return (
        <div>
            {tickets.map((ticket) => (
                <div key={ticket.ticketId}>
                    <h3>{ticket.issue}</h3>
                    <button onClick={() => openModal(ticket)}>Edit Ticket</button>
                </div>
            ))}
            {isModalOpen && ticket && (
                <EditTicketModal
                    ticket={ticket}
                    onClose={closeModal}
                    onUpdate={handleUpdate} // Ensure this function is passed correctly
                />
            )}
        </div>
    );
};

export default ParentComponent;
