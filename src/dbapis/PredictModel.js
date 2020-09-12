import axios from 'axios'
import { BaseUrl } from '../actions/Constants'

export const savePredictModel = (modelName, transforms, parameters) => {
  
  axios.defaults.baseURL = BaseUrl
  axios.post('/save-model', {
    modelName: modelName,
    transforms: transforms,
    parameters: parameters,
  }).then((res) => {
    if (res.status === 200 && res.data.success === true) {
      window.alert('Model \"' + modelName + '\" has been saved.')
    }
  })
}

export const updatePredictModel = (modelId, transforms, parameters) => {
  axios.defaults.baseURL = BaseUrl
  axios.put('/update-model/' + modelId, {
    transforms: transforms,
    parameters: parameters,
  }).then((res) => {
    if (res.status === 200 && res.data.success === true) {
      window.alert('Model #' + modelId + ' has been updated.')
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

export const getPredictModels = async () => {
  axios.defaults.baseURL = BaseUrl
  const res = await axios.get('/list-model')
  if (res.status === 200) {
    return res.data
  }
  return []
}