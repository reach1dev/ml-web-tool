import React, { useState } from 'react';

import InlineButton from '../components/InlineButton';
import SmallButton from '../components/SmallButton';
import Popup from '../components/Popup';
import Spinner from './Spinner';
import TextField from '../components/TextField';
import './LoginPopup.css'
import { toast } from 'react-toastify';

export default function({open, setOpen, onLogin}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [dirty, setDirty] = useState(false)
  const [loading, setLoading] = useState(false)
  const [failedReason, setFailedReason] = useState(' ')

  const validate = () => {
    if (username === '' || password === '') {
      setDirty(true) 
      return false
    }
    return true
  }
  
  const login = () => {
    if (validate()) {
      setFailedReason(' ')
      setLoading(true)
      onLogin(username, password).then((res) => {
        setLoading(false)
        if (res !== 'success') {
          if (res === 'no_account') {
            setFailedReason('Username or password is invalid.')
          } else if (res === 'signup_required') {
            setFailedReason('Please signup to login.')
          } else {
            setFailedReason('Login failed.')
          }
        }
      })
    }
  }
  
  return (
    <Popup open={open} close={() => setOpen(false)} title='Login'>

      <div className='TextFieldContainer'>
        <span className='Label'>Username:</span>
        <TextField value={username} onChange={(e) => setUsername(e.target.value)} required={dirty && username === ''} ></TextField>
      </div>
      
      <div className='TextFieldContainer'>
        <span className='Label'>Password:</span>
        <TextField type='password' value={password} onChange={(e) => setPassword(e.target.value)} required={dirty && password === ''} ></TextField>
      </div>
    
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Spinner loading={loading} type='simple'></Spinner>
        <span style={{color: 'red'}}>{failedReason}</span>
        <SmallButton onClick={() => login()} value='Login'></SmallButton>
      </div>
    </Popup>
  )
}