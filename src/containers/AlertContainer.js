import React, { useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/auth'
import { BaseUrl } from '../actions/Constants'
import { toast, ToastContainer } from 'react-toastify'


export default function({}) {
  const { authTokens, setAuthTokens } = useAuth()

  useEffect(() => {
    const subs = setInterval(() => {
      if (authTokens) {
        axios.defaults.baseURL = BaseUrl
        axios.defaults.headers.common = {'Authorization': `bearer ${authTokens.token}`}
        axios.get('/account/web-alert').then((res) => {
          if (res.status === 200 && res.data) {
            alert = res.data.alert_content
            toast(<div style={{color: 'black'}} dangerouslySetInnerHTML={{__html: alert}} />, {autoClose: false, position: 'bottom-right'})
          }
        }).catch((err) => {
          setAuthTokens(null)
          toast('Session is expired, please login again', {type: 'error'})
        })
      }
    }, 3600000)

    return () => {
      clearInterval(subs)
    }
  })
  
  return <ToastContainer className='Toast' style={{width: 400}}></ToastContainer>
}