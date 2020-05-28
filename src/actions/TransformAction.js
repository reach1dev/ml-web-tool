import { APPLY_TRANSFORM_SETTINGS, SELECT_TRANSFORM, CLEAR_TRANSFORMS, ADD_TRANSFORM, ADD_TRANSFORM_TO_MLA, MOVE_TRANSFORM, GET_TRANSFORM_DATA_START, GET_TRANSFORM_DATA_SUCCESS, GET_TRANSFORM_DATA_FAILED } from "../redux/ActionTypes";
import axios from 'axios'
import qs from 'querystring'
import { BaseUrl } from "./Constants";


export const clearTransforms = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_TRANSFORMS
    })
  }
}
export const addTransform = (transformData) => {
  return (dispatch) => {
    dispatch({
      type: ADD_TRANSFORM,
      payload: transformData
    })
  }
}

export const addTransformToMLA = (index) => {
  return (dispatch) => {
    dispatch({
      type: ADD_TRANSFORM_TO_MLA,
      payload: { index }
    })
  }
}

export const moveTransform = (index, x, y) => {
  return (dispatch) => {
    dispatch({
      type: MOVE_TRANSFORM,
      payload: { index, x, y }
    })
  }
}

export const applySettings = (index, settings) => {
  return (dispatch) => {
    dispatch({
      type: APPLY_TRANSFORM_SETTINGS,
      payload: { index, settings }
    })
  }
}

export const selectTransform = (index, id) => {
  return (dispatch) => {
    dispatch({
      type: SELECT_TRANSFORM,
      payload: { index }
    })
  }
}

function getChartData(data, parameters) {
  if (data === null) {
    return {
      data: [],
      dataMin: 0,
      dataMax: 0
    }
  }
  const chartData = []
  let dataMin = 99999999, dataMax = -99999999
  let k = 0
  for(let i=0; i<data.length; i+=50) {
    for(let j=2; j<8; j++) {
      if (data[i][j] > dataMax) {
        dataMax = data[i][j]
      }
      if (data[i][j] < dataMin) {
        dataMin = data[i][j]
      }
    }
    const obj = {
      Date: data[i][0],
      Time: k++
    }
    parameters.map((param, idx) => {
      if (param !== 'Date' && param !== 'Time') {
        obj[param] = data[i][idx]
      }
    })
    chartData.push(obj)
  }
  return {
    data: chartData,
    dataMin: dataMin,
    dataMax: dataMax
  }
}

export const getTransformData = (allTransforms, transformId) => {
  return (dispatch) => {
    const temp = allTransforms.filter((t) => t.id === transformId)
    if (temp.length === 0) {
      return
    }
    dispatch({
      type: GET_TRANSFORM_DATA_START,
    })

    const lastTransform = temp[0]
    const transforms = [lastTransform]
    let transform = lastTransform
    while(transform && transform.parentId) {
      const temp = allTransforms.filter((t) => t.id === transform.parentId)
      if (temp.length > 0) {
        transform = temp[0]
      } else {
        break
      }
      transforms.push(transform)
    }

    axios.defaults.baseURL = BaseUrl
    //  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
    axios.post('/get-transform-data', {
      transforms: transforms.reverse()
    }).then(res=>{
      const [inputData, outputData] = res.data
      const [inputChartData, outputChartData] = [
        getChartData(inputData, transform.inputParameters), 
        getChartData(outputData, transform.outputParameters)
      ]

      dispatch({
        type: GET_TRANSFORM_DATA_SUCCESS,
        payload: {
          inputData: inputChartData,
          outputData: outputChartData
        }
      })
    }).catch((err) => {
      dispatch({
        type: GET_TRANSFORM_DATA_FAILED,
        payload: {
          errorMessage: err
        }
      })
    })
  }
}
