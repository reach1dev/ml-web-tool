import React, { useEffect, useState } from 'react';

import InlineButton from '../components/InlineButton';
import SmallButton from '../components/SmallButton';
import Popup from '../components/Popup';
import Spinner from './Spinner';
import TextField from '../components/TextField';
import './LoginPopup.css'
import { toast } from 'react-toastify';

export default function({open, setOpen, onYes}) {

  
  return (
    <Popup open={open} close={() => setOpen(false)} customTitle={true} position='79%' title='Are you sure you want to start a new model? You will lose any unsaved work.'>

      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
        <InlineButton onClick={() => { onYes(); setOpen(false) } } value='Yes, I am sure'></InlineButton>
        <SmallButton onClick={() => setOpen(false)} value='No, cancel'></SmallButton>
      </div>
    </Popup>
  )
}