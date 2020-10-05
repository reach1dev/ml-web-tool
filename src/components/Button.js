import React from 'react';
import './Button.scss';

export default function({onClick, value, children}) {
  
  return (
    <div className='Button' onClick={onClick}>
      <span>{ value || children }</span>
    </div>
  )
}
