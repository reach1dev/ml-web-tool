import axios from 'axios'
import { TRAINER_LOAD_SETTINGS, TRAINER_SAVE_SETTINGS, TRAINER_STARTED, TRAINER_FINISHED, TRAINER_FAILED } from '../redux/ActionTypes'
import { createTask, FAILED, PROCESSING, SUCCESS } from './TaskAction'
import { getColumns, parseGraphList } from '../model/GraphData'
import { getMetricMeta } from '../model/MetricData'
import { BaseUrl } from './Constants'
import { AlgorithmTypes, Classification, Clustering, Regression } from '../constants/TransformParameters'


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


export const startTrainer = (fileId, transforms, algParams, indexColumn) => {
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
        params: {fileId, transforms, algParams, indexColumn}
      })

    }).catch((err) => {
      window.alert('API server returned error: ' + err)
    })
  }
}

export const getTrainResult = async ({fileId, transforms, algParams, indexColumn}) => {
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
  let overviewChart = null
  let overviewMetric = null
  let data = res.data
  if (algParams.type === 6) {
    data = data.reverse()
  }
  data.forEach((res_data) => {
    const [graph, metric, confusionMatrix, contours, features] = res_data
    let columns = graph.map((g, idx) => getColumns(
      algParams.type, 
      transforms[1].inputParameters, idx, 
      algParams
    ))
    let columns1 = columns
    if (AlgorithmTypes[algParams.type] === Classification || AlgorithmTypes[algParams.type] === Regression) {
      columns1 = [(indexColumn || 'Date'), ...columns]
    }

    const chart = parseGraphList(algParams.type, graph, columns1, indexColumn, algParams)
    charts.push({
      ...chart,
      contours: contours,
      features: features,
      columns: algParams.features.filter((i, j) => algParams.inputFilters[j])
    })

    if (algParams.type > 0) {
      if (overviewChart === null) {
        overviewChart = JSON.parse(JSON.stringify(chart))
      } else {
        Object.keys(chart.mins).forEach(c => {
          if (chart.mins[c] < overviewChart.mins[c]) {
            overviewChart.mins[c] = chart.mins[c]
          }
          if (chart.maxes[c] > overviewChart.maxes[c]) {
            overviewChart.maxes[c] = chart.maxes[c]
          }
        })
        overviewChart.data = overviewChart.data.concat(chart.data)
      }
    }

    const meta = getMetricMeta(algParams.type, algParams.features.filter((_,idx) => algParams.inputFilters[idx]), algParams)
    metrics.push({
      data: metric,
      confusion: confusionMatrix.length > 0 ? confusionMatrix : null,
      meta: meta
    })

    if (overviewMetric === null) {
      overviewMetric = JSON.parse(JSON.stringify(metrics[0]))
    } else {
      confusionMatrix.forEach((r, i) => {
        r.forEach((c, j) => {
          let a = overviewMetric.confusion[i][j]
          let b = confusionMatrix[i][j]
          overviewMetric.confusion[i][j] = a + b
        })
      })
      metric.forEach((r, i) => {
        r.forEach((c, j) => {
          let a = overviewMetric.data[i][j]
          let k = a.length
          let b = metric[i][j]
          if (typeof a !== 'number') {
            a = a[k-1]
          }
          if (typeof b !== 'number') {
            b = b[k-1]
          }
          overviewMetric.data[i][j] = (a * (metrics.length-1) + b) / metrics.length
        })
      })
    }
  })
  
  if (charts.length > 1) {
    charts = [overviewChart, ...charts]
    metrics = [overviewMetric, ...metrics]
  }
  
  return {
    status: SUCCESS,
    data: {
      metrics: metrics,
      charts: charts
    }
  }
}