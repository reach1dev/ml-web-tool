import axios from 'axios';
import { BaseUrl } from '../actions/Constants';

export const loginService = async (username, password) => {
  axios.defaults.baseURL = BaseUrl
  const res = await axios.post('/auth/login', {
    username: username,
    password: password
  })
    
  return res.data
}

export const signupService = async (username, password, email, fullName) => {
  axios.defaults.baseURL = BaseUrl
  const res = await axios.post('/auth/signup', {
    username: username,
    password: password,
    email: email,
    fullname: fullName
  })
    
  return res.data
}

export const updateAccountService = async (token, email, fullName) => {
  axios.defaults.baseURL = BaseUrl
  axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
  const res = await axios.post('/account/update', {
    email: email,
    fullname: fullName
  })
    
  return res.data
}

export const updateAlertSettingsService = async (token, webAlerts, emailAlerts) => {
  axios.defaults.baseURL = BaseUrl
  axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
  const res = await axios.put('/account/alerts', {
    webAlerts: webAlerts,
    emailAlerts: emailAlerts
  })
    
  return res.data
}

export const uploadUsersFile = async (token, file) => {

  const formData = new FormData();
    formData.append("file", file);

  axios.defaults.baseURL = BaseUrl
  axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
  const res = await axios.post("/account/upload", formData)
  
  return res.data
}