import React, {useState, useEffect} from 'react';

import InlineButton from '../components/InlineButton';
import Popup from '../components/Popup';
import TextField from '../components/TextField';

export default function({open, setOpen, setAlertThreshold, alertThreshold, setAlertCondition, alertCondition, setAlert}) {
  const [error, setError] = useState(0)

  useEffect(() => {
    setError(0)
  }, [open])

  const onSetAlert = () => {
    if (alertCondition !== '' && alertThreshold !== '' && !isNaN(Number(alertThreshold))) {
      setOpen(false)
      setAlert()
    } else {
      let error = 0
      if (alertCondition === '') {
        error += 1
      }
      if (alertThreshold === '' || isNaN(Number(alertThreshold))) {
        error += 2
      }
      setError(error)
    }
  }
  return (
    <Popup open={open} close={() => setOpen(false)} position='79%' positionTop='19%'>
      <p className='Property-Item-Header'>
        <b>Class/threshold:</b> 
        <TextField type='decimal' onChange={(e) => setAlertThreshold(e.target.value)} value={alertThreshold} required={error/2 >= 1}></TextField>
      </p>
      <p className='Property-Item-Header'>
        <b>Condition</b> 
        <select onChange={(e) => setAlertCondition(e.target.value)} value={alertCondition} className={error%2 === 1 ? 'error-select' : ''} >
          <option value="" disabled>Select..</option>
          <option value="below">Below</option>
          <option value="equal">Equal</option>
          <option value="above">Above</option>
        </select>
      </p>

      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
        <InlineButton value="Set Alert" onClick={onSetAlert}></InlineButton>
        <InlineButton value="Cancel" onClick={() => {setOpen(false); setAlertCondition(''); setAlertThreshold('')}}></InlineButton>
      </div>
    </Popup>
  )
}