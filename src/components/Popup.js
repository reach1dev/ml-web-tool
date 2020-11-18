import React from 'react';
import './Popup.scss';

export default function({open, close, position, positionTop, title, children, minWidth, customTitle, className}) {

  if (open) {
    return (
      <div className={className ? (className + ' Popup-Background') : 'Popup-Background' } onClick={close}>
        <div className={position ? 'Popup' : 'Popup Popup-Center'} style={position ? (positionTop ? {left: position, top: positionTop}: {left: position} ) : {}} onClick={(e) => e.stopPropagation()}>
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