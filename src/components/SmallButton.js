import React from 'react';
import './SmallButton.scss';

export default function({onClick, className, value, style}) {
  
  return (
    <div className={className ? ('SmallButton ' + className) : 'SmallButton'} style={style} onClick={onClick}>
      <span>{ value }</span>
    </div>
  )
}
