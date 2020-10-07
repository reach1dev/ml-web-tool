import React from 'react';
import Colors from '../constants/Colors';
import './InlineButton.scss';

export default function({onClick, value, children}) {
  
  return (
    <div className='InlineButton' onClick={onClick}>
      <span>{ value || children }</span>
    </div>
  )
}