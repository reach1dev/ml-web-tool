import React from 'react';
import Colors from '../constants/Colors';
import './InlineButton.scss';

export default function({onClick, value, noTopMargin, children}) {
  
  return (
    <div className='InlineButton' style={noTopMargin ? {paddingTop: 0, fontSize: 15} : {}} onClick={onClick}>
      <span>{ value || children }</span>
    </div>
  )
}
