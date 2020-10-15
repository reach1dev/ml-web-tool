import React from 'react';
import './TextField.scss';


export default function({placeholder, className, value, onChange, required, type, readOnly}) {
  return (
    <input className={className ? ('TextField ' + className) : 'TextField'} readOnly={readOnly} type={type} error={required ? 'yes' : 'no'} placeholder={placeholder} value={value} onChange={onChange} />
  )
}