import React from 'react';
import '../styles/FilterComponent.css'; // Add a new CSS file for styling this filter component

const FilterComponent = ({ startDate, endDate, setStartDate, setEndDate, searchInput, setSearchInput }) => {

  const handleDateChange = (event, setDate, opposingDate, isStartDate) => {
    const date = new Date(event.target.value);
    const opposing = new Date(opposingDate);
    const currentYear = new Date().getFullYear();

    if (date.getFullYear() > currentYear) {
      alert('Date exceeds the current year');
    } else if (!isStartDate && opposingDate && date < opposing) {
      alert('Start date cannot be earlier than end date');
    } else {
      setDate(event.target.value);
    }
  };

  const handleStartDateChange = (event) => {
    handleDateChange(event, setStartDate, endDate, true);
  };

  const handleEndDateChange = (event) => {
    handleDateChange(event, setEndDate, startDate, false);
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <div className="filter-component">
      <div className="search-filter">
        <input
          type="text"
          className="search-input"
          placeholder="Search by offense or student name"
          value={searchInput}
          onChange={handleSearchChange}
        />
      </div>
      <div className="date-filter">
        <input
          type="date"
          className="date-input"
          id="start-date"
          name="start-date"
          value={startDate}
          onChange={handleStartDateChange}
        />
        <p id="to">to</p>
        <input
          type="date"
          className="date-input"
          id="end-date"
          name="end-date"
          value={endDate}
          onChange={handleEndDateChange}
        />
      </div>
    </div>
  );
};

export default FilterComponent;