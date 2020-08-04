import { UPLOADING_INPUT_DATA, UPLOADING_INPUT_DATA_SUCCESS, UPLOADING_INPUT_DATA_FAILED } from "../redux/ActionTypes"
import axios from 'axios'
import { BaseUrl } from "./Constants"
import { UPDATE_TRANSFORMS, REMOVE_TRANSFORM_FROM_MLA, REMOVE_TRANSFORM, APPLY_TRANSFORM_SETTINGS, SELECT_TRANSFORM, CLEAR_ALL, ADD_TRANSFORM, ADD_TRANSFORM_TO_MLA, MOVE_TRANSFORM, GET_TRANSFORM_DATA_START, GET_TRANSFORM_DATA_SUCCESS, GET_TRANSFORM_DATA_FAILED } from "../redux/ActionTypes";
import { IDS } from "../components/ItemTypes";
import { Env } from "../config";


export const clearTransforms = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_ALL
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

function getChartData(data, columns, offset, indexColumn) {
  if (data === null) {
    return []
  }
  const chartData = []
  let k = 0
  for(let i=0; i<data.length; i++) {
    // if (Env.mode === 'debug' && i%20 !== 0) {
    //   continue
    // }
    const obj = {
      Time: data[i][1],
      [indexColumn]: indexColumn === 'Date' ? Date.parse(data[i][0]) : data[i][0]
    }
    k ++
    
    columns.forEach((param, j) => {
      obj[param] = data[i][j+offset]
    })
    chartData.push(obj)
  }
  return chartData
}

export const getTransformData = (fileId, allTransforms, transformId, indexColumn) => {
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
      if (res.status === 203) {
        window.alert('Server error: ' + res.data)
        dispatch({
          type: GET_TRANSFORM_DATA_FAILED,
          payload: {
            errorMessage: res.data
          }
        })
        return
      }
      let charts = []
      const outCols = Object.values(lastTransform.outputParameters).filter(c => c !== 'Date' && c !== 'Time')
      const inCols = lastTransform.inputParameters.filter(c => c !== 'Date' && c !== 'Time')
      const mins1 = {}, maxes1 = {}, mins2 = {}, maxes2 = {}
      let data = res.data
      if (typeof res.data === 'string') {
        data = JSON.parse(res.data)
      }
      data.columns[0].forEach((col, idx) => {
        if (col === 'Date' || col === 'Time') return
        if (outCols.includes(col)) {
          mins2[col] = res.data.columns[1][idx]
          maxes2[col] = res.data.columns[2][idx]
        } else {
          mins1[col] = res.data.columns[1][idx]
          maxes1[col] = res.data.columns[2][idx]
        }
      })
      const offset = indexColumn === 'Date' && data.columns[0][1] === 'Time' ? 2 : 1
      if (lastTransform.id === IDS.InputData) {
        charts.push({
          data: getChartData(res.data.data, outCols, offset, indexColumn),
          mins: mins2,
          maxes: maxes2
        })
      } else {
        charts.push({
          data: getChartData(res.data.data, inCols, offset, indexColumn),
          mins: mins1,
          maxes: maxes1
        }, {
          data: getChartData(res.data.data, outCols, offset + inCols.length, indexColumn),
          mins: mins2,
          maxes: maxes2
        })
      }

      dispatch({
        type: GET_TRANSFORM_DATA_SUCCESS,
        payload: {
          charts: charts,
          metrics: []
        }
      })
    }).catch((err) => {
      window.alert('Server error: ' + err)
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
              sampleCount: res.data.sample_count,
              columns: res.data.columns,
              indexColumn: res.data.index
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

export const loadTransforms = (transforms) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_TRANSFORMS,
      transforms: transforms
    })
  }
}