import axios from 'axios'
import { OPTIMIZER_OPENED, OPTIMIZER_CLOSED, OPTIMIZER_STARTED, OPTIMIZER_FINISHED, OPTIMIZER_FAILED } from '../redux/ActionTypes'
import { createTask, FAILED, PROCESSING, SUCCESS } from './TaskAction'
import { getColumns, parseGraphList, parseSimpleGraph } from '../model/GraphData'
import { getMetricMeta } from '../model/MetricData'
import { BaseUrl } from './Constants'


export const openOptimizer = (algType) => {
  return (dispatch) => {
    dispatch({
      type: OPTIMIZER_OPENED,
      payload: {
        algType: algType
      }
    })
  }
}

let currentTask = null

export const cancelOptimizer = () => {
  return (dispatch) => {
    if (currentTask) {
      currentTask.cancel()
      currentTask = null
      window.alert('Current optimization is canceled')
    }
    dispatch({
      type: OPTIMIZER_CLOSED,
    })
  }
}

export const startOptimizer = (fileId, transforms, algParams) => {
  return (dispatch) => {

    axios.defaults.baseURL = BaseUrl
    axios.post('/optimize/' + fileId, {
      transforms: transforms,
      parameters: {
        ...algParams,
      }
    }).then(res=>{

      const fileId = res.data.res_file_id
      currentTask = createTask({
        dispatch: dispatch, 
        callback: getOptimizeResult,
        createType: OPTIMIZER_STARTED,
        successType: OPTIMIZER_FINISHED,
        failedType: OPTIMIZER_FAILED,
        params: {fileId, transforms, algParams},
        interval: 5000,
        retry: 50
      })

    }).catch((err) => {
      window.alert('API server returned error: ' + err)
    })
  }
}

export const getOptimizeResult = async ({fileId, transforms, algParams}) => {
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

  let charts = []
  let params = []
  let metrics = []
  let metricsData = []
  let firstGraph = []
  res.data.forEach((data) => {
    const [graph, param] = data
    charts.push(parseSimpleGraph(graph, [algParams.type === 0 ? 'inertia' : 'score']))
    params.push(param)
    metricsData.push(graph.map(d => d[1]))
    firstGraph = graph
  })
  metrics = charts.map((c, idx) => {
    return {
      data: metricsData,
      meta: {
        title: 'Optimization result',
        main: 'Main parameter',
        rows: charts.length === 1 ? ['Scores'] : charts.map((c, idx) => 'Scores for fold-' + idx),
        columns: firstGraph.map((d, idx) => '' + d[0])
      }
    }
  })
  
  return {
    status: SUCCESS,
    data: {
      params: {
        type: algParams.type,
        ...params[0]
      },
      charts: charts,
      metrics: metrics
    }
  }
}