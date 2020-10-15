import React from 'react';

import InlineButton from '../components/InlineButton';
import Popup from '../components/Popup';

export default function({open, setOpen, onViewProfile, onLogout}) {
  return (
    <Popup open={open} close={() => setOpen(false)} position='1%'>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <InlineButton onClick={onViewProfile} value='My account'></InlineButton>
        <div style={{height: 5}}></div>
        <InlineButton onClick={onLogout} value='Logout'></InlineButton>
      </div>
    </Popup>
  )
}