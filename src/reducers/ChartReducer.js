import { TRAINER_FINISHED, SET_CHART_DATA, GET_CHART_DATA, CLEAR_ALL, TRAINER_STARTED, GET_TRANSFORM_DATA_START, GET_TRANSFORM_DATA_SUCCESS, OPTIMIZER_STARTED, OPTIMIZER_FINISHED, OPTIMIZER_FAILED, TRAINER_FAILED } from '../redux/ActionTypes'


const initialState = {
  charts: [],
  loading: false
}

export default function(state = initialState, action) {
  
  switch(action.type) {
    case CLEAR_ALL:
      return initialState
    case GET_CHART_DATA: {
      return {
        ...state,
      }
    }
    case SET_CHART_DATA: {
      console.log('SET_CHART_Data >> ')
      return {
        ...state,
        charts: action.payload.charts
      }
    }
    case GET_TRANSFORM_DATA_START: {
      return {
        ...state,
        loading: true
      }
    }
    case GET_TRANSFORM_DATA_SUCCESS: {
      return {
        ...state,
        charts: action.payload.charts,
        loading: false
      }
    }
    case TRAINER_STARTED: {
      return {
        ...state,
        loading: true
      }
    }      
    case TRAINER_FINISHED: {
      return {
        ...state,
        charts: action.payload.charts,
        loading: false
      }
    }
    case OPTIMIZER_STARTED: {
      return {
        ...state,
        loading: true
      }
    }      
    case OPTIMIZER_FINISHED: {
      return {
        ...state,
        charts: action.payload.charts,
        loading: false
      }
    }
    case OPTIMIZER_FAILED: {
      return {
        ...state,
        loading: false
      }
    }
    case TRAINER_FAILED: {
      return {
        ...state,
        loading: false
      }
    }
    default: {
      return state
    }
  }
}