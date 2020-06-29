import axios from 'axios'
import { TRAINER_LOAD_SETTINGS, TRAINER_SAVE_SETTINGS, TRAINER_STARTED, TRAINER_FINISHED, TRAINER_FAILED } from '../redux/ActionTypes'
import { createTask, FAILED, PROCESSING, SUCCESS } from './TaskAction'
import { getColumns, parseGraphList } from '../model/GraphData'
import { getMetricMeta } from '../model/MetricData'
import { BaseUrl } from './Constants'
import { AlgorithmTypes, Classification, Clustering } from '../components/TransformParameters'


export const loadTrainerSettings = () => {
  return (dispatch) => {
    dispatch({
      type: TRAINER_LOAD_SETTINGS,
    })
  }
}

export const saveTrainerSettings = (options) => {
  return (dispatch) => {
    dispatch({
      type: TRAINER_SAVE_SETTINGS,
      payload: {
        options: options
      }
    })
  }
}


export const startTrainer = (fileId, transforms, algParams) => {
  return (dispatch) => {
    axios.defaults.baseURL = BaseUrl
    axios.post('/train-and-test/' + fileId, {
      transforms: transforms,
      parameters: {
        ...algParams,
      }
    }).then(res=>{

      const fileId = res.data.res_file_id
      createTask({
        dispatch: dispatch, 
        callback: getTrainResult,
        createType: TRAINER_STARTED,
        successType: TRAINER_FINISHED,
        failedType: TRAINER_FAILED,
        params: {fileId, transforms, algParams}
      })

    }).catch((err) => {
      window.alert('API server returned error: ' + err)
    })
  }
}

export const getTrainResult = async ({fileId, transforms, algParams}) => {
  const res = await axios.post('/get-train-result/' + fileId)
  if (res.status === 204) {
    return {
      status: PROCESSING
    }
  }
  if (res.status === 203) {
    window.alert(res.data.err)
    return {
      status: FAILED,
      data: res.data.err
    }
  }

  let charts = [], metrics = []
  res.data.forEach((res_data) => {
    const [graph, metric] = res_data
    let columns = graph.map((g, idx) => getColumns(
      algParams.type, 
      transforms[1].inputParameters, idx, 
      algParams
    ))
    let columns1 = columns
    if (AlgorithmTypes[algParams.type] === Classification || AlgorithmTypes[algParams.type] === Clustering) {
      columns1 = ['Date', ...columns]
    }
    charts.push(parseGraphList(algParams.type, graph, columns1, algParams))
    const meta = getMetricMeta(algParams.type, algParams.features.filter((_,idx) => algParams.inputFilters[idx]), algParams)
    metrics.push({
      data: metric,
      meta: meta
    })
  })
  
  
  return {
    status: SUCCESS,
    data: {
      metrics: metrics,
      charts: charts
    }
  }
}