import React from 'react';
import '../styles/FilterComponent.css'; // Add a new CSS file for styling this filter component

const FilterComponent = ({ startDate, endDate, setStartDate, setEndDate, searchInput, setSearchInput }) => {

  const handleDateChange = (event, setDate) => {
    setDate(event.target.value); // Set the selected date directly
  };

  const handleStartDateChange = (event) => {
    handleDateChange(event, setStartDate);
  };

  const handleEndDateChange = (event) => {
    handleDateChange(event, setEndDate);
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
          placeholder="Search ticket description"
          value={searchInput}
          onChange={handleSearchChange}
        />
      </div>
      <div className="date-filter">
        <label>Start Date:</label>
        <input
          type="date"
          className="date-input"
          id="start-date"
          name="start-date"
          value={startDate}
          onChange={handleStartDateChange}
        />
        <label>End Date:</label>
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
