import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TicketListStaff.css';
import { useNavigate } from 'react-router-dom';
import { RiEdit2Fill } from 'react-icons/ri';
import EditTicketModal from '../components/EditTicketModal';
import NavList from '../components/NavList'; 
import FilterComponent from '../components/FilterComponent'; 

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
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [staffList, setStaffList] = useState([]);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const ticketsResponse = await axios.get('http://localhost:8080/TicketService/tickets', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(ticketsResponse.data)) {
        setTickets(ticketsResponse.data);
      } else {
        setError('Unexpected data format received for tickets.');
      }
    } catch (error) {
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffList = async () => {
    try {
      const token = localStorage.getItem('token');
      const staffResponse = await axios.get('http://localhost:8080/MisStaffService/staff', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(staffResponse.data)) {
        setStaffList(staffResponse.data);
      }
    } catch (error) {
      setError('Failed to fetch staff list. Please try again later.');
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchStaffList(); // Fetch staff list when the component mounts
  }, []);

  useEffect(() => {
    filterTickets();
  }, [startDate, endDate, tickets, searchInput, selectedStatus, selectedStaff]);

  const filterTickets = () => {
    const filtered = tickets.filter(ticket => {
      // Extract the date part as a string in "YYYY-MM-DD" format for consistency
      const ticketDate = new Date(ticket.dateCreated).toISOString().split("T")[0];
      const start = startDate ? new Date(startDate).toISOString().split("T")[0] : null;
      const end = endDate ? new Date(endDate).toISOString().split("T")[0] : null;
  
      // Date match: Check if ticketDate is within the start and end range
      const matchDate = (!start || ticketDate >= start) && (!end || ticketDate <= end);
  
      // Other filter matches
      const matchSearch = !searchInput || (ticket.issue && ticket.issue.toLowerCase().includes(searchInput.toLowerCase()));
      const matchStatus = !selectedStatus || ticket.status === selectedStatus;
      const matchStaff = !selectedStaff || (ticket.misStaff && `${ticket.misStaff.firstName} ${ticket.misStaff.lastName}` === selectedStaff);
  
      return matchDate && matchSearch && matchStatus && matchStaff;
    });
  
    setFilteredTickets(filtered);
  };
  

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedStatus('');
    setSearchInput('');
    setSelectedStaff('');
    setFilteredTickets(tickets);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleEditClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const closeModal = () => {
    setSelectedTicket(null);
    fetchTickets(); // Refetch tickets after closing modal in case of updates
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Status dropdown options
  const statusOptions = ['To Do', 'In Progress', 'Done', 'Closed'];

  return (
    <div className="semi-body">
      <NavList handleLogout={handleLogout} />
  
      <div className="content-container">
        {/* FilterComponent on top of the ticket list */}
        <div className="filter-container">
          <FilterComponent
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            resetFilters={resetFilters}
          />
  
          {/* Filter by Status Dropdown */}
          <div className="filter-item">
    
            <select 
              id="statusFilter"
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="custom-dropdown"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
  
          {/* Filter by Staff Dropdown */}
          <div className="filter-item">
           <select 
              id="staffFilter"
              value={selectedStaff} 
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="custom-dropdown"
            >
              <option value="">All Staff</option>
              {staffList.map((staff) => (
                <option key={staff.id} value={`${staff.firstName} ${staff.lastName}`}>
                  {staff.firstName} {staff.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        {/* Ticket List below the FilterComponent */}
        <div className="list-of-tickets">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="ticket-table-container">
              <table className="ticket-table">
                <thead>
                  <tr>
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
                      <td colSpan="7">No tickets found.</td>
                    </tr>
                  ) : (
                    filteredTickets.map((ticket, index) => (
                      <tr key={ticket.ticketId || index}>
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
    </div>
  );
};

export default TicketListStaff;
