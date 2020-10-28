import React, { useEffect, useState } from 'react';

import InlineButton from '../components/InlineButton';
import SmallButton from '../components/SmallButton';
import Popup from '../components/Popup';
import Spinner from './Spinner';
import TextField from '../components/TextField';
import './LoginPopup.css'
import { toast } from 'react-toastify';
import ConfirmTSLoginPopup from './ConfirmTSLoginPopup';

export default function({open, setOpen, onLogin}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [dirty, setDirty] = useState(false)
  const [loading, setLoading] = useState(false)
  const [failedReason, setFailedReason] = useState(' ')

  const [openConfirmDlg, setOpenConfirmDlg] = useState(false)
  const [token, setToken] = useState(null)

  let textInput = null

  useEffect(() => {
    if (open) {
      if (textInput !== null) {
        textInput.focus()
      }
      setUsername('')
      setPassword('')
      setFailedReason('')
      setDirty(false)
    }
  }, [open])

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
        if (res.type === 'success') {
          setToken(res.token)
          setOpenConfirmDlg(true)
          setOpen(false)
        } else {
          if (res.reason === 'no_account') {
            setFailedReason('Username or password is invalid.')
          } else if (res.reason === 'signup_required') {
            setFailedReason('Please signup to login.')
          } else {
            setFailedReason('Login failed.')
          }
        }
      })
    }
  }

  const loginToTS = () => {
    setOpen(false)
    setOpenConfirmDlg(false)
    if (token) {
      const redirectUri = `https://api-ml-web-tool.herokuapp.com/account/tsapi_callback/${token}`
      window.open(`https://api.tradestation.com/v2/authorize/?redirect_uri=${redirectUri}&client_id=AC853ED3-F818-4BC8-88DA-E7990DCA235F&response_type=code`, '_parent')
    }
  }

  if (!open && !openConfirmDlg) {
    return null
  }
  
  return (
    <div className='Popup-Background' >
      <ConfirmTSLoginPopup
        setOpen={setOpenConfirmDlg}
        open={openConfirmDlg}
        onYes={loginToTS}
      ></ConfirmTSLoginPopup>
      <Popup open={open} close={() => setOpen(false)} title='Login'>

        <div className='TextFieldContainer'>
          <span className='Label'>Username:</span>
          <TextField value={username} onChange={(e) => setUsername(e.target.value)} setRef={(input) => textInput = input } required={dirty && username === ''} ></TextField>
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
    </div>
  )
}