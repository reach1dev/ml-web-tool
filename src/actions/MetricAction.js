import { GET_METRIC_DATA, SET_METRIC_DATA } from '../redux/ActionTypes'


export const getMetricData = () => {
  return (dispatch) => {
    dispatch({
      type: GET_METRIC_DATA,
    })
  }
}


export const setMetricData = (metrics) => {
  return (dispatch) => {
    dispatch({
      type: SET_METRIC_DATA,
      payload: {
        metrics: metrics
      }
    })
  }
}
