import React from "react";

const Dropdown = ({ id, label, options, onSelect }) => (
  <div>
    <label id={id}>{label}
    
      <select id={id} onChange={(e) => onSelect(e.target.value)}>
        {options.map((option, index) => (
          <option key={index} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    
    </label>

  </div>
);

export default Dropdown;