import axios from 'axios'
import { BaseUrl } from '../actions/Constants'

export const savePredictModel = (token, modelName, transforms, parameters, toast = null) => {
  
  axios.defaults.baseURL = BaseUrl
  axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
  axios.post('/save-model', {
    modelName: modelName,
    transforms: transforms,
    parameters: parameters,
  }).then((res) => {
    if (res.status === 200 && res.data.success === true) {
      if (toast) {
        toast('The Model \"' + modelName + '\" has been saved to the cloud.')
      }
    }
  }).catch((err) => {
    console.log(err)
    if (toast) {
      toast('Error in saving model.')
    }
  })
}

export const updatePredictModel = (token, modelId, transforms, parameters, toast = null) => {
  axios.defaults.baseURL = BaseUrl
  axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
  axios.put('/update-model/' + modelId, {
    transforms: transforms,
    parameters: parameters,
  }).then((res) => {
    if (res.status === 200 && res.data.success === true) {
      if (toast) {
        toast('The model has been updated.')
      }
    }
  }).catch((err) => {
    console.log(err)
    if (toast) {
      toast('Error in saving model.')
    }
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