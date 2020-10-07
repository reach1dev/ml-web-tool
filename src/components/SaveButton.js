import React from 'react';
import './SaveButton.scss';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

export default function({onSave, className, onCancel}) {
  
  return (
    <div className={className ? ('SaveButton ' + className) : 'SaveButton'} >
      <span onClick={onSave}>
        <CheckCircleIcon className='Icon' style={{fontSize: 24}} />
      </span>
      
      <span onClick={onCancel}>
        <CancelIcon className='Icon Cancel' style={{fontSize: 24}} />
      </span>
    </div>
  )
}
