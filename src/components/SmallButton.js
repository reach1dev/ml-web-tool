import React from 'react';
import './SmallButton.scss';

export default function({onClick, value}) {
  
  return (
    <div className='SmallButton' onClick={onClick}>
      <span>{ value }</span>
    </div>
  )
}
