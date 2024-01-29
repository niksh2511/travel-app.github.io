import React from 'react'

function Input({ label, type, name, placeholder, onChange, className, value }) {
  return (
    <div>
        
        <label htmlFor={name} id={name}>{label}</label>
        
        <input 
          type={type} 
          name={name} 
          placeholder={placeholder} 
          id={name}
          onChange={(e) => onChange(e)}
          className={className}
          value={value}
          disabled={false}
          />
    </div>
  )
}

export default Input