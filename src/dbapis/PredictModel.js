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