import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import NavList from '../components/NavList'; // Import the NavList component
import FilterComponent from '../components/FilterComponent'; // Import the FilterComponent
import '../styles/TicketBoardStaff.css';

const AdminBoard = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState({
    todo: [], inProgress: [], done: [], close: []
  });
  const [filteredTickets, setFilteredTickets] = useState({
    todo: [], inProgress: [], done: [], close: []
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
      console.log('Token is missing or expired. Redirecting to login...');
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
        console.log('Fetched tickets:', data);
    
        if (!Array.isArray(data)) {
          throw new Error('Data format is incorrect');
        }
    
        const statusMapping = {
          'to do': 'todo',
          'in progress': 'inProgress',
          'done': 'done',
          'closed': 'close',
        };
    
        const organizedTickets = {
          todo: [], inProgress: [], done: [], close: []
        };
    
        data.forEach(ticket => {
          const normalizedStatus = statusMapping[ticket.status.toLowerCase()] || 'todo';
          organizedTickets[normalizedStatus].push(ticket);
        });
    
        setTickets(organizedTickets);
        setFilteredTickets(organizedTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
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
  
      if (selectedStatus && selectedStatus !== status) {
        statusTickets = [];
      }
  
      if (searchInput) {
        statusTickets = statusTickets.filter(ticket => {
          const assigneeName = ticket.misStaff ? `${ticket.misStaff.firstName} ${ticket.misStaff.lastName}`.toLowerCase() : '';
          return assigneeName.includes(searchInput.toLowerCase());
        });
      }
  
      if (startDate || endDate) {
        statusTickets = statusTickets.filter(ticket => {
          const ticketDate = new Date(ticket.dateCreated);
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;
          return (!start || ticketDate >= start) && (!end || ticketDate <= end);
        });
      }
  
      filtered[status] = statusTickets;
    });
  
    setFilteredTickets(filtered);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.clear();
    navigate('/login');
  };

  const handleStatusChange = (ticketId, newStatus) => {
    const updatedTickets = { 
      todo: [...tickets.todo], 
      inProgress: [...tickets.inProgress], 
      done: [...tickets.done], 
      close: [...tickets.close] 
    };
  
    const allStatuses = ['todo', 'inProgress', 'done', 'close'];
    let movedTicket = null;
  
    for (const status of allStatuses) {
      const ticketIndex = updatedTickets[status].findIndex(ticket => ticket.id === ticketId);
      if (ticketIndex > -1) {
        movedTicket = { ...updatedTickets[status][ticketIndex] };
        updatedTickets[status].splice(ticketIndex, 1);
        break;
      }
    }
  
    if (!movedTicket) {
      console.error('Unable to find the ticket');
      return;
    }
  
    movedTicket.status = newStatus === 'todo' ? 'To Do' 
                     : newStatus === 'inProgress' ? 'In Progress' 
                     : newStatus === 'done' ? 'Done' 
                     : 'Closed';
  
    updatedTickets[newStatus].push(movedTicket);
    setTickets(updatedTickets);
    setFilteredTickets(updatedTickets);
  
    fetch(`http://localhost:8080/TicketService/updateStatus/${ticketId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status: movedTicket.status }),
    })
      .then(response => {
        if (response.headers.get('content-type')?.includes('application/json')) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then(data => {
        console.log('Ticket status updated:', data);
      })
      .catch(error => console.error('Error updating ticket status:', error));
  };
  
  return (
    <div className="semi-body">
      <Helmet>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      </Helmet>
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
                      <div key={ticket.id.toString()} className="ticket-item">
                        <h5>{ticket.issue || 'No issue provided'}</h5>
                        <p>Assigned to: {ticket.misStaff ? `${ticket.misStaff.firstName} ${ticket.misStaff.lastName}` : 'Unassigned'}</p>
                        <p>Date Created: {ticket.dateCreated ? new Date(ticket.dateCreated).toLocaleString() : 'Not Available'}</p>
                        <p>Date Finished: {ticket.dateFinished ? new Date(ticket.dateFinished).toLocaleString() : 'Not Available'}</p>
                        <select
                          value={status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
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
