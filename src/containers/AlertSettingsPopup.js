import React, { useState } from 'react';

import InlineButton from '../components/InlineButton';
import SmallButton from '../components/SmallButton';
import Popup from '../components/Popup';

import './AlertSettingsPopup.scss'

export default function({open, setOpen, webAlertsInit, emailAlertsInit, onSave}) {

  const [webAlerts, setWebAlerts] = useState(webAlertsInit)
  const [emailAlerts, setEmailAlerts] = useState(emailAlertsInit)
  
  
  return (
    <Popup className='AlertSettingsPopup' open={open} close={() => setOpen(false)} title='Alert settings'>
      <div className='Checkbox' onClick={() => setWebAlerts(!webAlerts)}>
        <input type='checkbox' checked={webAlerts} onChange={(e) => setWebAlerts(e.target.checked)} /> Web alerts 
      </div>

      <div className='Checkbox' onClick={() => setEmailAlerts(!emailAlerts)}>
        <input type='checkbox' checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} /> Email alerts 
      </div>
    
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
        <InlineButton onClick={() => setOpen(false)} value='Close'></InlineButton>
        <SmallButton value='Save' onClick={() => { onSave(webAlerts, emailAlerts); setOpen(false) }}></SmallButton>
      </div>
    </Popup>
  )
}