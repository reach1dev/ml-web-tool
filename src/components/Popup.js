import React from 'react';
import './Popup.scss';

export default function({open, close, position, title, children, minWidth, customTitle}) {

  if (open) {
    return (
      <div className='Popup-Background' onClick={close}>
        <div className={position ? 'Popup' : 'Popup Popup-Center'} style={position ? {left: position} : {}} onClick={(e) => e.stopPropagation()}>
          { title && <span className={customTitle ? 'Custom-Title Title' : 'Title'}>{title}</span> }
          <div className='Popup-Body'> 
            {children }
          </div>
        </div>
      </div>
    )
  }

  return null
}