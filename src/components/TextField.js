import React from 'react';
import './TextField.scss';


export default function({placeholder, value, onChange}) {
  return (
    <input className='TextField' placeholder={placeholder} value={value} onChange={onChange} />
  )
}