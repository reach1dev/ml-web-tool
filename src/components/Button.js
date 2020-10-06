import React from 'react';
import './Button.scss';

export default function({onClick, value, size, children}) {
  
  return (
    <div className='Button' onClick={onClick}>
      <span style={{fontSize: size}}>{ value || children }</span>
    </div>
  )
}
