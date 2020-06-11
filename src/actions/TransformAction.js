import { TRAIN_AND_TEST_STARTED, UPLOADING_INPUT_DATA, UPLOADING_INPUT_DATA_SUCCESS, UPLOADING_INPUT_DATA_FAILED } from "../redux/ActionTypes"
import axios from 'axios'
import { BaseUrl } from "./Constants"
import { REMOVE_TRANSFORM_FROM_MLA, TRAIN_AND_TEST_SUCCESS, TRAIN_AND_TEST_FAILED, REMOVE_TRANSFORM, APPLY_TRANSFORM_SETTINGS, SELECT_TRANSFORM, CLEAR_TRANSFORMS, ADD_TRANSFORM, ADD_TRANSFORM_TO_MLA, MOVE_TRANSFORM, GET_TRANSFORM_DATA_START, GET_TRANSFORM_DATA_SUCCESS, GET_TRANSFORM_DATA_FAILED } from "../redux/ActionTypes";


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

export const removeTransformFromMLA = (id) => {
  return (dispatch) => {
    dispatch({
      type: REMOVE_TRANSFORM_FROM_MLA,
      payload: { id }
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

function getChartData(data, columns) {
  if (data === null) {
    return []
  }
  const chartData = []
  let k = 0
  for(let i=0; i<data.length; i++) {
    const obj = {
      Date: data[i][0],
      Time: k++
    }
    columns.map((param, idx) => {
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
      const mins = {}, maxes = {}
      res.data.columns[0].forEach((col, idx) => {
        if (col === 'Date' || col === 'Time') return
        mins[col] = res.data.columns[1][idx]
        maxes[col] = res.data.columns[2][idx]
      })
      dispatch({
        type: GET_TRANSFORM_DATA_SUCCESS,
        payload: {
          chart: {
            data: getChartData(res.data.data, res.data.columns[0]),
            mins: mins,
            maxes: maxes
          },
        }
      })
    }).catch((err) => {
      window.alert('Server is busy or you may set wrong input data for any transforms.')
      console.log(err)
      dispatch({
        type: GET_TRANSFORM_DATA_FAILED,
        payload: {
          errorMessage: err
        }
      })
    })
  }
}


export const getTrainResult = (resFileId, algorithmParameters) => {
  return async (dispatch) => {
    axios.defaults.baseURL = BaseUrl
    const res = await axios.post('/get-train-result/' + resFileId)
    if (res.status !== 200) {
      return false
    }
    if (res.status === 400) {
      dispatch({
        type: TRAIN_AND_TEST_FAILED,
        payload: {
          errorMessage: 'Train failed, possible reasons: train label should  be categorized for kNN.'
        }
      })
      return true
    }
    const [graph, metrics] = res.data
    let graphData = []
    let mins = {}
    let maxes = {}
    for(let i=0; i<graph[0].length; i++) {
      // if (i%20 !== 0) {
      //   continue
      // }
      let data = {'Time': i} ///20

      for(let j=0; j<graph.length; j++) {
        let label = 'C-' + (j+1)
        if (algorithmParameters.algorithmType === 1) {
          label = (j === 0 ? 'Predict' : 'Target')
        }
        data[label] = graph[j][i]
        if (mins[label] === undefined || graph[j][i] < mins[label]) {
          mins[label] = graph[j][i]
        }
        if (maxes[label] === undefined || graph[j][i] > maxes[label]) {
          maxes[label] = graph[j][i]
        }
      }
      graphData.push(data)
    }

    dispatch({
      type: TRAIN_AND_TEST_SUCCESS,
      payload: {
        metrics: metrics,
        chart: {
          data: graphData,
          mins: mins,
          maxes: maxes
        }
      }
    })
    return true
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
      dispatch({
        type: TRAIN_AND_TEST_STARTED,
        payload: {
          resFileId: res.data.res_file_id
        }
      })

      let time = 0
      const timer = setInterval(async () => {
        if (time < 20) {
          if(await getTrainResult(res.data.res_file_id, algorithmParameters)(dispatch)) {
            clearInterval(timer)
          }
        } else {
          clearInterval(timer)
          dispatch({
            type: TRAIN_AND_TEST_FAILED,
            payload: {
              errorMessage: 'Something wrong, train label should  be categorized.'
            }
          })
        }
        time ++
      }, 5000)
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

export const uploadInputData = (file) => {
  return (dispatch) => {
    dispatch({
      type: UPLOADING_INPUT_DATA,
    })

    const formData = new FormData();
      formData.append("file", file);

    axios.defaults.baseURL = BaseUrl
    // axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
    axios
      .post("/upload-input-data", formData)
      .then(res => {
        if (res.status === 200) {
          dispatch({
            type: UPLOADING_INPUT_DATA_SUCCESS,
            payload: {
              file: file.name,
              fileId: res.data.file_id,
              columns: res.data.columns
            }
          })
        } else {
          dispatch({
            type: UPLOADING_INPUT_DATA_FAILED,
          })
        }
      })
      .catch(err => console.log(err));
  }
}