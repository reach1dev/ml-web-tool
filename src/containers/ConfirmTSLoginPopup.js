import React from 'react';

import InlineButton from '../components/InlineButton';
import SmallButton from '../components/SmallButton';
import Popup from '../components/Popup';

export default function({open, setOpen, onYes}) {
  
  
  return (
    <Popup open={open} close={() => setOpen(false)} title='Would you like to log in to your TradeStation account?'>
    
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <InlineButton onClick={() => onYes()} value='Yes '></InlineButton>
        <span style={{width: 20}}></span>
        <SmallButton onClick={() => setOpen(false)} value=' No '></SmallButton>
      </div>
    </Popup>
  )
}