import axios from 'axios'
import { BaseUrl } from '../actions/Constants'

export const savePredictModel = async (token, modelName, transforms, parameters) => {
  
  axios.defaults.baseURL = BaseUrl
  axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
  return axios.post('/save-model', {
    modelName: modelName,
    transforms: transforms,
    parameters: parameters,
  }).then((res) => {
    if (res.status === 200 && res.data.success === true) {
      return true
    }
  }).catch((err) => {
    console.log(err)
    return false
  })
}

export const updatePredictModel = async (token, modelId, transforms, parameters) => {
  axios.defaults.baseURL = BaseUrl
  axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
  return axios.put('/update-model/' + modelId, {
    transforms: transforms,
    parameters: parameters,
  }).then((res) => {
    if (res.status === 200 && res.data.success === true) {
      return true
    }
  }).catch((err) => {
    console.log(err)
    return false
  })
}

export const removePredictModel = (modelId) => {
  axios.defaults.baseURL = BaseUrl
  axios.delete('/remove-model/' + modelId).then((res) => {
    if (res.status === 200 && res.data.success === true) {
      window.alert('Model #' + modelId + ' has been removed.')
    }
  })
}

export const getPredictModels = async (token) => {
  axios.defaults.baseURL = BaseUrl
  axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
  const res = await axios.get('/list-model')
  if (res.status === 200) {
    return res.data
  }
  return []
}