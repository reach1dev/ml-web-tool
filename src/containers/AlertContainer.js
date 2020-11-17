import React, { useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/auth'
import { BaseUrl } from '../actions/Constants'
import { toast, ToastContainer } from 'react-toastify'
import { connect } from 'react-redux';


function AlertContainer({inputFileId}) {
  const { authTokens, setAuthTokens } = useAuth()
  
  const getWebAlert = () => {
    if (authTokens && authTokens.tsDataAvailable) {
      axios.defaults.baseURL = BaseUrl
      axios.defaults.headers.common = {'Authorization': `bearer ${authTokens.token}`}
      axios.get('/account/web-alert').then((res) => {
        if (res.status === 200 && res.data) {
          alert = res.data.alert_content
          toast(<div style={{color: 'black'}} dangerouslySetInnerHTML={{__html: alert}} />, {className:'Toast-Large', autoClose: false, position: 'bottom-right'})
        }
      }).catch((err) => {
        setAuthTokens(null)
        toast('Session is expired, please login again', {type: 'error', autoClose: false})
      })
    }
  }
  useEffect(() => {
    const subs = setInterval(() => {
      getWebAlert()
    }, 5*60*1000)

    return () => {
      clearInterval(subs)
    }
  })
  
  
  return <ToastContainer className='Toast'></ToastContainer>
}



const mapStateToProps = (state) => {
  return {
    inputFileId: state.transforms.fileId,
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(AlertContainer)