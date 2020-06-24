import { GET_CHART_DATA, SET_CHART_DATA } from '../redux/ActionTypes'


export const getChartData = () => {
  return (dispatch) => {
    dispatch({
      type: GET_CHART_DATA,
    })
  }
}


export const setChartData = (charts) => {
  return (dispatch) => {
    dispatch({
      type: SET_CHART_DATA,
      payload: {
        charts: charts
      }
    })
  }
}
