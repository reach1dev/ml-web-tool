import React from 'react';
import './SmallButton.scss';

export default function({onClick, className, value}) {
  
  return (
    <div className={className ? ('SmallButton ' + className) : 'SmallButton'}  onClick={onClick}>
      <span>{ value }</span>
    </div>
  )
}
