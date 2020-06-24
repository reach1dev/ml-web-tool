import { SET_METRIC_DATA, GET_METRIC_DATA, CLEAR_ALL, TRAINER_FINISHED, OPTIMIZER_FINISHED } from '../redux/ActionTypes'


const initialState = {
  metrics: []
}

export default function(state = initialState, action) {
  switch(action.type) {
    case CLEAR_ALL:
      return initialState
    case GET_METRIC_DATA: {
      return {
        ...state,
      }
    }
    case SET_METRIC_DATA: {
      return {
        ...state,
        metrics: action.payload.metrics
      }
    }
    case TRAINER_FINISHED:
      return {
        ...state,
        metrics: action.payload.metrics
      }
    case OPTIMIZER_FINISHED:
      return {
        ...state,
        metrics: action.payload.metrics
      }
    default: {
      return state
    }
  }
}