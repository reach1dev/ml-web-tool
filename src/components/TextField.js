import React from 'react';
import './TextField.scss';


export default function({placeholder, className, value, onChange}) {
  return (
    <input className={className ? ('TextField ' + className) : 'TextField'} placeholder={placeholder} value={value} onChange={onChange} />
  )
}