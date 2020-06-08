import { TRAIN_AND_TEST_SUCCESS, TRAIN_AND_TEST_FAILED, REMOVE_TRANSFORM, APPLY_TRANSFORM_SETTINGS, SELECT_TRANSFORM, CLEAR_TRANSFORMS, ADD_TRANSFORM, ADD_TRANSFORM_TO_MLA, MOVE_TRANSFORM, GET_TRANSFORM_DATA_START, GET_TRANSFORM_DATA_SUCCESS, GET_TRANSFORM_DATA_FAILED } from "../redux/ActionTypes";
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

export const addTransformToMLA = (id) => {
  return (dispatch) => {
    dispatch({
      type: ADD_TRANSFORM_TO_MLA,
      payload: { id }
    })
  }
}

export const moveTransform = (id, x, y) => {
  return (dispatch) => {
    dispatch({
      type: MOVE_TRANSFORM,
      payload: { id, x, y }
    })
  }
}

export const applySettings = (id, settings) => {
  return (dispatch) => {
    dispatch({
      type: APPLY_TRANSFORM_SETTINGS,
      payload: { id, settings }
    })
  }
}

export const selectTransform = (id) => {
  return (dispatch) => {
    dispatch({
      type: SELECT_TRANSFORM,
      payload: { id }
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
  let k = 0
  for(let i=0; i<data.length; i++) {
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
  return chartData
}

export const getTransformData = (fileId, allTransforms, transformId) => {
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
    axios.post('/get-transform-data/' + fileId, {
      transforms: transforms.reverse()
    }).then(res=>{
      const [inputData, outputData] = res.data
      const [inputChartData, outputChartData] = [
        getChartData(inputData, lastTransform.inputParameters), 
        getChartData(outputData, lastTransform.outputParameters)
      ]

      dispatch({
        type: GET_TRANSFORM_DATA_SUCCESS,
        payload: {
          inputData: inputChartData,
          outputData: outputChartData
        }
      })
    }).catch((err) => {
      window.alert('No file uploaded')
      dispatch({
        type: GET_TRANSFORM_DATA_FAILED,
        payload: {
          errorMessage: err
        }
      })
    })
  }
}


export const trainAndTest = (fileId, transforms, algorithmParameters) => {
  return (dispatch) => {
    dispatch({
      type: GET_TRANSFORM_DATA_START,
    })
    
    axios.defaults.baseURL = BaseUrl
    //  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
    axios.post('/train-and-test/' + fileId, {
      transforms: transforms,
      parameters: algorithmParameters
    }).then(res=>{
      const [graph, metrics] = res.data
      let graphData = []
      for(let i=0; i<graph[0].length; i++) {
        if (i%20 !== 0) {
          continue
        }
        let data = {'Time': i/20}
        for(let j=0; j<graph.length; j++) {
          data['C-' + (j+1)] = graph[j][i]
        }
        graphData.push(data)
      }

      dispatch({
        type: TRAIN_AND_TEST_SUCCESS,
        payload: {
          metrics: metrics,
          graph: graphData
        }
      })
    }).catch((err) => {
      window.alert('Something wrong, train label should  be categorized.')
      dispatch({
        type: TRAIN_AND_TEST_FAILED,
        payload: {
          errorMessage: err
        }
      })
    })
  }
}


export const removeTransform = (transformId) => {
  return (dispatch) => {
    dispatch({
      type: REMOVE_TRANSFORM,
      payload: {
        transformId: transformId
      }
    })
  }
}