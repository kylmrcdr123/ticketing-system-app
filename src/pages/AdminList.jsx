import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TicketListStaff.css';
import { useNavigate } from 'react-router-dom';
import { RiEdit2Fill } from 'react-icons/ri';
import EditTicketModal from '../components/EditTicketModal';
import NavList from '../components/NavList'; // Import NavList component
import FilterComponent from '../components/FilterComponent'; // Import the FilterComponent

const TicketListStaff = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTicketsAndStaff = async () => {
    try {
      const token = localStorage.getItem('token');

      const ticketsResponse = await axios.get('http://localhost:8080/TicketService/tickets', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched tickets:', ticketsResponse.data);

      if (Array.isArray(ticketsResponse.data)) {
        setTickets(ticketsResponse.data);
      } else {
        setError('Unexpected data format received for tickets.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketsAndStaff();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [startDate, endDate, tickets, searchInput, selectedStatus]);

  const filterTickets = () => {
    let filtered = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.dateCreated);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const matchDate = (!start || ticketDate >= start) && (!end || ticketDate <= end);
      const matchSearch = !searchInput || (ticket.issue && ticket.issue.toLowerCase().includes(searchInput.toLowerCase()));
      const matchStatus = !selectedStatus || ticket.status === selectedStatus;

      return matchDate && matchSearch && matchStatus;
    });
    setFilteredTickets(filtered);
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedStatus('');
    setSearchInput('');
    setFilteredTickets(tickets);
  };

  const formatDate = (dateString) => {
    let date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleEditClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const closeModal = () => {
    setSelectedTicket(null);
    fetchTicketsAndStaff();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="semi-body">
    <div className="list-of-tickets">
      {/* Call NavList component for the navigation bar */}
      <NavList handleLogout={handleLogout} />

        {/* Use the FilterComponent */}
        <FilterComponent
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="ticket-table-container">
            <table className="ticket-table">
            <thead>
  <tr>
    {/* Remove <th>ID</th> */}
    <th>Issue</th>
    <th>Status</th>
    <th>Date Created</th>
    <th>Date Finished</th>
    <th>Assigned To</th>
    <th>Reporter Type</th>
    <th>Actions</th>
  </tr>
</thead>
<tbody>
  {filteredTickets.length === 0 ? (
    <tr>
      <td colSpan="7">No tickets found.</td> {/* Update colSpan to 7 */}
    </tr>
  ) : (
    filteredTickets.map((ticket, index) => (
      <tr key={ticket.ticketId || index}>
        {/* Remove the ID cell */}
        <td>{ticket.issue || 'No issue description'}</td>
        <td>{ticket.status}</td>
        <td>{formatDate(ticket.dateCreated)}</td>
        <td>{ticket.dateFinished ? formatDate(ticket.dateFinished) : 'Not finished'}</td>
        <td>{ticket.misStaff ? `${ticket.misStaff.firstName} ${ticket.misStaff.lastName}` : 'Unassigned'}</td>
        <td>{ticket.reporter || 'Unknown'}</td>
        <td>
          <button className="edit-button" onClick={() => handleEditClick(ticket)}>
            <RiEdit2Fill />
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>
          </div>
        )}
        {selectedTicket && <EditTicketModal ticket={selectedTicket} onClose={closeModal} />}
      </div>
    
    </div>
  );
};

export default TicketListStaff;
