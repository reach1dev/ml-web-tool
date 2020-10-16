import React, { useEffect, useState } from 'react';

import InlineButton from '../components/InlineButton';
import SmallButton from '../components/SmallButton';
import Popup from '../components/Popup';
import Spinner from './Spinner';
import TextField from '../components/TextField';
import './LoginPopup.css'

export default function({open, setOpen, onSignup}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [dirty, setDirty] = useState(false)
  const [loading, setLoading] = useState(false)
  const [failedReason, setFailedReason] = useState(' ')
  
  let textInput = null

  useEffect(() => {
    if (open) {
      if (textInput !== null) {
        textInput.focus()
      }
      setUsername('')
      setPassword('')
      setFullName('')
      setEmail('')
      setFailedReason('')
      setDirty(false)
    }
  }, [open])

  const validateEmail = (email) => {
    return /.+@.+\.[A-Za-z]+$/.test(email)
  }

  const validate = () => {
    if (username === '' || fullName === '' || password === '' || email === '' || !validateEmail(email)) {
      setDirty(true) 
      return false
    }
    return true
  }

  const signup = () => {
    if (validate()) {
      setFailedReason(' ')
      setLoading(true)
      onSignup(username, email, fullName, password).then((res) => {
        setLoading(false)
        if (res !== 'success') {
          if (res === 'no_account') {
            setFailedReason('Username or password is invalid.')
          } else if (res === 'already_created') {
            setFailedReason('Account is already created.')
          } else {
            setFailedReason('Signup failed.')
          }
        }
      })
    }
  }
  
  return (
    <Popup open={open} close={() => setOpen(false)} title='Signup'>

      <div className='TextFieldContainer'>
        <span className='Label'>Username:</span>
        <TextField value={username} required={dirty && username===''} onChange={(e) => setUsername(e.target.value)} setRef={(input) => textInput = input} setFocus={true}></TextField>
      </div>

      <div className='TextFieldContainer'>
        <span className='Label'>Email:</span>
        <TextField value={email} onChange={(e) => setEmail(e.target.value)} required={dirty && (email==='' || !validateEmail(email))}></TextField>
      </div>

      <div className='TextFieldContainer'>
        <span className='Label'>Full name:</span>
        <TextField value={fullName} onChange={(e) => setFullName(e.target.value)} required={dirty && fullName===''} ></TextField>
      </div>
      
      <div className='TextFieldContainer'>
        <span className='Label'>Password:</span>
        <TextField type='password' value={password} onChange={(e) => setPassword(e.target.value)} required={dirty && password===''} ></TextField>
      </div>
    
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Spinner loading={loading} type='simple'></Spinner>
        <span style={{color: 'red'}}>{failedReason}</span>
        <SmallButton onClick={() => signup()} value='Signup'></SmallButton>
      </div>
    </Popup>
  )
}