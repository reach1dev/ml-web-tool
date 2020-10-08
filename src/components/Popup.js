import React from 'react';
import './Popup.scss';

export default function({open, close, position, title, children}) {

  if (open) {
    return (
      <div className='Popup-Background' onClick={close}>
        <div className='Popup' style={{left: position}} onClick={(e) => e.stopPropagation()}>
          <span className='Title'>{title}</span>
          <div className='Popup-Body'> 
            {children }
          </div>
        </div>
      </div>
    )
  }

  return null
}