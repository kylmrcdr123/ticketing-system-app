import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import NavList from '../components/NavList'; // Import the NavList component
import FilterComponent from '../components/FilterComponent'; // Import the FilterComponent
import '../styles/TicketBoardStaff.css';

const AdminBoard = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState({
    todo: [],
    inProgress: [],
    done: [],
    close: [],
  });
  const [filteredTickets, setFilteredTickets] = useState({
    todo: [],
    inProgress: [],
    done: [],
    close: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // States for search and filters
  const [searchInput, setSearchInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const exp = localStorage.getItem('exp');

    if (!token || !exp || Date.now() >= exp * 1000) {
      navigate('/login');
      return;
    }

    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:8080/TicketService/tickets', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }

        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Data format is incorrect');
        }

        // Organize tickets based on their status
        const organizedTickets = {
          todo: data.filter(ticket => ticket.status === 'To Do'),
          inProgress: data.filter(ticket => ticket.status === 'In Progress'),
          done: data.filter(ticket => ticket.status === 'Done'),
          close: data.filter(ticket => ticket.status === 'Closed'),
        };

        setTickets(organizedTickets);
        setFilteredTickets(organizedTickets); // Set initially filtered tickets
      } catch (error) {
        setError('Failed to fetch tickets. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [navigate]);

  useEffect(() => {
    filterTickets();
  }, [searchInput, startDate, endDate, selectedStatus]);

  const filterTickets = () => {
    const allStatuses = ['todo', 'inProgress', 'done', 'close'];
    const filtered = {};
  
    allStatuses.forEach((status) => {
      let statusTickets = tickets[status];
  
      // Filter by status if one is selected
      if (selectedStatus && selectedStatus !== status) {
        statusTickets = [];
      }
  
      // Filter by search input (assignee name or ticket issue)
      if (searchInput) {
        statusTickets = statusTickets.filter(ticket => {
          const assigneeName = ticket.misStaff
            ? `${ticket.misStaff.firstName} ${ticket.misStaff.lastName}`.toLowerCase()
            : '';
          const issue = ticket.issue ? ticket.issue.toLowerCase() : '';
          return (
            assigneeName.includes(searchInput.toLowerCase()) ||
            issue.includes(searchInput.toLowerCase())
          );
        });
      }
  
      // Filter by date range
      if (startDate || endDate) {
        statusTickets = statusTickets.filter(ticket => {
          const ticketDate = new Date(ticket.dateCreated);
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) : null;
    
          return (!start || ticketDate >= start) && (!end || ticketDate <= end);
        });
      }
  
      filtered[status] = statusTickets;
    });
  
    setFilteredTickets(filtered);
  };
  

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    // Update the ticket status locally
    const updatedTickets = { ...tickets };
    const allStatuses = ['todo', 'inProgress', 'done', 'close'];
    let movedTicket;

    // Find the ticket in the current status arrays
    for (const status of allStatuses) {
      const ticketIndex = updatedTickets[status].findIndex(ticket => ticket.ticketId === ticketId);
      if (ticketIndex > -1) {
        movedTicket = updatedTickets[status][ticketIndex];
        updatedTickets[status].splice(ticketIndex, 1);
        break;
      }
    }

    if (!movedTicket) {
      return;
    }

    // Update the moved ticket's status locally
    movedTicket.status = newStatus === 'todo' ? 'To Do' : newStatus === 'inProgress' ? 'In Progress' : newStatus === 'done' ? 'Done' : 'Closed';

    // Add the ticket to the new status column
    updatedTickets[newStatus].push(movedTicket);

    // Update both tickets and filteredTickets to keep the UI in sync
    setTickets(updatedTickets);
    filterTickets();

    // Update ticket status in the backend
    try {
      const response = await fetch(`http://localhost:8080/TicketService/updateStatus/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: movedTicket.status }),
      });

      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
      } else {
        const data = await response.text();
      }
    } catch (error) {
      // No console.log(), just silently handle the error
    }
  };

  return (
    <div className="semi-body">
     
      <NavList handleLogout={handleLogout} />

      <div className="content-container">
        {/* Filter Component Section */}
        <div className="filter-container">
          <FilterComponent
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            resetFilters={() => {
              setStartDate('');
              setEndDate('');
              setSearchInput('');
              setSelectedStatus('');
            }}
          />
        </div>

        {/* Ticket Board Section */}
        <div className="ticket-board-container">
          {loading && <div className="loading-message">Loading tickets...</div>}
          {error && <div className="error-message">{error}</div>}
          {!loading && !error && (
            <div className="ticket-columns">
              {['todo', 'inProgress', 'done', 'close'].map((status) => (
                <div key={status} className="ticket-column">
                  <div className={`status-box ${status}`}>
                    {status === 'todo' ? 'To Do' : status === 'inProgress' ? 'In Progress' : status === 'done' ? 'Done' : 'Closed'}
                  </div>
                  {filteredTickets[status].length > 0 ? (
                    filteredTickets[status].map((ticket) => (
                      <div key={ticket?.ticketId?.toString() || 'default-id'} className="ticket-item">
                        <h5>{ticket?.issue || 'No issue provided'}</h5>
                        <p>Assigned to: {ticket?.misStaff ? `${ticket.misStaff.firstName} ${ticket.misStaff.lastName}` : 'Unassigned'}</p>
                        <p>Date Created: {ticket?.dateCreated ? new Date(ticket.dateCreated).toLocaleString() : 'Not Available'}</p>
                        <p>Date Finished: {ticket?.dateFinished ? new Date(ticket.dateFinished).toLocaleString() : 'Not Available'}</p>
                        <select
                          value={status}
                          onChange={(e) => handleStatusChange(ticket?.ticketId, e.target.value)}
                        >
                          <option value="todo">To do</option>
                          <option value="inProgress">In progress</option>
                          <option value="done">Done</option>
                          <option value="close">Closed</option>
                        </select>
                      </div>
                    ))
                  ) : (
                    <div className="empty-message">No tickets available.</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBoard;
