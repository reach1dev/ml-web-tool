import React, { useState } from 'react';

import InlineButton from '../components/InlineButton';
import SmallButton from '../components/SmallButton';
import Popup from '../components/Popup';
import Spinner from './Spinner';
import TextField from '../components/TextField';
import './LoginPopup.css'

export default function({open, setOpen, username, fullNameOriginal, emailOriginal, onUpdate}) {
  const [email, setEmail] = useState(emailOriginal)
  const [fullName, setFullName] = useState(fullNameOriginal)
  const [dirty, setDirty] = useState(false)

  const validateEmail = (email) => {
    return /.+@.+\.[A-Za-z]+$/.test(email)
  }

  const validate = () => {
    if (fullName === '' || email === '' || !validateEmail(email)) {
      setDirty(true) 
      return false
    }
    return true
  }
  
  return (
    <Popup open={open} close={() => setOpen(false)} title='My account'>

      <div className='TextFieldContainer'>
        <span className='Label'>Username:</span>
        <TextField value={username} required={dirty && username===''} readOnly={true} ></TextField>
      </div>

      <div className='TextFieldContainer'>
        <span className='Label'>Email:</span>
        <TextField value={email} onChange={(e) => setEmail(e.target.value)} required={dirty && (email==='' || !validateEmail(email))}></TextField>
      </div>

      <div className='TextFieldContainer'>
        <span className='Label'>Full name:</span>
        <TextField value={fullName} onChange={(e) => setFullName(e.target.value)} required={dirty && fullName===''} ></TextField>
      </div>
    
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
        <InlineButton onClick={() => setOpen(false)} value='Close'></InlineButton>
        <SmallButton onClick={() => validate() ? onUpdate(email, fullName) : null} value='Update'></SmallButton>
      </div>
    </Popup>
  )
}