import React from 'react';
import Colors from '../constants/Colors';
import './InlineButton.scss';

export default function({onClick, children}) {
  
  return (
    <div className='InlineButton' onClick={onClick}>
      <span>{ children }</span>
    </div>
  )
}
