import React from 'react';
import './Cell.css';

function Cell({ value, readOnly, onChange, row, col }) {
  const handleChange = (e) => {
    const val = e.target.value;
    // Allow only numbers 1-9
    if (/^[1-9]?$/.test(val)) {
      onChange(row, col, val);
    }
  };

  return (
    <input
      className={`cell ${readOnly ? 'readonly' : ''}`}
      type="text"
      maxLength="1"
      value={value || ''}
      onChange={handleChange}
      readOnly={readOnly}
    />
  );
}

export default Cell;
